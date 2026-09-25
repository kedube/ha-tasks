"""Tests for completion history and the completion/due bus events."""

from datetime import timedelta

from homeassistant.util import dt as dt_util

from custom_components.tasks import TasksData
from custom_components.tasks.const import (
    DOMAIN,
    EVENT_TASK_COMPLETED,
    EVENT_TASK_DUE,
    MAX_HISTORY_ENTRIES,
)
from custom_components.tasks.store import Task

TASK_ID = "tasks_history_test"


def make_task(**overrides) -> Task:
    defaults = {
        "id": TASK_ID,
        "title": "Change HVAC Filter",
        "interval_value": 30,
        "interval_type": "days",
        "last_performed": (dt_util.now() - timedelta(days=10)).isoformat(),
    }
    defaults.update(overrides)
    return Task(**defaults)


async def test_completion_appends_history_with_note(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(make_task())
    await hass.async_block_till_done()

    data.store.update_last_performed(TASK_ID, note="Used MERV 13")
    task = data.store.tasks[TASK_ID]
    assert len(task.history) == 1
    entry = task.history[0]
    assert entry["performed"] == dt_util.now().date().isoformat()
    assert entry["note"] == "Used MERV 13"
    assert entry["recorded_at"] is not None

    # Back-dated completion records the back-dated performed date.
    performed = dt_util.now() - timedelta(days=3)
    data.store.update_last_performed(TASK_ID, performed)
    assert task.history[1]["performed"] == performed.date().isoformat()
    assert task.history[1]["note"] is None


async def test_history_capped(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(make_task())
    await hass.async_block_till_done()

    for index in range(MAX_HISTORY_ENTRIES + 10):
        data.store.update_last_performed(TASK_ID, note=f"run {index}")

    task = data.store.tasks[TASK_ID]
    assert len(task.history) == MAX_HISTORY_ENTRIES
    # Oldest entries were dropped.
    assert task.history[0]["note"] == "run 10"
    assert task.history[-1]["note"] == f"run {MAX_HISTORY_ENTRIES + 9}"


async def test_history_serialized_for_api(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(make_task())
    data.store.update_last_performed(TASK_ID, note="first")
    serialized = data.store.get(TASK_ID)
    assert serialized["history"][0]["note"] == "first"


async def test_completed_event_fired(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(make_task(group_id="HVAC"))
    await hass.async_block_till_done()

    events = []
    hass.bus.async_listen(EVENT_TASK_COMPLETED, events.append)

    data.store.update_last_performed(TASK_ID, note="serviced")
    await hass.async_block_till_done()

    assert len(events) == 1
    event = events[0]
    assert event.data["task_id"] == TASK_ID
    assert event.data["title"] == "Change HVAC Filter"
    assert event.data["group_id"] == "HVAC"
    assert event.data["trigger_type"] == "time"
    assert event.data["performed"] == dt_util.now().date().isoformat()
    assert event.data["note"] == "serviced"
    assert event.data["entity_id"] == "binary_sensor.change_hvac_filter"


async def test_completed_event_fired_per_task_on_tag_scan(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(make_task())
    data.store.add(make_task(id="tasks_other", title="Other Filter"))
    await hass.async_block_till_done()

    events = []
    hass.bus.async_listen(EVENT_TASK_COMPLETED, events.append)

    data.store.complete_tasks([TASK_ID, "tasks_other"])
    await hass.async_block_till_done()

    assert {event.data["task_id"] for event in events} == {
        TASK_ID,
        "tasks_other",
    }
    for task_id in (TASK_ID, "tasks_other"):
        assert data.store.tasks[task_id].history


async def test_due_event_fired_on_transition(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(make_task())  # due in 20 days
    await hass.async_block_till_done()

    events = []
    hass.bus.async_listen(EVENT_TASK_DUE, events.append)

    # Editing the task so it becomes due flips the sensor and fires the event.
    data.store.update_task(
        TASK_ID,
        {"last_performed": (dt_util.now() - timedelta(days=40)).isoformat()},
    )
    await hass.async_block_till_done()

    assert len(events) == 1
    event = events[0]
    assert event.data["task_id"] == TASK_ID
    assert event.data["entity_id"] == "binary_sensor.change_hvac_filter"
    assert event.data["title"] == "Change HVAC Filter"

    # Completing it (back to not due) and making it due again fires again.
    data.store.update_last_performed(TASK_ID)
    await hass.async_block_till_done()
    data.store.update_task(
        TASK_ID,
        {"last_performed": (dt_util.now() - timedelta(days=40)).isoformat()},
    )
    await hass.async_block_till_done()
    assert len(events) == 2


async def test_no_due_event_while_already_due(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(
        make_task(last_performed=(dt_util.now() - timedelta(days=40)).isoformat())
    )
    await hass.async_block_till_done()

    events = []
    hass.bus.async_listen(EVENT_TASK_DUE, events.append)

    # An unrelated edit on an already-due task must not re-fire.
    data.store.update_task(TASK_ID, {"description": "still due"})
    await hass.async_block_till_done()
    assert events == []


async def test_websocket_complete_with_note(hass, setup_entry, hass_ws_client) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(make_task())
    await hass.async_block_till_done()

    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {
            "type": "tasks/complete_task",
            "task_id": TASK_ID,
            "note": "from the panel",
        }
    )
    response = await client.receive_json()
    assert response["success"]
    assert data.store.tasks[TASK_ID].history[-1]["note"] == "from the panel"


async def test_service_complete_with_note(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(make_task())
    await hass.async_block_till_done()

    await hass.services.async_call(
        DOMAIN,
        "reset_last_performed",
        {
            "entity_id": "binary_sensor.change_hvac_filter",
            "performed_date": (dt_util.now() - timedelta(days=1)).date().isoformat(),
            "note": "via service",
        },
        blocking=True,
    )
    entry = data.store.tasks[TASK_ID].history[-1]
    assert entry["note"] == "via service"
    assert entry["performed"] == (dt_util.now() - timedelta(days=1)).date().isoformat()


async def test_malformed_stored_history_tolerated(hass, hass_storage) -> None:
    """A corrupt stored history resets to a list instead of breaking setup."""
    from custom_components.tasks.store import STORAGE_KEY, TaskStore

    hass_storage[STORAGE_KEY] = {
        "version": 1,
        "minor_version": 5,
        "key": STORAGE_KEY,
        "data": {
            "tasks": [
                {
                    "id": TASK_ID,
                    "title": "Corrupt",
                    "interval_value": 30,
                    "interval_type": "days",
                    "last_performed": dt_util.now().isoformat(),
                    "history": "not-a-list",
                }
            ],
            "groups": [],
        },
    }
    store = TaskStore(hass)
    await store.async_load()
    assert store.tasks[TASK_ID].history == []


async def test_malformed_history_entries_dropped(hass, hass_storage) -> None:
    """Non-dict or dateless entries are dropped, well-formed ones kept."""
    from custom_components.tasks.store import STORAGE_KEY, TaskStore

    good = {"performed": "2026-08-01", "recorded_at": None, "note": None}
    hass_storage[STORAGE_KEY] = {
        "version": 1,
        "minor_version": 5,
        "key": STORAGE_KEY,
        "data": {
            "tasks": [
                {
                    "id": TASK_ID,
                    "title": "Mixed history",
                    "interval_value": 30,
                    "interval_type": "days",
                    "last_performed": dt_util.now().isoformat(),
                    "history": ["junk", {"note": "no date"}, good, {"performed": 5}],
                }
            ],
            "groups": [],
        },
    }
    store = TaskStore(hass)
    await store.async_load()
    assert store.tasks[TASK_ID].history == [good]


async def test_list_payload_truncates_history(hass, setup_entry) -> None:
    """get_all ships only recent history; get() keeps the full record."""
    from custom_components.tasks.const import LIST_HISTORY_ENTRIES

    data: TasksData = hass.data[DOMAIN]
    data.store.add(make_task())
    for index in range(LIST_HISTORY_ENTRIES + 4):
        data.store.update_last_performed(TASK_ID, note=f"run {index}")

    listed = data.store.get_all()[0]
    assert len(listed["history"]) == LIST_HISTORY_ENTRIES
    assert listed["history"][-1]["note"] == f"run {LIST_HISTORY_ENTRIES + 3}"
    assert len(data.store.get(TASK_ID)["history"]) == LIST_HISTORY_ENTRIES + 4


async def test_configurable_history_cap(hass) -> None:
    """The max_history_entries option caps history; 0 means unlimited."""
    from custom_components.tasks.store import TaskStore

    capped = TaskStore(hass, max_history_entries=2)
    capped.tasks[TASK_ID] = make_task()
    for index in range(5):
        capped.update_last_performed(TASK_ID, note=f"run {index}")
    assert [entry["note"] for entry in capped.tasks[TASK_ID].history] == [
        "run 3",
        "run 4",
    ]

    unlimited = TaskStore(hass, max_history_entries=0)
    unlimited.tasks[TASK_ID] = make_task()
    for index in range(MAX_HISTORY_ENTRIES + 10):
        unlimited.update_last_performed(TASK_ID, note=f"run {index}")
    assert len(unlimited.tasks[TASK_ID].history) == MAX_HISTORY_ENTRIES + 10


async def test_history_cap_option_reaches_store(hass) -> None:
    """A configured max_history_entries option is honored after setup."""
    from unittest.mock import AsyncMock, patch

    from pytest_homeassistant_custom_component.common import MockConfigEntry

    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Tasks",
        data={"admin_only": True, "sidebar_title": "Tasks"},
        options={
            "admin_only": True,
            "sidebar_title": "Tasks",
            "max_history_entries": 3,
        },
    )
    entry.add_to_hass(hass)
    with (
        patch(
            "custom_components.tasks.async_register_panel",
            new=AsyncMock(),
        ),
        patch("custom_components.tasks.async_unregister_panel"),
    ):
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()

        data: TasksData = hass.data[DOMAIN]
        data.store.add(make_task())
        for index in range(6):
            data.store.update_last_performed(TASK_ID, note=f"run {index}")
        assert len(data.store.tasks[TASK_ID].history) == 3
