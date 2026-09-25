"""Tests for the fixed-date trigger strategy."""

from datetime import timedelta

from dateutil.relativedelta import relativedelta
from homeassistant.util import dt as dt_util

from custom_components.tasks.store import Task
from custom_components.tasks.triggers import get_trigger


def make_task(**overrides) -> Task:
    """Build a fixed-date task with sensible defaults."""
    defaults = {
        "id": "tasks_date_test",
        "title": "Winterize Sprinklers",
        "trigger_type": "date",
        "interval_value": 1,
        "interval_type": "years",
        "anchor_date": (dt_util.now() + timedelta(days=30)).date().isoformat(),
        "last_performed": dt_util.now().isoformat(),
    }
    defaults.update(overrides)
    return Task(**defaults)


def today():
    return dt_util.now().date()


async def test_registered_and_validates(hass) -> None:
    trigger = get_trigger("date")
    assert trigger.type == "date"
    assert trigger.watched_entity(make_task()) is None

    assert trigger.validate({"anchor_date": None, "interval_value": 1}) is not None
    assert trigger.validate({"anchor_date": "bogus", "interval_value": 1}) is not None
    assert (
        trigger.validate({"anchor_date": "2026-10-01", "interval_value": 0}) is not None
    )
    assert trigger.validate({"anchor_date": "2026-10-01", "interval_value": 1}) is None


async def test_future_anchor_is_next_due(hass) -> None:
    trigger = get_trigger("date")
    anchor = today() + timedelta(days=30)
    task = make_task(anchor_date=anchor.isoformat())
    assert trigger.next_due(hass, task).date() == anchor
    assert trigger.is_due(hass, task) is False


async def test_past_anchor_rolls_forward_from_last_completion(hass) -> None:
    trigger = get_trigger("date")
    anchor = today() - relativedelta(years=3)
    task = make_task(anchor_date=anchor.isoformat())
    # Completed today: the next occurrence is the anchor's next anniversary.
    assert trigger.next_due(hass, task).date() == anchor + relativedelta(years=4)


async def test_overdue_occurrence_stays_due_until_completed(hass) -> None:
    trigger = get_trigger("date")
    anchor = today() - timedelta(days=10)
    task = make_task(
        anchor_date=anchor.isoformat(),
        last_performed=(dt_util.now() - timedelta(days=30)).isoformat(),
    )
    assert trigger.next_due(hass, task).date() == anchor
    assert trigger.is_due(hass, task) is True

    # Completing (today) rolls to the next anchored occurrence — not
    # today + interval like the time trigger would.
    task.last_performed = dt_util.start_of_local_day().isoformat()
    assert trigger.next_due(hass, task).date() == anchor + relativedelta(years=1)
    assert trigger.is_due(hass, task) is False


async def test_completion_on_due_date_advances(hass) -> None:
    trigger = get_trigger("date")
    anchor = today()
    task = make_task(
        anchor_date=anchor.isoformat(),
        interval_type="months",
        interval_value=6,
        last_performed=dt_util.start_of_local_day().isoformat(),
    )
    assert trigger.next_due(hass, task).date() == anchor + relativedelta(months=6)


async def test_daily_anchor_far_in_past_is_fast_and_correct(hass) -> None:
    trigger = get_trigger("date")
    anchor = today() - timedelta(days=3650)
    task = make_task(
        anchor_date=anchor.isoformat(),
        interval_type="days",
        interval_value=7,
        last_performed=dt_util.start_of_local_day().isoformat(),
    )
    due = trigger.next_due(hass, task).date()
    assert due > today()
    assert (due - anchor).days % 7 == 0
    assert (due - today()).days <= 7


async def test_weeks_interval(hass) -> None:
    trigger = get_trigger("date")
    anchor = today() - timedelta(days=1)
    task = make_task(
        anchor_date=anchor.isoformat(),
        interval_type="weeks",
        interval_value=2,
        last_performed=dt_util.start_of_local_day().isoformat(),
    )
    assert trigger.next_due(hass, task).date() == anchor + timedelta(weeks=2)


async def test_upcoming_projects_anchored_occurrences(hass) -> None:
    trigger = get_trigger("date")
    anchor = today() + timedelta(days=10)
    task = make_task(
        anchor_date=anchor.isoformat(), interval_type="months", interval_value=3
    )
    horizon = dt_util.start_of_local_day() + timedelta(days=365)
    occurrences = [d.date() for d in trigger.upcoming(hass, task, horizon, 53)]
    assert occurrences[0] == anchor
    assert occurrences[1] == anchor + relativedelta(months=3)
    assert all(o <= horizon.date() for o in occurrences)


async def test_unparseable_anchor_returns_no_due(hass) -> None:
    trigger = get_trigger("date")
    task = make_task(anchor_date=None)
    assert trigger.next_due(hass, task) is None
    assert trigger.upcoming(hass, task, dt_util.now() + timedelta(days=365), 10) == []
    # No due date means is_due falls back to "due" (matches time trigger).
    assert trigger.is_due(hass, task) is True


async def test_extra_attributes_include_anchor(hass) -> None:
    trigger = get_trigger("date")
    task = make_task()
    attributes = trigger.extra_attributes(hass, task)
    assert attributes["anchor_date"] == task.anchor_date
    assert attributes["interval_type"] == "years"
    assert attributes["next_due"] != "unknown"


async def test_years_interval_on_time_trigger(hass) -> None:
    """The new years interval also works for ordinary time-based tasks."""
    trigger = get_trigger("time")
    task = Task(
        id="tasks_yearly",
        title="Annual Service",
        trigger_type="time",
        interval_value=1,
        interval_type="years",
        last_performed=dt_util.start_of_local_day().isoformat(),
    )
    assert trigger.next_due(hass, task).date() == today() + relativedelta(years=1)


async def test_upcoming_skips_past_repetitions(hass) -> None:
    """An overdue task projects its missed date plus future dates only."""
    time_trigger = get_trigger("time")
    task = Task(
        id="tasks_overdue",
        title="Water Plants",
        interval_value=3,
        interval_type="days",
        last_performed=(dt_util.now() - timedelta(days=13)).isoformat(),
    )
    horizon = dt_util.start_of_local_day() + timedelta(days=30)
    occurrences = [d.date() for d in time_trigger.upcoming(hass, task, horizon, 53)]
    # The missed due date (10 days ago) is kept...
    assert occurrences[0] == today() - timedelta(days=10)
    # ...but every projection is strictly in the future — no phantom events
    # between the missed date and today.
    assert all(occurrence > today() for occurrence in occurrences[1:])
    assert occurrences[1] == today() + timedelta(days=2)

    date_trigger = get_trigger("date")
    date_task = make_task(
        anchor_date=(today() - timedelta(days=40)).isoformat(),
        interval_type="weeks",
        interval_value=1,
        last_performed=(dt_util.now() - timedelta(days=45)).isoformat(),
    )
    occurrences = [
        d.date() for d in date_trigger.upcoming(hass, date_task, horizon, 53)
    ]
    assert occurrences[0] == today() - timedelta(days=40)
    assert all(occurrence > today() for occurrence in occurrences[1:])


async def test_overdue_task_still_projects_future_occurrences(hass) -> None:
    """Skipped past repetitions must not consume the projection budget."""
    time_trigger = get_trigger("time")
    task = Task(
        id="tasks_very_overdue",
        title="Water Plants",
        interval_value=1,
        interval_type="days",
        last_performed=(dt_util.now() - timedelta(days=61)).isoformat(),
    )
    horizon = dt_util.start_of_local_day() + timedelta(days=365)
    occurrences = [d.date() for d in time_trigger.upcoming(hass, task, horizon, 53)]
    # Missed date 60 days ago, then tomorrow onward — a full future window.
    assert occurrences[0] == today() - timedelta(days=60)
    assert occurrences[1] == today() + timedelta(days=1)
    assert len(occurrences) == 53

    date_trigger = get_trigger("date")
    date_task = make_task(
        anchor_date=(today() - timedelta(days=420)).isoformat(),
        interval_type="weeks",
        interval_value=1,
        last_performed=(dt_util.now() - timedelta(days=425)).isoformat(),
    )
    occurrences = [
        d.date() for d in date_trigger.upcoming(hass, date_task, horizon, 53)
    ]
    assert occurrences[0] == today() - timedelta(days=420)
    assert len(occurrences) == 53
    assert all(o > today() for o in occurrences[1:])
