"""Tests for seasonal (active_months) scheduling on time-based tasks."""

from datetime import date, datetime, timedelta

from homeassistant.util import dt as dt_util

from custom_components.tasks.store import (
    STORAGE_KEY,
    Task,
    TaskStore,
)
from custom_components.tasks.triggers import get_trigger

# April through October, e.g. lawn care.
SEASON = [4, 5, 6, 7, 8, 9, 10]


def make_task(**overrides) -> Task:
    """Build a seasonal biweekly task with sensible defaults."""
    defaults = {
        "id": "tasks_seasonal_test",
        "title": "Mow Lawn",
        "interval_value": 2,
        "interval_type": "weeks",
        "last_performed": "2026-06-01T00:00:00",
        "active_months": list(SEASON),
    }
    defaults.update(overrides)
    return Task(**defaults)


def local(year: int, month: int, day: int) -> datetime:
    return dt_util.start_of_local_day(date(year, month, day))


async def test_next_due_inside_season_is_unchanged(hass, freezer) -> None:
    freezer.move_to(local(2026, 6, 2))
    trigger = get_trigger("time")
    task = make_task(last_performed=local(2026, 6, 1).isoformat())
    assert trigger.next_due(hass, task).date() == date(2026, 6, 15)


async def test_next_due_skips_inactive_months(hass, freezer) -> None:
    # Completed late October: the raw next due (mid November) is out of
    # season, so it moves to the first day of the next active month (April).
    freezer.move_to(local(2026, 10, 25))
    trigger = get_trigger("time")
    task = make_task(last_performed=local(2026, 10, 25).isoformat())
    assert trigger.next_due(hass, task).date() == date(2027, 4, 1)


async def test_not_due_out_of_season_even_when_overdue(hass, freezer) -> None:
    trigger = get_trigger("time")
    # Never completed after mid October: raw due date lands in the season,
    # but by December the season is over — the task must not nag all winter.
    task = make_task(last_performed=local(2026, 10, 1).isoformat())

    freezer.move_to(local(2026, 10, 20))
    assert trigger.is_due(hass, task) is True

    freezer.move_to(local(2026, 12, 15))
    assert trigger.is_due(hass, task) is False

    # The season resumes: the pending occurrence resurfaces.
    freezer.move_to(local(2027, 4, 2))
    assert trigger.is_due(hass, task) is True


async def test_never_performed_seasonal_task_waits_for_season(hass, freezer) -> None:
    trigger = get_trigger("time")
    task = make_task(last_performed="")
    freezer.move_to(local(2026, 12, 15))
    assert trigger.is_due(hass, task) is False
    freezer.move_to(local(2027, 5, 10))
    assert trigger.is_due(hass, task) is True


async def test_upcoming_projections_chain_through_seasons(hass, freezer) -> None:
    freezer.move_to(local(2026, 9, 1))
    trigger = get_trigger("time")
    task = make_task(last_performed=local(2026, 9, 1).isoformat())

    horizon = dt_util.start_of_local_day() + timedelta(days=365)
    upcoming = [d.date() for d in trigger.upcoming(hass, task, horizon, limit=6)]

    # Sep 15, Sep 29, Oct 13, Oct 27, then the season break: Nov 10 becomes
    # Apr 1, and the next repetition chains from the adjusted date.
    assert upcoming == [
        date(2026, 9, 15),
        date(2026, 9, 29),
        date(2026, 10, 13),
        date(2026, 10, 27),
        date(2027, 4, 1),
        date(2027, 4, 15),
    ]


async def test_days_until_due_and_active_months_attributes(hass, freezer) -> None:
    freezer.move_to(local(2026, 6, 2))
    trigger = get_trigger("time")
    task = make_task(last_performed=local(2026, 6, 1).isoformat())

    attributes = trigger.extra_attributes(hass, task)
    assert attributes["days_until_due"] == 13
    assert attributes["active_months"] == SEASON

    # Non-seasonal tasks omit active_months but still expose the countdown.
    plain = make_task(active_months=[])
    attributes = trigger.extra_attributes(hass, plain)
    assert "active_months" not in attributes
    assert (
        attributes["days_until_due"] == (date(2026, 6, 15) - dt_util.now().date()).days
    )


async def test_overdue_days_until_due_is_negative(hass, freezer) -> None:
    freezer.move_to(local(2026, 6, 20))
    trigger = get_trigger("time")
    task = make_task(active_months=[], last_performed=local(2026, 6, 1).isoformat())
    assert trigger.extra_attributes(hass, task)["days_until_due"] == -5


async def test_store_sanitizes_malformed_active_months(hass, hass_storage) -> None:
    hass_storage[STORAGE_KEY] = {
        "version": 1,
        "minor_version": 5,
        "key": STORAGE_KEY,
        "data": {
            "tasks": [
                {
                    "id": "tasks_bad_months",
                    "title": "Bad Months",
                    "interval_value": 7,
                    "interval_type": "days",
                    "last_performed": "2026-01-01T00:00:00",
                    "active_months": [4, "x", 0, 13, 4, 9],
                },
                {
                    "id": "tasks_not_a_list",
                    "title": "Not A List",
                    "interval_value": 7,
                    "interval_type": "days",
                    "last_performed": "2026-01-01T00:00:00",
                    "active_months": "summer",
                },
            ],
            "groups": [],
        },
    }
    store = TaskStore(hass)
    await store.async_load()
    assert store.tasks["tasks_bad_months"].active_months == [4, 9]
    assert store.tasks["tasks_not_a_list"].active_months == []


async def test_next_transition_covers_season_boundaries(hass, freezer) -> None:
    trigger = get_trigger("time")

    # In season with a future due date: the due moment comes first.
    freezer.move_to(local(2026, 6, 2))
    task = make_task(last_performed=local(2026, 6, 1).isoformat())
    assert trigger.next_transition(hass, task).date() == date(2026, 6, 15)

    # In season, overdue: the next flip is the season ending (Nov 1).
    task = make_task(last_performed=local(2026, 5, 1).isoformat())
    freezer.move_to(local(2026, 10, 20))
    assert trigger.next_transition(hass, task).date() == date(2026, 11, 1)

    # Out of season with a pending occurrence: the season starting (Apr 1).
    freezer.move_to(local(2026, 12, 15))
    assert trigger.next_transition(hass, task).date() == date(2027, 4, 1)

    # Year-round task already due: nothing left to wake up for.
    plain = make_task(active_months=[], last_performed=local(2026, 1, 1).isoformat())
    assert trigger.next_transition(hass, plain) is None


async def test_sensor_flips_on_at_season_start(hass, setup_entry, freezer) -> None:
    """A pending occurrence resurfaces when the season resumes (timer path)."""
    from pytest_homeassistant_custom_component.common import async_fire_time_changed

    from custom_components.tasks import TasksData
    from custom_components.tasks.const import DOMAIN

    freezer.move_to(local(2026, 12, 15))
    data: TasksData = hass.data[DOMAIN]
    # Went due mid-October and was never completed; out of season now.
    data.store.add(make_task(last_performed=local(2026, 10, 1).isoformat()))
    await hass.async_block_till_done()

    assert hass.states.get("binary_sensor.mow_lawn").state == "off"
    assert hass.states.get("binary_sensor.any_task_due").state == "off"

    # Cross the season boundary; the scheduled transition timers must fire.
    freezer.move_to(local(2027, 4, 1) + timedelta(minutes=1))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()

    assert hass.states.get("binary_sensor.mow_lawn").state == "on"
    assert hass.states.get("binary_sensor.any_task_due").state == "on"


async def test_sensor_flips_off_at_season_end(hass, setup_entry, freezer) -> None:
    """A still-due task stops nagging the moment the season ends."""
    from pytest_homeassistant_custom_component.common import async_fire_time_changed

    from custom_components.tasks import TasksData
    from custom_components.tasks.const import DOMAIN

    freezer.move_to(local(2026, 10, 20))
    data: TasksData = hass.data[DOMAIN]
    data.store.add(make_task(last_performed=local(2026, 10, 1).isoformat()))
    await hass.async_block_till_done()
    assert hass.states.get("binary_sensor.mow_lawn").state == "on"

    freezer.move_to(local(2026, 11, 1) + timedelta(minutes=1))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert hass.states.get("binary_sensor.mow_lawn").state == "off"


async def test_todo_item_not_pending_out_of_season(hass, setup_entry, freezer) -> None:
    """The todo list agrees with the binary sensor's seasonal gate."""
    from custom_components.tasks import TasksData
    from custom_components.tasks.const import DOMAIN

    freezer.move_to(local(2026, 12, 15))
    data: TasksData = hass.data[DOMAIN]
    data.store.add(make_task(last_performed=local(2026, 10, 1).isoformat()))
    await hass.async_block_till_done()

    state = hass.states.get("todo.tasks")
    assert state is not None
    assert state.state == "0"  # no pending items out of season


async def test_active_months_stripped_from_non_time_triggers(hass) -> None:
    """Seasonal months only apply to time tasks; other types drop them."""
    store = TaskStore(hass)
    store.tasks  # noqa: B018 - store used directly, no persistence needed
    task = make_task(
        id="tasks_dated_seasonal",
        trigger_type="date",
        anchor_date="2026-01-15",
        interval_value=1,
        interval_type="months",
    )
    store.add(task)
    assert task.active_months == []

    # And a time task retyped to date loses them on update.
    time_task = make_task(id="tasks_retyped")
    store.add(time_task)
    assert time_task.active_months == SEASON
    store.update_task(
        "tasks_retyped",
        {"trigger_type": "date", "anchor_date": "2026-01-15"},
    )
    assert time_task.active_months == []


async def test_is_due_with_precomputed_due_keeps_season_gate(hass, freezer) -> None:
    """
    Handing is_due a precomputed due date must not bypass the season gate.

    The serializer, the todo entity, and the aggregate sensor all pass the
    next_due they already computed; out of season the answer must still be
    "not due", matching the no-argument call.
    """
    trigger = get_trigger("time")
    task = make_task(last_performed=local(2026, 10, 20).isoformat())

    # Out of season (January): not due, with or without the argument.
    freezer.move_to(local(2027, 1, 15))
    due = trigger.next_due(hass, task)
    assert trigger.is_due(hass, task, due) is False
    assert trigger.is_due(hass, task) is False

    # Season resumes in April: the pending occurrence is due again.
    freezer.move_to(local(2027, 4, 2))
    due = trigger.next_due(hass, task)
    assert trigger.is_due(hass, task, due) is True
    assert trigger.is_due(hass, task) is True


async def test_serialized_due_matches_entity_state_out_of_season(hass, freezer) -> None:
    """The panel's serialized `due` agrees with the binary sensor's state."""
    freezer.move_to(local(2027, 1, 15))
    store = TaskStore(hass)
    task = make_task(last_performed=local(2026, 10, 20).isoformat())
    store.add(task)

    serialized = store.get(task.id)
    assert serialized["due"] is False
    assert serialized["due"] == get_trigger(task.trigger_type).is_due(hass, task)
