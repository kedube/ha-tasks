"""Tests for the push-based binary sensor entities."""

from datetime import timedelta

from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import async_fire_time_changed

from custom_components.tasks import TasksData
from custom_components.tasks.const import DOMAIN
from custom_components.tasks.store import Task


async def test_time_task_flips_due_at_due_moment(hass, setup_entry, freezer) -> None:
    """A time-based task turns on exactly when it comes due, without polling."""
    data: TasksData = hass.data[DOMAIN]

    # Last performed 29 days ago with a 30-day interval: due tomorrow.
    data.store.add(
        Task(
            id="tasks_timer",
            title="Rotate Mattress",
            interval_value=30,
            interval_type="days",
            last_performed=(dt_util.now() - timedelta(days=29)).isoformat(),
        )
    )
    await hass.async_block_till_done()

    state = hass.states.get("binary_sensor.rotate_mattress")
    assert state is not None
    assert state.state == "off"

    # Travel past the due moment; the scheduled point-in-time callback fires.
    freezer.tick(timedelta(days=2))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()

    assert hass.states.get("binary_sensor.rotate_mattress").state == "on"


async def test_entity_updates_when_task_updated(hass, setup_entry) -> None:
    """Store mutations push new state to the entity without polling."""
    data: TasksData = hass.data[DOMAIN]

    task = Task(
        id="tasks_push",
        title="Water Plants",
        interval_value=7,
        interval_type="days",
        last_performed="2020-01-01T00:00:00",
    )
    data.store.add(task)
    await hass.async_block_till_done()

    assert hass.states.get("binary_sensor.water_plants").state == "on"

    data.store.update_last_performed(task.id)
    await hass.async_block_till_done()

    state = hass.states.get("binary_sensor.water_plants")
    assert state.state == "off"
    # Title edits propagate too
    data.store.update_task(task.id, {"title": "Water All Plants"})
    await hass.async_block_till_done()
    assert (
        hass.states.get("binary_sensor.water_plants").attributes["friendly_name"]
        == "Water All Plants"
    )


async def test_runtime_task_attributes(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]

    hass.states.async_set("sensor.pump_hours", "100")
    data.store.add(
        Task(
            id="tasks_attr",
            title="Service Pump",
            interval_value=1,
            interval_type="days",
            last_performed="2026-01-01T00:00:00",
            trigger_type="runtime",
            runtime_entity_id="sensor.pump_hours",
            runtime_threshold=50,
        )
    )
    await hass.async_block_till_done()

    hass.states.async_set("sensor.pump_hours", "130")
    await hass.async_block_till_done()

    attrs = hass.states.get("binary_sensor.service_pump").attributes
    assert attrs["trigger_type"] == "runtime"
    assert attrs["runtime_baseline"] == 100
    assert attrs["runtime_current"] == 130
    assert attrs["runtime_delta"] == 30
