"""Tests for the repair issues on broken task references."""

from homeassistant.helpers import issue_registry as ir
from homeassistant.util import dt as dt_util

from custom_components.tasks import TasksData
from custom_components.tasks.const import DOMAIN
from custom_components.tasks.store import Task

TASK_ID = "tasks_repair_test"


def make_task(**overrides) -> Task:
    defaults = {
        "id": TASK_ID,
        "title": "Descale Coffee Machine",
        "interval_value": 1,
        "interval_type": "days",
        "last_performed": dt_util.now().isoformat(),
    }
    defaults.update(overrides)
    return Task(**defaults)


def get_issue(hass, issue_id: str):
    return ir.async_get(hass).async_get_issue(DOMAIN, issue_id)


async def test_missing_watched_entity_flagged_and_cleared(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(
        make_task(
            trigger_type="count",
            count_entity_id="switch.coffee",
            count_threshold=60,
        )
    )
    await hass.async_block_till_done()

    issue = get_issue(hass, f"missing_watched_entity_{TASK_ID}")
    assert issue is not None
    assert issue.translation_placeholders == {
        "title": "Descale Coffee Machine",
        "entity_id": "switch.coffee",
    }

    # The entity appearing clears the issue without any task change.
    hass.states.async_set("switch.coffee", "off")
    await hass.async_block_till_done()
    assert get_issue(hass, f"missing_watched_entity_{TASK_ID}") is None


async def test_existing_entity_not_flagged(hass, setup_entry) -> None:
    hass.states.async_set("sensor.generator_hours", "100")
    data: TasksData = hass.data[DOMAIN]
    data.store.add(
        make_task(
            trigger_type="runtime",
            runtime_entity_id="sensor.generator_hours",
            runtime_threshold=50,
        )
    )
    await hass.async_block_till_done()

    assert get_issue(hass, f"missing_watched_entity_{TASK_ID}") is None


async def test_missing_notify_service_flagged_and_cleared(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(
        make_task(
            notifications_enabled=True,
            notification_target="notify.mobile_app_missing_phone",
        )
    )
    await hass.async_block_till_done()

    issue = get_issue(hass, f"missing_notify_service_{TASK_ID}")
    assert issue is not None
    assert issue.translation_placeholders == {
        "title": "Descale Coffee Machine",
        "service": "notify.mobile_app_missing_phone",
    }

    # Registering the service clears the issue.
    async def _noop(call) -> None:
        return None

    hass.services.async_register("notify", "mobile_app_missing_phone", _noop)
    await hass.async_block_till_done()
    assert get_issue(hass, f"missing_notify_service_{TASK_ID}") is None


async def test_deleting_task_clears_its_issues(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(
        make_task(
            trigger_type="count",
            count_entity_id="switch.gone",
            count_threshold=5,
        )
    )
    await hass.async_block_till_done()
    assert get_issue(hass, f"missing_watched_entity_{TASK_ID}") is not None

    data.store.delete(TASK_ID)
    await hass.async_block_till_done()
    assert get_issue(hass, f"missing_watched_entity_{TASK_ID}") is None


async def test_notifications_disabled_not_flagged(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(
        make_task(
            notifications_enabled=False,
            notification_target="notify.mobile_app_missing_phone",
        )
    )
    await hass.async_block_till_done()

    assert get_issue(hass, f"missing_notify_service_{TASK_ID}") is None


async def test_entity_deleted_at_runtime_flagged(hass, setup_entry) -> None:
    """Removing a watched entity while HA runs raises the issue promptly."""
    from homeassistant.helpers import entity_registry as er

    registry = er.async_get(hass)
    entry = registry.async_get_or_create(
        "switch", "demo", "coffee_unique", suggested_object_id="coffee"
    )
    hass.states.async_set(entry.entity_id, "off")

    data: TasksData = hass.data[DOMAIN]
    data.store.add(
        make_task(
            trigger_type="count",
            count_entity_id=entry.entity_id,
            count_threshold=60,
        )
    )
    await hass.async_block_till_done()
    assert get_issue(hass, f"missing_watched_entity_{TASK_ID}") is None

    # Delete the entity: registry entry and state both go away.
    registry.async_remove(entry.entity_id)
    hass.states.async_remove(entry.entity_id)
    await hass.async_block_till_done()

    assert get_issue(hass, f"missing_watched_entity_{TASK_ID}") is not None
