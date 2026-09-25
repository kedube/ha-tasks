"""Tests for integration setup, entities, watchers, and services."""

from homeassistant.util import dt as dt_util

from custom_components.tasks import TasksData
from custom_components.tasks.const import (
    DOMAIN,
    SERVICE_INCREMENT_COUNT,
    SERVICE_RESET,
    SERVICE_RESET_COUNT,
)
from custom_components.tasks.store import STORAGE_KEY


def seed_storage(hass_storage, tasks: list[dict]) -> None:
    """Seed the store's persisted data before setup."""
    hass_storage[STORAGE_KEY] = {
        "version": 1,
        "minor_version": 2,
        "key": STORAGE_KEY,
        "data": tasks,
    }


async def test_setup_creates_entities_for_stored_tasks(
    hass, hass_storage, setup_entry
) -> None:
    # setup_entry ran with empty storage; add via the store and verify the
    # dispatcher path creates the entity.
    data: TasksData = hass.data[DOMAIN]
    from custom_components.tasks.store import Task

    data.store.add(
        Task(
            id="tasks_abc",
            title="Change Filter",
            interval_value=90,
            interval_type="days",
            last_performed="2020-01-01T00:00:00",
        )
    )
    await hass.async_block_till_done()

    state = hass.states.get("binary_sensor.change_filter")
    assert state is not None
    assert state.state == "on"  # long overdue
    assert state.attributes["trigger_type"] == "time"
    assert state.attributes["interval_value"] == 90


async def test_stored_tasks_create_entities_on_startup(hass, hass_storage) -> None:
    seed_storage(
        hass_storage,
        [
            {
                "id": "tasks_seed",
                "title": "Clean Gutters",
                "interval_value": 30,
                "interval_type": "days",
                "last_performed": "2020-01-01T00:00:00",
            }
        ],
    )

    from unittest.mock import AsyncMock, patch

    from pytest_homeassistant_custom_component.common import MockConfigEntry

    entry = MockConfigEntry(domain=DOMAIN, data={}, options={})
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

    state = hass.states.get("binary_sensor.clean_gutters")
    assert state is not None
    assert state.state == "on"


async def test_count_watcher_increments_on_transition(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    from custom_components.tasks.store import Task

    hass.states.async_set("binary_sensor.garage_door", "off")

    task = Task(
        id="tasks_count",
        title="Lube Garage Door",
        interval_value=1,
        interval_type="days",
        last_performed="2026-01-01T00:00:00",
        trigger_type="count",
        count_entity_id="binary_sensor.garage_door",
        count_threshold=3,
    )
    data.store.add(task)
    await hass.async_block_till_done()

    # off -> on increments
    hass.states.async_set("binary_sensor.garage_door", "on")
    await hass.async_block_till_done()
    assert task.current_count == 1

    # on -> on (attribute-only change) does not increment
    hass.states.async_set("binary_sensor.garage_door", "on", {"x": 1})
    await hass.async_block_till_done()
    assert task.current_count == 1

    # off -> on again increments
    hass.states.async_set("binary_sensor.garage_door", "off")
    hass.states.async_set("binary_sensor.garage_door", "on")
    await hass.async_block_till_done()
    assert task.current_count == 2

    # unrelated entity does nothing
    hass.states.async_set("binary_sensor.other", "on")
    await hass.async_block_till_done()
    assert task.current_count == 2


async def test_runtime_watcher_tolerates_transient_dip(hass, setup_entry) -> None:
    """A below-baseline reading is tolerated transiently, not persisted as 0."""
    data: TasksData = hass.data[DOMAIN]
    from custom_components.tasks.store import Task
    from custom_components.tasks.triggers import get_trigger

    hass.states.async_set("sensor.pump_hours", "100")

    task = Task(
        id="tasks_rt",
        title="Service Pump",
        interval_value=1,
        interval_type="days",
        last_performed="2026-01-01T00:00:00",
        trigger_type="runtime",
        runtime_entity_id="sensor.pump_hours",
        runtime_threshold=50,
    )
    data.store.add(task)
    await hass.async_block_till_done()
    assert task.runtime_baseline == 100

    # A momentary dip below the baseline must NOT permanently rewrite the
    # stored baseline to 0 (which would turn the sensor's lifetime total into
    # accumulated runtime once it recovers). delta() tolerates a below-
    # baseline reading transiently by treating the baseline as 0 for that
    # reading only, without persisting it.
    trigger = get_trigger("runtime")
    hass.states.async_set("sensor.pump_hours", "3")
    await hass.async_block_till_done()
    assert task.runtime_baseline == 100

    # When the sensor recovers to a normal reading, progress resumes from the
    # original stored baseline (140 - 100 = 40), NOT from 0 (which would give
    # 140 and instantly exceed the 50 threshold).
    hass.states.async_set("sensor.pump_hours", "140")
    await hass.async_block_till_done()
    assert task.runtime_baseline == 100
    assert trigger.delta(hass, task) == 40
    assert trigger.is_due(hass, task) is False


async def test_runtime_baseline_pending_when_sensor_unavailable(
    hass, setup_entry
) -> None:
    """Baseline is captured from the first real reading, not anchored at 0."""
    data: TasksData = hass.data[DOMAIN]
    from custom_components.tasks.store import Task
    from custom_components.tasks.triggers import get_trigger

    hass.states.async_set("sensor.gen_hours", "unavailable")

    task = Task(
        id="tasks_rt2",
        title="Service Generator",
        interval_value=1,
        interval_type="days",
        last_performed="2026-01-01T00:00:00",
        trigger_type="runtime",
        runtime_entity_id="sensor.gen_hours",
        runtime_threshold=50,
    )
    data.store.add(task)
    await hass.async_block_till_done()
    # Pending, not 0 — so it does not read as instantly due later.
    assert task.runtime_baseline is None

    trigger = get_trigger("runtime")
    hass.states.async_set("sensor.gen_hours", "1500")
    await hass.async_block_till_done()
    assert task.runtime_baseline == 1500
    assert trigger.is_due(hass, task) is False


async def test_services(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    from custom_components.tasks.store import Task

    task = Task(
        id="tasks_svc",
        title="Descale Machine",
        interval_value=1,
        interval_type="days",
        last_performed="2020-01-01T00:00:00",
        trigger_type="count",
        count_entity_id="binary_sensor.brew",
        count_threshold=10,
    )
    data.store.add(task)
    await hass.async_block_till_done()

    entity_id = "binary_sensor.descale_machine"
    assert hass.states.get(entity_id) is not None

    await hass.services.async_call(
        DOMAIN, SERVICE_INCREMENT_COUNT, {"entity_id": entity_id}, blocking=True
    )
    assert task.current_count == 1

    await hass.services.async_call(
        DOMAIN, SERVICE_RESET_COUNT, {"entity_id": entity_id}, blocking=True
    )
    assert task.current_count == 0

    await hass.services.async_call(
        DOMAIN,
        SERVICE_RESET,
        {"entity_id": entity_id, "performed_date": "2026-07-01"},
        blocking=True,
    )
    assert task.last_performed.startswith("2026-07-01")


async def test_entity_removed_with_task(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    from custom_components.tasks.store import Task

    task = Task(
        id="tasks_gone",
        title="Doomed Task",
        interval_value=1,
        interval_type="days",
        last_performed="2026-01-01T00:00:00",
    )
    data.store.add(task)
    await hass.async_block_till_done()
    assert hass.states.get("binary_sensor.doomed_task") is not None

    data.store.delete(task.id)
    await hass.async_block_till_done()
    assert hass.states.get("binary_sensor.doomed_task") is None


async def test_service_reset_uses_local_calendar_date(hass, setup_entry) -> None:
    """performed_date is interpreted in HA's timezone, not as UTC."""
    await hass.config.async_set_time_zone("America/New_York")

    data: TasksData = hass.data[DOMAIN]
    from custom_components.tasks.store import Task

    task = Task(
        id="tasks_tz",
        title="Timezone Task",
        interval_value=30,
        interval_type="days",
        last_performed="2020-01-01T00:00:00",
    )
    data.store.add(task)
    await hass.async_block_till_done()

    await hass.services.async_call(
        DOMAIN,
        SERVICE_RESET,
        {"entity_id": "binary_sensor.timezone_task", "performed_date": "2026-07-01"},
        blocking=True,
    )
    # A naive-UTC interpretation would have stored 2026-06-30 here.
    assert task.last_performed.startswith("2026-07-01")


async def test_runtime_watcher_gates_insignificant_ticks(hass, setup_entry) -> None:
    """Sub-unit runtime ticks don't rewrite entity state; real changes do."""
    data: TasksData = hass.data[DOMAIN]
    from custom_components.tasks.store import Task

    hass.states.async_set("sensor.fan_hours", "100")
    task = Task(
        id="tasks_gate",
        title="Clean Fan",
        interval_value=1,
        interval_type="days",
        last_performed="2026-01-01T00:00:00",
        trigger_type="runtime",
        runtime_entity_id="sensor.fan_hours",
        runtime_threshold=50,
    )
    data.store.add(task)
    await hass.async_block_till_done()

    entity_id = "binary_sensor.clean_fan"
    assert hass.states.get(entity_id).attributes["runtime_delta"] == 0

    # Sub-unit tick: no push, entity attributes stay put
    hass.states.async_set("sensor.fan_hours", "100.4")
    await hass.async_block_till_done()
    assert hass.states.get(entity_id).attributes["runtime_delta"] == 0

    # Whole-unit progress: pushed
    hass.states.async_set("sensor.fan_hours", "101.5")
    await hass.async_block_till_done()
    assert hass.states.get(entity_id).attributes["runtime_delta"] == 1.5

    # Crossing the threshold flips the sensor on
    hass.states.async_set("sensor.fan_hours", "151.5")
    await hass.async_block_till_done()
    assert hass.states.get(entity_id).state == "on"


async def test_unload_removes_services_and_data(hass, setup_entry) -> None:
    """Unloading the entry deregisters services and clears hass.data."""
    assert hass.services.has_service(DOMAIN, SERVICE_RESET)
    assert hass.services.has_service(DOMAIN, SERVICE_INCREMENT_COUNT)
    assert hass.services.has_service(DOMAIN, SERVICE_RESET_COUNT)

    assert await hass.config_entries.async_unload(setup_entry.entry_id)
    await hass.async_block_till_done()

    assert not hass.services.has_service(DOMAIN, SERVICE_RESET)
    assert not hass.services.has_service(DOMAIN, SERVICE_INCREMENT_COUNT)
    assert not hass.services.has_service(DOMAIN, SERVICE_RESET_COUNT)
    assert DOMAIN not in hass.data


async def test_unload_flushes_pending_save(hass, hass_storage, setup_entry) -> None:
    """A mutation within the delayed-save window is persisted on unload."""
    from custom_components.tasks.store import Task

    data: TasksData = hass.data[DOMAIN]
    data.store.add(
        Task(
            id="tasks_flush",
            title="Flush Test",
            interval_value=30,
            interval_type="days",
            last_performed="2026-01-01T00:00:00",
        )
    )
    # Unload before the 1s delayed save would fire.
    assert await hass.config_entries.async_unload(setup_entry.entry_id)
    await hass.async_block_till_done()

    stored = hass_storage[STORAGE_KEY]["data"]["tasks"]
    assert any(t["id"] == "tasks_flush" for t in stored)


async def test_tag_scan_without_tag_id_completes_nothing(hass, setup_entry) -> None:
    """A tag_scanned event with no tag_id must not complete orphaned tasks."""
    from homeassistant.components.tag.const import EVENT_TAG_SCANNED

    from custom_components.tasks.store import Task

    data: TasksData = hass.data[DOMAIN]
    data.store.add(
        Task(
            id="tasks_orphan",
            title="Orphan Tag Task",
            interval_value=30,
            interval_type="days",
            last_performed="2020-01-01T00:00:00",
            tag_id="tag.deleted",  # not present in the entity registry
        )
    )
    await hass.async_block_till_done()
    before = data.store.tasks["tasks_orphan"].last_performed

    hass.bus.async_fire(EVENT_TAG_SCANNED, {})  # no tag_id
    await hass.async_block_till_done()

    assert data.store.tasks["tasks_orphan"].last_performed == before


async def test_count_watcher_ignores_unavailable_to_on(hass, setup_entry) -> None:
    """A reconnect (unavailable -> on) must not count as an activation."""
    from custom_components.tasks.store import Task

    data: TasksData = hass.data[DOMAIN]
    data.store.add(
        Task(
            id="tasks_cnt",
            title="Count Task",
            interval_value=1,
            interval_type="days",
            last_performed="2026-01-01T00:00:00",
            trigger_type="count",
            count_entity_id="switch.appliance",
            count_threshold=5,
        )
    )
    await hass.async_block_till_done()

    hass.states.async_set("switch.appliance", "unavailable")
    await hass.async_block_till_done()
    hass.states.async_set("switch.appliance", "on")
    await hass.async_block_till_done()
    assert data.store.tasks["tasks_cnt"].current_count == 0

    # A genuine off -> on still counts.
    hass.states.async_set("switch.appliance", "off")
    await hass.async_block_till_done()
    hass.states.async_set("switch.appliance", "on")
    await hass.async_block_till_done()
    assert data.store.tasks["tasks_cnt"].current_count == 1


async def test_watchers_rebuild_for_shared_entity(hass, setup_entry) -> None:
    """A second task counting an already-watched entity still increments."""
    from custom_components.tasks.store import Task

    data: TasksData = hass.data[DOMAIN]
    for suffix in ("a", "b"):
        data.store.add(
            Task(
                id=f"tasks_{suffix}",
                title=f"Task {suffix}",
                interval_value=1,
                interval_type="days",
                last_performed="2026-01-01T00:00:00",
                trigger_type="count",
                count_entity_id="switch.shared",
                count_threshold=5,
            )
        )
        await hass.async_block_till_done()

    hass.states.async_set("switch.shared", "off")
    await hass.async_block_till_done()
    hass.states.async_set("switch.shared", "on")
    await hass.async_block_till_done()

    # Both tasks, including the one added after the entity was first watched.
    assert data.store.tasks["tasks_a"].current_count == 1
    assert data.store.tasks["tasks_b"].current_count == 1


async def test_tag_scan_completes_every_task_sharing_the_tag(hass, setup_entry) -> None:
    """A scan completes all tasks bound to that tag, and only those."""
    from homeassistant.components.tag.const import EVENT_TAG_SCANNED
    from homeassistant.helpers import entity_registry as er

    from custom_components.tasks.store import Task

    # A tag entity whose registry unique_id is the UUID the event carries.
    registry = er.async_get(hass)
    registry.async_get_or_create(
        "tag", "tag", "tag-uuid-1", suggested_object_id="kitchen"
    )

    data: TasksData = hass.data[DOMAIN]
    for task_id in ("tasks_tagged_a", "tasks_tagged_b"):
        data.store.add(
            Task(
                id=task_id,
                title=task_id,
                interval_value=30,
                interval_type="days",
                last_performed="2020-01-01T00:00:00",
                tag_id="tag.kitchen",
            )
        )
    data.store.add(
        Task(
            id="tasks_untagged",
            title="Untagged",
            interval_value=30,
            interval_type="days",
            last_performed="2020-01-01T00:00:00",
        )
    )
    await hass.async_block_till_done()
    untouched = data.store.tasks["tasks_untagged"].last_performed

    hass.bus.async_fire(EVENT_TAG_SCANNED, {"tag_id": "tag-uuid-1"})
    await hass.async_block_till_done()

    today = dt_util.start_of_local_day().isoformat()
    assert data.store.tasks["tasks_tagged_a"].last_performed == today
    assert data.store.tasks["tasks_tagged_b"].last_performed == today
    # A task without that tag is left alone.
    assert data.store.tasks["tasks_untagged"].last_performed == untouched
