"""Tests for the aggregate "any task due" binary sensor."""

from datetime import timedelta

from homeassistant.util import dt as dt_util

from custom_components.tasks import TasksData
from custom_components.tasks.const import DOMAIN
from custom_components.tasks.store import Task

ENTITY_ID = "binary_sensor.any_task_due"


def make_task(task_id: str, *, overdue: bool) -> Task:
    last = dt_util.now() - timedelta(days=60 if overdue else 1)
    return Task(
        id=task_id,
        title=task_id.removeprefix("tasks_").replace("_", " ").title(),
        interval_value=30,
        interval_type="days",
        last_performed=last.isoformat(),
    )


async def test_off_with_no_tasks(hass, setup_entry) -> None:
    state = hass.states.get(ENTITY_ID)
    assert state is not None
    assert state.state == "off"
    assert state.attributes["due_count"] == 0
    assert state.attributes["task_count"] == 0


async def test_reflects_due_tasks_and_completion(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(make_task("tasks_fresh_one", overdue=False))
    await hass.async_block_till_done()
    assert hass.states.get(ENTITY_ID).state == "off"

    data.store.add(make_task("tasks_late_one", overdue=True))
    data.store.add(make_task("tasks_late_two", overdue=True))
    await hass.async_block_till_done()

    state = hass.states.get(ENTITY_ID)
    assert state.state == "on"
    assert state.attributes["due_count"] == 2
    assert state.attributes["due_tasks"] == ["Late One", "Late Two"]
    assert state.attributes["task_count"] == 3

    data.store.update_last_performed("tasks_late_one")
    data.store.update_last_performed("tasks_late_two")
    await hass.async_block_till_done()

    state = hass.states.get(ENTITY_ID)
    assert state.state == "off"
    assert state.attributes["due_count"] == 0


async def test_turns_on_when_a_task_comes_due_by_time(
    hass, setup_entry, freezer
) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(
        Task(
            id="tasks_soon",
            title="Due Soon",
            interval_value=2,
            interval_type="days",
            last_performed=dt_util.now().isoformat(),
        )
    )
    await hass.async_block_till_done()
    assert hass.states.get(ENTITY_ID).state == "off"

    # Jump past the due moment and fire the scheduled wall-clock refresh.
    freezer.tick(timedelta(days=2, minutes=1))
    from pytest_homeassistant_custom_component.common import (
        async_fire_time_changed,
    )

    async_fire_time_changed(hass)
    await hass.async_block_till_done()

    assert hass.states.get(ENTITY_ID).state == "on"
