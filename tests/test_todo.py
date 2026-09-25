"""Tests for the todo list entity."""

from datetime import timedelta

import pytest
from homeassistant.exceptions import ServiceValidationError
from homeassistant.util import dt as dt_util

from custom_components.tasks import TasksData
from custom_components.tasks.const import DOMAIN
from custom_components.tasks.store import Task

TODO_ENTITY = "todo.tasks"


def make_task(**overrides) -> Task:
    """Build a task due 5 days from now by default."""
    defaults = {
        "id": "tasks_todo_test",
        "title": "Flush Water Heater",
        "interval_value": 30,
        "interval_type": "days",
        "last_performed": (dt_util.now() - timedelta(days=25)).isoformat(),
    }
    defaults.update(overrides)
    return Task(**defaults)


async def get_items(hass) -> list[dict]:
    """Fetch todo items via the todo.get_items service."""
    response = await hass.services.async_call(
        "todo",
        "get_items",
        {"entity_id": TODO_ENTITY},
        blocking=True,
        return_response=True,
    )
    return response[TODO_ENTITY]["items"]


async def test_todo_entity_created(hass, setup_entry) -> None:
    state = hass.states.get(TODO_ENTITY)
    assert state is not None
    assert state.state == "0"
    assert await get_items(hass) == []


async def test_items_mirror_tasks(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(make_task(description="Drain and refill"))
    data.store.add(
        make_task(
            id="tasks_due",
            title="Change HVAC Filter",
            last_performed=(dt_util.now() - timedelta(days=40)).isoformat(),
        )
    )
    await hass.async_block_till_done()

    # State counts pending (due) items only.
    assert hass.states.get(TODO_ENTITY).state == "1"

    items = await get_items(hass)
    assert len(items) == 2
    # Due tasks sort first.
    assert items[0]["summary"] == "Change HVAC Filter"
    assert items[0]["status"] == "needs_action"
    assert items[1]["summary"] == "Flush Water Heater"
    assert items[1]["status"] == "completed"
    assert items[1]["description"] == "Drain and refill"
    expected_due = (dt_util.now() + timedelta(days=5)).date().isoformat()
    assert items[1]["due"] == expected_due


async def test_undated_task_has_no_due(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(
        make_task(
            trigger_type="count",
            count_entity_id="switch.coffee",
            count_threshold=2,
        )
    )
    await hass.async_block_till_done()

    items = await get_items(hass)
    assert "due" not in items[0] or items[0]["due"] is None


async def test_checking_off_completes_task(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(
        make_task(last_performed=(dt_util.now() - timedelta(days=40)).isoformat())
    )
    await hass.async_block_till_done()

    await hass.services.async_call(
        "todo",
        "update_item",
        {
            "entity_id": TODO_ENTITY,
            "item": "tasks_todo_test",
            "status": "completed",
        },
        blocking=True,
    )
    await hass.async_block_till_done()

    task = data.store.tasks["tasks_todo_test"]
    assert task.last_performed.startswith(dt_util.now().date().isoformat())
    assert task.history
    assert hass.states.get(TODO_ENTITY).state == "0"


async def test_rename_and_description_update(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(make_task())
    await hass.async_block_till_done()

    await hass.services.async_call(
        "todo",
        "update_item",
        {
            "entity_id": TODO_ENTITY,
            "item": "tasks_todo_test",
            "rename": "Flush Water Heater (basement)",
            "description": "Use the garden hose",
        },
        blocking=True,
    )
    await hass.async_block_till_done()

    task = data.store.tasks["tasks_todo_test"]
    assert task.title == "Flush Water Heater (basement)"
    assert task.description == "Use the garden hose"


async def test_reopening_not_due_task_rejected(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(make_task())  # not due
    await hass.async_block_till_done()

    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            "todo",
            "update_item",
            {
                "entity_id": TODO_ENTITY,
                "item": "tasks_todo_test",
                "status": "needs_action",
            },
            blocking=True,
        )


async def test_native_card_update_includes_due_date(hass, setup_entry) -> None:
    """The todo card echoes due_date back on check-off; it must be accepted."""
    data: TasksData = hass.data[DOMAIN]
    data.store.add(
        make_task(last_performed=(dt_util.now() - timedelta(days=40)).isoformat())
    )
    await hass.async_block_till_done()

    items = await get_items(hass)
    await hass.services.async_call(
        "todo",
        "update_item",
        {
            "entity_id": TODO_ENTITY,
            "item": "tasks_todo_test",
            "status": "completed",
            # What the native card sends: the item's displayed due date.
            "due_date": items[0]["due"],
        },
        blocking=True,
    )
    await hass.async_block_till_done()

    task = data.store.tasks["tasks_todo_test"]
    assert task.last_performed.startswith(dt_util.now().date().isoformat())


async def test_due_date_edits_are_ignored(hass, setup_entry) -> None:
    """An edited due date can't override the computed schedule."""
    data: TasksData = hass.data[DOMAIN]
    data.store.add(make_task())
    await hass.async_block_till_done()

    await hass.services.async_call(
        "todo",
        "update_item",
        {
            "entity_id": TODO_ENTITY,
            "item": "tasks_todo_test",
            "due_date": "2030-01-01",
        },
        blocking=True,
    )
    await hass.async_block_till_done()

    items = await get_items(hass)
    expected_due = (dt_util.now() + timedelta(days=5)).date().isoformat()
    assert items[0]["due"] == expected_due


async def test_oversized_rename_rejected(hass, setup_entry) -> None:
    """Todo edits honor the same length cap as the websocket API."""
    data: TasksData = hass.data[DOMAIN]
    data.store.add(make_task())
    await hass.async_block_till_done()

    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            "todo",
            "update_item",
            {
                "entity_id": TODO_ENTITY,
                "item": "tasks_todo_test",
                "rename": "x" * 501,
            },
            blocking=True,
        )
    assert data.store.tasks["tasks_todo_test"].title == "Flush Water Heater"
