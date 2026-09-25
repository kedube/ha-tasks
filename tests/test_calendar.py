"""Tests for the due-date calendar."""

from datetime import timedelta

from dateutil.relativedelta import relativedelta
from homeassistant.util import dt as dt_util

from custom_components.tasks import TasksData
from custom_components.tasks.const import DOMAIN
from custom_components.tasks.store import Task

CALENDAR_ENTITY = "calendar.tasks"


def make_task(**overrides) -> Task:
    """Build a task due 5 days from now by default."""
    defaults = {
        "id": "tasks_cal_test",
        "title": "Flush Water Heater",
        "interval_value": 30,
        "interval_type": "days",
        "last_performed": (dt_util.now() - timedelta(days=25)).isoformat(),
    }
    defaults.update(overrides)
    return Task(**defaults)


async def get_events(hass, days_back: int = 30, days_ahead: int = 60) -> list[dict]:
    """Fetch calendar events via the calendar.get_events service."""
    response = await hass.services.async_call(
        "calendar",
        "get_events",
        {
            "entity_id": CALENDAR_ENTITY,
            "start_date_time": (dt_util.now() - timedelta(days=days_back)).isoformat(),
            "end_date_time": (dt_util.now() + timedelta(days=days_ahead)).isoformat(),
        },
        blocking=True,
        return_response=True,
    )
    return response[CALENDAR_ENTITY]["events"]


async def test_calendar_entity_created(hass, setup_entry) -> None:
    state = hass.states.get(CALENDAR_ENTITY)
    assert state is not None
    assert state.state == "off"
    assert await get_events(hass) == []


async def test_time_task_appears_as_all_day_event(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(make_task(description="Drain and refill"))
    await hass.async_block_till_done()

    # The next due date plus the projected recurrence inside the window.
    events = await get_events(hass)
    assert len(events) == 2
    event = events[0]
    assert event["summary"] == "Flush Water Heater"
    assert event["description"] == "Drain and refill"
    expected_date = (dt_util.now() + timedelta(days=5)).date()
    assert event["start"] == expected_date.isoformat()
    assert event["end"] == (expected_date + timedelta(days=1)).isoformat()
    assert events[1]["start"] == (expected_date + timedelta(days=30)).isoformat()

    # Upcoming but not active today
    state = hass.states.get(CALENDAR_ENTITY)
    assert state.state == "off"
    assert state.attributes["message"] == "Flush Water Heater"
    assert state.attributes["all_day"] is True


async def test_task_due_today_turns_calendar_on(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(
        make_task(last_performed=(dt_util.now() - timedelta(days=30)).isoformat())
    )
    await hass.async_block_till_done()

    state = hass.states.get(CALENDAR_ENTITY)
    assert state.state == "on"


async def test_overdue_task_stays_on_original_date(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(
        make_task(last_performed=(dt_util.now() - timedelta(days=40)).isoformat())
    )
    await hass.async_block_till_done()

    events = await get_events(hass)
    expected_date = (dt_util.now() - timedelta(days=10)).date()
    assert events[0]["start"] == expected_date.isoformat()
    # Projections resume from the missed occurrence.
    assert [event["start"] for event in events[1:]] == [
        (expected_date + timedelta(days=30)).isoformat(),
        (expected_date + timedelta(days=60)).isoformat(),
    ]

    # The missed occurrence is past, so the calendar's next event is the
    # projected follow-up occurrence.
    state = hass.states.get(CALENDAR_ENTITY)
    assert state.state == "off"
    assert state.attributes["start_time"].startswith(
        (expected_date + timedelta(days=30)).isoformat()
    )


async def test_undated_tasks_excluded(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(
        make_task(
            id="tasks_count",
            title="Descale Coffee Machine",
            trigger_type="count",
            count_entity_id="switch.coffee",
            count_threshold=60,
        )
    )
    data.store.add(
        make_task(
            id="tasks_runtime",
            title="Service Generator",
            trigger_type="runtime",
            runtime_entity_id="sensor.generator_hours",
            runtime_threshold=50,
        )
    )
    await hass.async_block_till_done()

    assert await get_events(hass) == []


async def test_events_track_task_changes(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(make_task())
    await hass.async_block_till_done()
    assert len(await get_events(hass)) == 2

    # Completing the task moves the events to the new due dates
    data.store.update_last_performed("tasks_cal_test")
    await hass.async_block_till_done()
    events = await get_events(hass)
    expected_date = (dt_util.now() + timedelta(days=30)).date()
    assert events[0]["start"] == expected_date.isoformat()

    # The calendar's next-event attributes follow along
    state = hass.states.get(CALENDAR_ENTITY)
    assert state.attributes["start_time"].startswith(expected_date.isoformat())

    # Removing the task removes the event
    data.store.delete("tasks_cal_test")
    await hass.async_block_till_done()
    assert await get_events(hass) == []


async def test_soonest_task_is_next_event(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(make_task())  # due in 5 days
    data.store.add(
        make_task(
            id="tasks_sooner",
            title="Water Plants",
            interval_value=7,
            last_performed=(dt_util.now() - timedelta(days=5)).isoformat(),
        )
    )  # due in 2 days
    await hass.async_block_till_done()

    state = hass.states.get(CALENDAR_ENTITY)
    assert state.attributes["message"] == "Water Plants"

    events = await get_events(hass)
    # Soonest first; the weekly task's projections repeat every 7 days.
    assert [event["summary"] for event in events[:3]] == [
        "Water Plants",
        "Flush Water Heater",
        "Water Plants",
    ]


async def test_date_task_projects_fixed_occurrences(hass, setup_entry) -> None:
    """A fixed-date task shows its anchored occurrences, not shifted ones."""
    data: TasksData = hass.data[DOMAIN]
    anchor = (dt_util.now() + timedelta(days=10)).date()
    data.store.add(
        make_task(
            id="tasks_date",
            title="Winterize Sprinklers",
            trigger_type="date",
            anchor_date=anchor.isoformat(),
            interval_value=1,
            interval_type="months",
            last_performed=dt_util.now().isoformat(),
        )
    )
    await hass.async_block_till_done()

    events = await get_events(hass)
    starts = [event["start"] for event in events]
    # Occurrences stay anchored: anchor, anchor + 1 month, ...
    assert starts[0] == anchor.isoformat()
    assert starts[1] == (anchor + relativedelta(months=1)).isoformat()


async def test_projected_event_uids_are_unique(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(
        make_task(
            interval_value=1,
            interval_type="weeks",
            last_performed=dt_util.now().isoformat(),
        )
    )
    await hass.async_block_till_done()

    # The get_events service response omits uids; read the entity directly.
    entity = hass.data["entity_components"]["calendar"].get_entity(CALENDAR_ENTITY)
    events = await entity.async_get_events(
        hass, dt_util.now() - timedelta(days=30), dt_util.now() + timedelta(days=60)
    )
    uids = [event.uid for event in events]
    assert len(uids) > 1
    assert len(uids) == len(set(uids))
    # The real next due date keeps the bare task id for existing automations.
    assert uids[0] == "tasks_cal_test"
