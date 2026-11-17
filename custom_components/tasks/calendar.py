"""
Calendar of upcoming Tasks due dates.

A single calendar entity exposes all-day events for every dated (time- and
fixed-date-based) task: the real next due date plus projected recurrences up
to a one-year horizon. Projections assume each task is completed on its due
date — completing early or late shifts a time-based task's future dates, so
projections are refreshed on every task change. Count- and runtime-based
tasks have no date and are excluded, matching the panel's Next Due column.
"""

from __future__ import annotations

from datetime import timedelta
from typing import TYPE_CHECKING

from homeassistant.components.calendar import CalendarEntity, CalendarEvent
from homeassistant.core import callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.util import dt as dt_util

from . import const
from .triggers import get_trigger

if TYPE_CHECKING:
    from datetime import date, datetime

    from homeassistant.config_entries import ConfigEntry
    from homeassistant.core import HomeAssistant
    from homeassistant.helpers.device_registry import DeviceInfo
    from homeassistant.helpers.entity_platform import AddEntitiesCallback

    from .store import Task, TaskStore

    # (due date, occurrence index — 0 is the real next due date, task)
    type _Occurrence = tuple[date, int, Task]


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the Tasks calendar platform."""
    async_add_entities([TasksCalendar(hass, entry.runtime_data.store)])


def _event_identity(event: CalendarEvent | None) -> tuple | None:
    """Return a comparable identity of the current event, for change checks."""
    if event is None:
        return None
    return (event.uid, event.start, event.summary)


def _make_event(due_date: date, index: int, task: Task) -> CalendarEvent:
    """Build the all-day event for one occurrence of a task."""
    return CalendarEvent(
        start=due_date,
        end=due_date + timedelta(days=1),
        summary=task.title,
        description=task.description or None,
        # The real next due date keeps the task id as its uid (stable for
        # existing automations); projections get a per-date uid so every
        # event stays unique.
        uid=task.id if index == 0 else f"{task.id}-{due_date}",
    )


class TasksCalendar(CalendarEntity):
    """
    All-day due-date events for every time-based task.

    The entity state needs only the next event, found with one short
    projection per task. The full projection (~30 occurrences per task) is
    built only when a calendar view asks for a window, and CalendarEvent
    objects — whose validation dominated the cost — only for that window.
    Rebuilding every event on each task change blocked the event loop for
    ~0.4 s per change at 400 tasks.
    """

    _attr_should_poll = False
    _attr_icon = "mdi:calendar-check"

    def __init__(self, hass: HomeAssistant, store: TaskStore) -> None:
        """Initialize the calendar entity."""
        self.hass = hass
        self._store = store
        self._attr_unique_id = f"{const.DOMAIN}_calendar"
        self._attr_name = const.NAME
        # Both caches are tagged with the local day they were built on:
        # projections depend on "today" (rolling horizon, past-repetition
        # skipping), so yesterday's are stale even when no task changed.
        self._occurrence_cache: tuple[date, list[_Occurrence]] | None = None
        self._event_cache: tuple[date, CalendarEvent | None] | None = None
        self._fingerprint: tuple | None = None

    @property
    def device_info(self) -> DeviceInfo:
        """Return device information for this calendar."""
        return const.device_info()

    @staticmethod
    def _horizon() -> datetime:
        return dt_util.start_of_local_day() + timedelta(
            days=const.CALENDAR_PROJECTION_DAYS
        )

    def _occurrences(self) -> list[_Occurrence]:
        """
        Return every projected occurrence within the horizon, soonest first.

        Each dated task contributes its next due date plus projected
        recurrences. Cached until a task change or a new local day.
        """
        today = dt_util.now().date()
        if self._occurrence_cache is not None and self._occurrence_cache[0] == today:
            return self._occurrence_cache[1]

        horizon = self._horizon()
        occurrences: list[_Occurrence] = []
        for task in self._store.tasks.values():
            projected = get_trigger(task.trigger_type).upcoming(
                self.hass, task, horizon, const.CALENDAR_MAX_OCCURRENCES
            )
            occurrences.extend(
                (dt_util.as_local(occurrence).date(), index, task)
                for index, occurrence in enumerate(projected)
            )
        # Stable sort: same-day events keep task order, as before.
        occurrences.sort(key=lambda occurrence: occurrence[0])
        self._occurrence_cache = (today, occurrences)
        return occurrences

    @property
    def event(self) -> CalendarEvent | None:
        """Return the active or next upcoming event."""
        today = dt_util.now().date()
        if self._event_cache is not None and self._event_cache[0] == today:
            return self._event_cache[1]

        horizon = self._horizon()
        best: _Occurrence | None = None
        for task in self._store.tasks.values():
            # A task's next event is its first occurrence on or after today:
            # the next due date, or — when that is overdue — the first
            # projected repetition. Two occurrences always cover it.
            projected = get_trigger(task.trigger_type).upcoming(
                self.hass, task, horizon, 2
            )
            for index, occurrence in enumerate(projected):
                due_date = dt_util.as_local(occurrence).date()
                if due_date >= today:
                    # Strict <: the earlier task wins a same-day tie.
                    if best is None or due_date < best[0]:
                        best = (due_date, index, task)
                    break

        event = _make_event(*best) if best is not None else None
        self._event_cache = (today, event)
        return event

    async def async_get_events(
        self,
        hass: HomeAssistant,
        start_date: datetime,
        end_date: datetime,
    ) -> list[CalendarEvent]:
        """Return events overlapping the requested window."""
        events = []
        for due_date, index, task in self._occurrences():
            if dt_util.start_of_local_day(due_date) >= end_date:
                break  # sorted by date: nothing later overlaps either
            if dt_util.start_of_local_day(due_date + timedelta(days=1)) > start_date:
                events.append(_make_event(due_date, index, task))
        return events

    def _task_fingerprint(self) -> tuple:
        """
        Summarize (cheaply) everything the events depend on.

        One next_due per task — the signal fires on count increments and
        runtime ticks too, and rebuilding for those would be pure waste. The
        schedule fields cover edits that move later occurrences but not the
        next due date (e.g. a new interval or season).
        """
        return tuple(
            sorted(
                (
                    task.id,
                    due.isoformat(),
                    task.title,
                    task.description or "",
                    task.interval_type,
                    task.interval_value,
                    task.anchor_date or "",
                    tuple(task.active_months),
                )
                for task in self._store.tasks.values()
                if (due := get_trigger(task.trigger_type).next_due(self.hass, task))
                is not None
            )
        )

    @callback
    def _handle_tasks_changed(self) -> None:
        # Skip entirely when nothing calendar-visible changed — count
        # increments, runtime ticks, and group renames fire this signal but
        # don't affect the calendar.
        fingerprint = self._task_fingerprint()
        if fingerprint == self._fingerprint:
            return
        self._fingerprint = fingerprint

        # Invalidate, and only rewrite state if the visible next event changed.
        previous = self._event_cache[1] if self._event_cache is not None else None
        self._occurrence_cache = None
        self._event_cache = None
        if _event_identity(self.event) != _event_identity(previous):
            self.async_write_ha_state()

    async def async_added_to_hass(self) -> None:
        """Subscribe to task changes."""
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass, const.SIGNAL_TASKS_CHANGED, self._handle_tasks_changed
            )
        )
