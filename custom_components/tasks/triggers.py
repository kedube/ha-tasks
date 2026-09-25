"""
Trigger-type strategies for tasks.

Each task has a trigger type (time, date, count, or runtime) that controls
when the task becomes due, what progress it reports, and what completing it
means. All of that per-type logic lives here so the store, the entities, and
the websocket API share a single implementation.
"""

from __future__ import annotations

from datetime import date, timedelta
from typing import TYPE_CHECKING, Any

from dateutil.relativedelta import relativedelta
from homeassistant.util import dt as dt_util

from .datetime_utils import parse_local_datetime

if TYPE_CHECKING:
    from collections.abc import Callable, Mapping
    from datetime import datetime

    from homeassistant.core import HomeAssistant

    from .store import Task

UNAVAILABLE_STATES = ("unknown", "unavailable")

# Hard cap on projection loop steps. It bounds the fast-forward over the
# skipped past repetitions of a badly overdue task (~13 years of a daily
# task) without letting a corrupt interval spin forever.
_MAX_PROJECTION_STEPS = 5000


class _Unset:
    """Sentinel for "no precomputed due date supplied" (None is a real value)."""


UNSET = _Unset()


def _advance_to_active_month(day: date, active_months: list[int]) -> date:
    """
    Move a due date forward into the task's next active month.

    A date already inside an active month (or a task without a seasonal
    restriction) is returned unchanged; otherwise the date becomes the first
    day of the next active month, so a seasonal task resumes at the start of
    its season instead of being flagged overdue all winter.
    """
    if not active_months or day.month in active_months:
        return day
    year, month = day.year, day.month
    for _ in range(12):
        month += 1
        if month > 12:  # noqa: PLR2004
            month = 1
            year += 1
        if month in active_months:
            return date(year, month, 1)
    return day


def _next_season_boundary(today: date, active_months: list[int]) -> date | None:
    """
    Return the next first-of-month where the season's active state flips.

    A seasonal task's due state can change without any completion or task
    edit — the season ending (due -> not due) or starting (a pending
    occurrence resurfacing). This is the next such moment, used to schedule
    entity refreshes; None for year-round tasks.
    """
    if not active_months:
        return None
    currently_active = today.month in active_months
    year, month = today.year, today.month
    for _ in range(12):
        month += 1
        if month > 12:  # noqa: PLR2004
            month = 1
            year += 1
        if (month in active_months) != currently_active:
            return date(year, month, 1)
    return None


def _parse_anchor(value: str | None) -> date | None:
    """Parse a stored anchor into a calendar date, tolerating datetimes."""
    if not value:
        return None
    return dt_util.parse_date(str(value).split("T")[0])


def _project_future(
    occurrence_at: Callable[[int], date],
    horizon: datetime,
    limit: int,
) -> list[datetime]:
    """
    Shared projection loop for dated triggers.

    Always includes the k=0 occurrence — the real next due date, even when it
    lies in the past (an overdue task) or beyond the horizon. Repetitions
    assume the task is completed on each due date, so a repetition landing in
    the past (a badly overdue task) is meaningless: it is skipped without
    consuming the limit, and the step cap bounds that fast-forward.

    The loop compares plain calendar dates and localizes only the occurrences
    it keeps — a badly overdue short-interval task can skip thousands of past
    repetitions, and per-step timezone localization would dominate that walk.
    """
    first = occurrence_at(0)
    today = dt_util.now().date()
    horizon_date = dt_util.as_local(horizon).date()
    kept = [first]
    previous = first
    for k in range(1, _MAX_PROJECTION_STEPS):
        occurrence = occurrence_at(k)
        # Stop on a non-advancing (zero-length) interval, defensively.
        if occurrence <= previous:
            break
        previous = occurrence
        if occurrence > horizon_date:
            break
        if occurrence > today:
            kept.append(occurrence)
            if len(kept) >= max(limit, 1):
                break
    return [dt_util.start_of_local_day(day) for day in kept]


def _interval_offset(
    interval_type: str, interval_value: int, k: int
) -> timedelta | relativedelta:
    """
    Return the offset of k whole intervals.

    Month/year offsets multiply inside a single relativedelta instead of being
    added repeatedly, so a Jan 31 anchor doesn't drift to the 28th forever
    after passing one February.
    """
    if interval_type == "weeks":
        return timedelta(weeks=interval_value * k)
    if interval_type == "months":
        return relativedelta(months=interval_value * k)
    if interval_type == "years":
        return relativedelta(years=interval_value * k)
    return timedelta(days=interval_value * k)


class TimeTrigger:
    """Due when the configured interval since last_performed has elapsed."""

    type = "time"

    def watched_entity(self, task: Task) -> str | None:
        """Return the entity this trigger monitors, if any."""
        return None

    def validate(self, fields: Mapping[str, Any]) -> str | None:
        """Return an error message when required trigger fields are missing."""
        return None

    def initialize(self, hass: HomeAssistant, task: Task) -> None:
        """Set up trigger-specific state when a task is created or retyped."""

    def on_complete(self, hass: HomeAssistant, task: Task) -> None:
        """Apply trigger-specific effects of completing the task."""

    def force_overdue(self, hass: HomeAssistant, task: Task) -> None:
        """
        Backdate trigger state so the task reads as due (mark_overdue service).

        Sets last_performed one whole interval before yesterday, putting the
        next due date in the past. Raises RuntimeError when the trigger state
        cannot be forced.
        """
        # Out of season the is_due gate would keep the entity off no matter
        # how far back the completion is pushed — fail loudly rather than
        # letting the service "succeed" with no visible effect.
        if task.active_months and dt_util.now().month not in task.active_months:
            msg = "cannot mark a seasonal task overdue outside its active months"
            raise RuntimeError(msg)
        yesterday = dt_util.now().date() - timedelta(days=1)
        task.last_performed = dt_util.start_of_local_day(
            yesterday
            - _interval_offset(task.interval_type, max(task.interval_value, 1), 1)
        ).isoformat()

    def next_due(self, hass: HomeAssistant, task: Task) -> datetime | None:
        """Return the datetime the task becomes due, if computable."""
        last = parse_local_datetime(task.last_performed)
        if last is None:
            return None

        # Add the interval to the local calendar *date*, then rebuild local
        # midnight for the resulting date. Doing the arithmetic on the date
        # (not the aware datetime) means a DST transition inside the interval
        # can't push the due moment onto the neighboring day.
        due_date = last.date() + _interval_offset(
            task.interval_type, task.interval_value, 1
        )
        # A seasonal task's due date lands in its next active month.
        due_date = _advance_to_active_month(due_date, task.active_months)
        # start_of_local_day accepts a date and returns local midnight for it.
        return dt_util.start_of_local_day(due_date)

    def is_due(
        self,
        hass: HomeAssistant,
        task: Task,
        due: datetime | None | _Unset = UNSET,
    ) -> bool:
        """
        Return whether the task is currently due.

        `due` lets a caller that already computed next_due pass it back in,
        so serializing a task (or the aggregate sensor's pass over every
        task) doesn't run the same interval/season walk twice. Omit it and
        the due date is computed here as before.
        """
        # A seasonal task is never due outside its active months — an
        # occurrence left uncompleted when the season ended resurfaces when
        # the next season starts, instead of nagging all year.
        if task.active_months and dt_util.now().month not in task.active_months:
            return False
        if isinstance(due, _Unset):
            due = self.next_due(hass, task)
        if due is None:
            return True
        return dt_util.start_of_local_day() >= due

    def next_transition(
        self,
        hass: HomeAssistant,
        task: Task,
        due: datetime | None | _Unset = UNSET,
    ) -> datetime | None:
        """
        Return the next wall-clock moment the due state may flip on its own.

        As with is_due, `due` accepts an already-computed next_due so one
        pass over the tasks doesn't recompute it per call.

        Entities schedule their refresh timer here. For most tasks that is
        the next due moment; a seasonal task can also flip at a season
        boundary — off when the season ends with the task still due, and back
        on when the season resumes with an occurrence pending — with no
        completion or task edit firing a signal.
        """
        now = dt_util.now()
        candidates = []
        if isinstance(due, _Unset):
            due = self.next_due(hass, task)
        if due is not None and due > now:
            candidates.append(due)
        boundary = _next_season_boundary(now.date(), task.active_months)
        if boundary is not None:
            candidates.append(dt_util.start_of_local_day(boundary))
        return min(candidates) if candidates else None

    def upcoming(
        self,
        hass: HomeAssistant,
        task: Task,
        horizon: datetime,
        limit: int,
    ) -> list[datetime]:
        """
        Project due moments: next_due plus future repetitions in the horizon.

        See _project_future for the shared semantics (overdue first
        occurrence kept, past repetitions skipped).
        """
        first = self.next_due(hass, task)
        if first is None:
            return []
        first_date = dt_util.as_local(first).date()
        if task.active_months:
            # Seasonal repetitions chain from the previous *adjusted*
            # occurrence (assume completed on its due date, add the interval,
            # skip to the next active month), so they cannot be expressed as
            # anchor + k * interval. Memoized so _project_future's sequential
            # occurrence_at(k) calls stay O(1) each.
            memo: dict[int, date] = {0: first_date}

            def occurrence_at(k: int) -> date:
                for i in range(len(memo), k + 1):
                    memo[i] = _advance_to_active_month(
                        memo[i - 1]
                        + _interval_offset(task.interval_type, task.interval_value, 1),
                        task.active_months,
                    )
                return memo[k]

            return _project_future(occurrence_at, horizon, limit)
        return _project_future(
            lambda k: (
                first_date
                + _interval_offset(task.interval_type, task.interval_value, k)
            ),
            horizon,
            limit,
        )

    def progress(self, hass: HomeAssistant, task: Task) -> tuple[float, float] | None:
        """Return (current, target) progress toward due, if applicable."""
        return None

    def extra_attributes(self, hass: HomeAssistant, task: Task) -> dict:
        """Return trigger-specific entity attributes."""
        due = self.next_due(hass, task)
        attributes = {
            "interval_value": task.interval_value,
            "interval_type": task.interval_type,
            "next_due": due.isoformat() if due else "unknown",
            # 0 = due today, negative = overdue, None = never performed.
            "days_until_due": (
                (dt_util.as_local(due).date() - dt_util.now().date()).days
                if due
                else None
            ),
        }
        if task.active_months:
            attributes["active_months"] = task.active_months
        return attributes


class DateTrigger(TimeTrigger):
    """
    Due on fixed calendar dates: an anchor date plus interval repetitions.

    Unlike the time trigger, the schedule never shifts: occurrences fall on
    anchor + k * interval regardless of when the task was last completed.
    The next due date is the first occurrence strictly after the last
    completion, so an overdue occurrence stays due until completed after it.
    """

    type = "date"

    def validate(self, fields: Mapping[str, Any]) -> str | None:
        """Return an error message when required trigger fields are missing."""
        if _parse_anchor(fields.get("anchor_date")) is None:
            return "date tasks require a valid anchor_date"
        if (fields.get("interval_value") or 0) <= 0:
            return "date tasks require a positive interval_value"
        return None

    def _anchor(self, task: Task) -> date | None:
        """Return the anchor as a calendar date, or None when unparseable."""
        return _parse_anchor(task.anchor_date)

    def _next_index(self, task: Task) -> int | None:
        """Return k of the first occurrence strictly after the last completion."""
        last = parse_local_datetime(task.last_performed)
        return self._index_after(task, last.date() if last else None)

    def _index_after(self, task: Task, ref: date | None) -> int | None:
        """Return k of the first occurrence strictly after the reference date."""
        anchor = self._anchor(task)
        if anchor is None:
            return None
        if ref is None or ref < anchor:
            return 0
        last_date = ref
        interval = max(task.interval_value, 1)
        # Land at (or just below) the target analytically, then step the last
        # bit — keeps this O(1)-ish even for a daily anchor set years ago.
        if task.interval_type == "weeks":
            k = (last_date - anchor).days // (7 * interval)
        elif task.interval_type == "months":
            months = (last_date.year - anchor.year) * 12 + (
                last_date.month - anchor.month
            )
            k = max(months // interval - 1, 0)
        elif task.interval_type == "years":
            k = max((last_date.year - anchor.year) // interval - 1, 0)
        else:
            k = (last_date - anchor).days // interval
        while (anchor + _interval_offset(task.interval_type, interval, k)) <= last_date:
            k += 1
        return k

    def force_overdue(self, hass: HomeAssistant, task: Task) -> None:
        """Backdate the last completion to just before the latest occurrence."""
        today = dt_util.now().date()
        anchor = self._anchor(task)
        next_k = self._index_after(task, today)
        if anchor is None or next_k is None:
            msg = "date task has no valid anchor_date"
            raise RuntimeError(msg)
        if next_k == 0:
            msg = "cannot mark overdue: the task's first occurrence is in the future"
            raise RuntimeError(msg)
        # The most recent occurrence on or before today; completing "the day
        # before it" makes it the next due date again.
        occurrence = anchor + _interval_offset(
            task.interval_type, max(task.interval_value, 1), next_k - 1
        )
        task.last_performed = dt_util.start_of_local_day(
            occurrence - timedelta(days=1)
        ).isoformat()

    def next_due(self, hass: HomeAssistant, task: Task) -> datetime | None:
        """Return the next fixed occurrence after the last completion."""
        k = self._next_index(task)
        anchor = self._anchor(task)
        if k is None or anchor is None:
            return None
        interval = max(task.interval_value, 1)
        return dt_util.start_of_local_day(
            anchor + _interval_offset(task.interval_type, interval, k)
        )

    def upcoming(
        self,
        hass: HomeAssistant,
        task: Task,
        horizon: datetime,
        limit: int,
    ) -> list[datetime]:
        """
        Project fixed occurrences from the next due date onward.

        Uses the shared _project_future semantics; occurrences stay indexed
        from the anchor (not re-added from the previous occurrence), so
        month-end anchors never drift.
        """
        next_index = self._next_index(task)
        anchor = self._anchor(task)
        if next_index is None or anchor is None:
            return []
        interval = max(task.interval_value, 1)
        return _project_future(
            lambda k: (
                anchor + _interval_offset(task.interval_type, interval, next_index + k)
            ),
            horizon,
            limit,
        )

    def extra_attributes(self, hass: HomeAssistant, task: Task) -> dict:
        """Return trigger-specific entity attributes."""
        return {
            **super().extra_attributes(hass, task),
            "anchor_date": task.anchor_date,
        }


class CountTrigger(TimeTrigger):
    """Due when a monitored entity has turned on a threshold number of times."""

    type = "count"

    def watched_entity(self, task: Task) -> str | None:
        """Return the entity this trigger monitors, if any."""
        return task.count_entity_id

    def validate(self, fields: Mapping[str, Any]) -> str | None:
        """Return an error message when required trigger fields are missing."""
        threshold = fields.get("count_threshold") or 0
        if not fields.get("count_entity_id") or threshold <= 0:
            return "count tasks require count_entity_id and a positive threshold"
        return None

    def initialize(self, hass: HomeAssistant, task: Task) -> None:
        """Set up trigger-specific state when a task is created or retyped."""
        task.current_count = 0

    def on_complete(self, hass: HomeAssistant, task: Task) -> None:
        """Reset the counter when the task is completed."""
        task.current_count = 0

    def force_overdue(self, hass: HomeAssistant, task: Task) -> None:
        """Raise the counter to the threshold so the task reads as due."""
        task.current_count = max(task.current_count, task.count_threshold)

    def next_due(self, hass: HomeAssistant, task: Task) -> datetime | None:
        """Count-based tasks have no date-based due point."""
        return None

    def is_due(
        self,
        hass: HomeAssistant,
        task: Task,
        due: datetime | None | _Unset = UNSET,
    ) -> bool:
        """Return whether the task is currently due."""
        return task.count_threshold > 0 and task.current_count >= task.count_threshold

    def progress(self, hass: HomeAssistant, task: Task) -> tuple[float, float] | None:
        """Return (current, target) progress toward due."""
        return (task.current_count, task.count_threshold)

    def extra_attributes(self, hass: HomeAssistant, task: Task) -> dict:
        """Return trigger-specific entity attributes."""
        return {
            "current_count": task.current_count,
            "count_threshold": task.count_threshold,
            "count_entity_id": task.count_entity_id,
        }


class RuntimeTrigger(TimeTrigger):
    """Due when a numeric sensor has accumulated a threshold since baseline."""

    type = "runtime"

    def watched_entity(self, task: Task) -> str | None:
        """Return the entity this trigger monitors, if any."""
        return task.runtime_entity_id

    def validate(self, fields: Mapping[str, Any]) -> str | None:
        """Return an error message when required trigger fields are missing."""
        threshold = fields.get("runtime_threshold") or 0
        if not fields.get("runtime_entity_id") or threshold <= 0:
            return "runtime tasks require runtime_entity_id and a positive threshold"
        return None

    def current_value(self, hass: HomeAssistant, task: Task) -> float | None:
        """Return the monitored sensor's numeric value, if available."""
        if not task.runtime_entity_id:
            return None
        state = hass.states.get(task.runtime_entity_id)
        if state is None or state.state in UNAVAILABLE_STATES:
            return None
        try:
            return float(state.state)
        except (ValueError, TypeError):
            return None

    def delta(self, hass: HomeAssistant, task: Task) -> float:
        """Return accumulation since baseline, tolerating external resets."""
        value = self.current_value(hass, task)
        # A pending (None) baseline hasn't been captured yet — no progress.
        if value is None or task.runtime_baseline is None:
            return 0
        # A value below the recorded baseline means the source sensor was
        # reset externally; treat the baseline as 0 so progress stays sane.
        baseline = task.runtime_baseline if value >= task.runtime_baseline else 0
        return round(value - baseline, 2)

    def initialize(self, hass: HomeAssistant, task: Task) -> None:
        """
        Capture the sensor's current value as the baseline.

        If the sensor is unavailable, leave the baseline pending (None) so it
        is captured from the first real reading instead of anchoring at 0 and
        turning the sensor's whole lifetime total into accumulated runtime.
        """
        task.runtime_baseline = self.current_value(hass, task)

    def on_complete(self, hass: HomeAssistant, task: Task) -> None:
        """
        Re-baseline at the sensor's current value on completion.

        If the sensor is unavailable, leave the baseline pending rather than
        keeping the stale one (which would pop the task straight back to due
        when the sensor recovers).
        """
        task.runtime_baseline = self.current_value(hass, task)

    def force_overdue(self, hass: HomeAssistant, task: Task) -> None:
        """Lower the baseline a full threshold below the sensor's value."""
        value = self.current_value(hass, task)
        if value is None:
            msg = "cannot mark overdue: the runtime sensor is unavailable"
            raise RuntimeError(msg)
        task.runtime_baseline = value - task.runtime_threshold

    def next_due(self, hass: HomeAssistant, task: Task) -> datetime | None:
        """Runtime-based tasks have no date-based due point."""
        return None

    def is_due(
        self,
        hass: HomeAssistant,
        task: Task,
        due: datetime | None | _Unset = UNSET,
    ) -> bool:
        """Return whether the task is currently due."""
        if task.runtime_threshold <= 0:
            return False
        if self.current_value(hass, task) is None:
            return False
        return self.delta(hass, task) >= task.runtime_threshold

    def progress(self, hass: HomeAssistant, task: Task) -> tuple[float, float] | None:
        """Return (current, target) progress toward due."""
        return (self.delta(hass, task), task.runtime_threshold)

    def extra_attributes(self, hass: HomeAssistant, task: Task) -> dict:
        """Return trigger-specific entity attributes."""
        value = self.current_value(hass, task)
        return {
            "runtime_entity_id": task.runtime_entity_id,
            "runtime_threshold": task.runtime_threshold,
            "runtime_baseline": task.runtime_baseline,
            "runtime_current": value,
            "runtime_delta": self.delta(hass, task),
        }


TRIGGERS: dict[str, TimeTrigger] = {
    trigger.type: trigger
    for trigger in (TimeTrigger(), DateTrigger(), CountTrigger(), RuntimeTrigger())
}


def get_trigger(trigger_type: str | None) -> TimeTrigger:
    """Return the strategy for a trigger type, defaulting to time-based."""
    return TRIGGERS.get(trigger_type or "time", TRIGGERS["time"])
