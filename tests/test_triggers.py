"""Tests for the trigger strategies."""

from datetime import timedelta

from homeassistant.util import dt as dt_util

from custom_components.tasks.store import Task
from custom_components.tasks.triggers import get_trigger


def make_task(**overrides) -> Task:
    """Build a task with sensible defaults."""
    defaults = {
        "id": "tasks_test",
        "title": "Test Task",
        "interval_value": 90,
        "interval_type": "days",
        "last_performed": (dt_util.now() - timedelta(days=10)).isoformat(),
    }
    defaults.update(overrides)
    return Task(**defaults)


def days_ago(days: int) -> str:
    return (dt_util.now() - timedelta(days=days)).isoformat()


async def test_get_trigger_defaults_to_time(hass) -> None:
    assert get_trigger(None).type == "time"
    assert get_trigger("bogus").type == "time"
    assert get_trigger("count").type == "count"
    assert get_trigger("runtime").type == "runtime"


async def test_time_trigger_due_and_not_due(hass) -> None:
    trigger = get_trigger("time")

    overdue = make_task(last_performed=days_ago(100), interval_value=90)
    assert trigger.is_due(hass, overdue) is True

    fresh = make_task(last_performed=days_ago(10), interval_value=90)
    assert trigger.is_due(hass, fresh) is False


async def test_time_trigger_weeks_and_months(hass) -> None:
    trigger = get_trigger("time")

    due_weeks = make_task(
        last_performed=days_ago(15), interval_value=2, interval_type="weeks"
    )
    assert trigger.is_due(hass, due_weeks) is True

    fresh_months = make_task(
        last_performed=days_ago(15), interval_value=1, interval_type="months"
    )
    assert trigger.is_due(hass, fresh_months) is False


async def test_time_trigger_unparseable_date_is_due(hass) -> None:
    trigger = get_trigger("time")
    task = make_task(last_performed="not-a-date")
    assert trigger.next_due(hass, task) is None
    assert trigger.is_due(hass, task) is True


async def test_time_trigger_next_due(hass) -> None:
    trigger = get_trigger("time")
    task = make_task(last_performed=days_ago(10), interval_value=30)
    due = trigger.next_due(hass, task)
    assert due is not None
    expected = (dt_util.now() + timedelta(days=20)).date()
    assert due.date() == expected


async def test_count_trigger(hass) -> None:
    trigger = get_trigger("count")
    task = make_task(
        trigger_type="count",
        count_entity_id="binary_sensor.door",
        count_threshold=3,
        current_count=2,
    )

    assert trigger.is_due(hass, task) is False
    assert trigger.progress(hass, task) == (2, 3)

    task.current_count = 3
    assert trigger.is_due(hass, task) is True

    trigger.on_complete(hass, task)
    assert task.current_count == 0
    assert trigger.is_due(hass, task) is False


async def test_count_trigger_zero_threshold_never_due(hass) -> None:
    trigger = get_trigger("count")
    task = make_task(trigger_type="count", count_threshold=0, current_count=100)
    assert trigger.is_due(hass, task) is False


async def test_runtime_trigger_delta_and_due(hass) -> None:
    trigger = get_trigger("runtime")
    task = make_task(
        trigger_type="runtime",
        runtime_entity_id="sensor.pump_hours",
        runtime_threshold=20,
        runtime_baseline=100,
    )

    hass.states.async_set("sensor.pump_hours", "115.5")
    assert trigger.delta(hass, task) == 15.5
    assert trigger.is_due(hass, task) is False

    hass.states.async_set("sensor.pump_hours", "120.5")
    assert trigger.delta(hass, task) == 20.5
    assert trigger.is_due(hass, task) is True


async def test_runtime_trigger_external_reset(hass) -> None:
    """A sensor value below the baseline counts from zero."""
    trigger = get_trigger("runtime")
    task = make_task(
        trigger_type="runtime",
        runtime_entity_id="sensor.pump_hours",
        runtime_threshold=20,
        runtime_baseline=100,
    )

    hass.states.async_set("sensor.pump_hours", "5")
    assert trigger.delta(hass, task) == 5
    assert trigger.is_due(hass, task) is False


async def test_runtime_trigger_unavailable_sensor(hass) -> None:
    trigger = get_trigger("runtime")
    task = make_task(
        trigger_type="runtime",
        runtime_entity_id="sensor.pump_hours",
        runtime_threshold=20,
        runtime_baseline=0,
    )

    assert trigger.is_due(hass, task) is False

    hass.states.async_set("sensor.pump_hours", "unavailable")
    assert trigger.current_value(hass, task) is None
    assert trigger.is_due(hass, task) is False


async def test_runtime_trigger_on_complete_rebaselines(hass) -> None:
    trigger = get_trigger("runtime")
    task = make_task(
        trigger_type="runtime",
        runtime_entity_id="sensor.pump_hours",
        runtime_threshold=20,
        runtime_baseline=100,
    )

    hass.states.async_set("sensor.pump_hours", "130")
    trigger.on_complete(hass, task)
    assert task.runtime_baseline == 130
    assert trigger.delta(hass, task) == 0


async def test_runtime_initialize_unavailable_is_pending(hass) -> None:
    """Init while unavailable leaves the baseline pending (None), not 0."""
    trigger = get_trigger("runtime")
    task = make_task(
        trigger_type="runtime",
        runtime_entity_id="sensor.pump_hours",
        runtime_threshold=20,
    )
    hass.states.async_set("sensor.pump_hours", "unavailable")
    trigger.initialize(hass, task)
    assert task.runtime_baseline is None
    assert trigger.is_due(hass, task) is False


async def test_runtime_on_complete_unavailable_is_pending(hass) -> None:
    """Completing while unavailable leaves the baseline pending, not stale."""
    trigger = get_trigger("runtime")
    task = make_task(
        trigger_type="runtime",
        runtime_entity_id="sensor.pump_hours",
        runtime_threshold=20,
        runtime_baseline=100,
    )
    hass.states.async_set("sensor.pump_hours", "unavailable")
    trigger.on_complete(hass, task)
    assert task.runtime_baseline is None


async def test_time_trigger_dst_fall_back_no_off_by_one(hass) -> None:
    """A 21-day interval spanning the US DST fall-back stays on the right day."""
    from zoneinfo import ZoneInfo

    from homeassistant.util import dt as dt_util_mod

    original = dt_util_mod.get_default_time_zone()
    dt_util_mod.set_default_time_zone(ZoneInfo("America/New_York"))
    try:
        trigger = get_trigger("time")
        # Completed Oct 20 (EDT, -04:00); +21 days lands after the Nov 1
        # fall-back. The due date must be Nov 10, not Nov 9.
        task = make_task(
            interval_value=21,
            interval_type="days",
            last_performed="2026-10-20T00:00:00-04:00",
        )
        due = trigger.next_due(hass, task)
        assert due.date().isoformat() == "2026-11-10"

        # Monthly interval across the same boundary: Oct 15 -> Nov 15.
        task_m = make_task(
            interval_value=1,
            interval_type="months",
            last_performed="2026-10-15T00:00:00-04:00",
        )
        assert trigger.next_due(hass, task_m).date().isoformat() == "2026-11-15"
    finally:
        dt_util_mod.set_default_time_zone(original)


async def test_is_due_accepts_precomputed_due_date(hass) -> None:
    """A caller may hand back the next_due it already computed."""
    trigger = get_trigger("time")
    overdue = make_task(last_performed=(dt_util.now() - timedelta(days=40)).isoformat())
    fresh = make_task(last_performed=dt_util.now().isoformat())

    # Passing the trigger's own next_due matches computing it internally.
    for task in (overdue, fresh):
        due = trigger.next_due(hass, task)
        assert trigger.is_due(hass, task, due) is trigger.is_due(hass, task)

    # An unparseable date yields next_due None, which still reads as due.
    unparseable = make_task(last_performed="not-a-date")
    assert trigger.is_due(hass, unparseable, None) is True

    # Count/runtime ignore the argument entirely — their due state is not
    # date-based, and callers pass the (None) next_due uniformly.
    count = make_task(trigger_type="count", count_threshold=3, current_count=3)
    assert get_trigger("count").is_due(hass, count, None) is True


async def test_next_transition_accepts_precomputed_due_date(hass) -> None:
    """next_transition takes the same precomputed next_due."""
    trigger = get_trigger("time")
    task = make_task(last_performed=dt_util.now().isoformat())
    due = trigger.next_due(hass, task)
    assert trigger.next_transition(hass, task, due) == trigger.next_transition(
        hass, task
    )
