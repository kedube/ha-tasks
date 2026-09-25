"""Tests for the create_task and mark_overdue services."""

from datetime import date, datetime, timedelta

import pytest
from homeassistant.exceptions import ServiceValidationError
from homeassistant.util import dt as dt_util

from custom_components.tasks import TasksData
from custom_components.tasks.const import (
    DOMAIN,
    SERVICE_CREATE_TASK,
    SERVICE_MARK_OVERDUE,
)
from custom_components.tasks.store import Task


def local(year: int, month: int, day: int) -> datetime:
    return dt_util.start_of_local_day(date(year, month, day))


async def test_create_task_service_creates_entity(hass, setup_entry) -> None:
    response = await hass.services.async_call(
        DOMAIN,
        SERVICE_CREATE_TASK,
        {
            "title": "Replace HVAC Filter",
            "interval_value": 90,
            "description": "MERV 13",
            "icon": "mdi:air-filter",
            "group_id": "HVAC",
        },
        blocking=True,
        return_response=True,
    )
    await hass.async_block_till_done()

    task_id = response["task_id"]
    data: TasksData = hass.data[DOMAIN]
    task = data.store.tasks[task_id]
    assert task.title == "Replace HVAC Filter"
    assert task.interval_value == 90
    assert task.interval_type == "days"
    assert task.description == "MERV 13"
    assert "HVAC" in data.store.get_groups()

    state = hass.states.get("binary_sensor.replace_hvac_filter")
    assert state is not None
    assert state.state == "off"  # last_performed defaulted to today
    assert state.attributes["days_until_due"] == 90


async def test_create_task_service_date_trigger_past_anchor_is_due(
    hass, setup_entry
) -> None:
    anchor = (dt_util.now().date() - timedelta(days=10)).isoformat()
    await hass.services.async_call(
        DOMAIN,
        SERVICE_CREATE_TASK,
        {
            "title": "Fixed Date Task",
            "interval_value": 1,
            "interval_type": "years",
            "trigger_type": "date",
            "anchor_date": anchor,
        },
        blocking=True,
    )
    await hass.async_block_till_done()

    state = hass.states.get("binary_sensor.fixed_date_task")
    assert state is not None
    assert state.state == "on"  # the anchor already passed uncompleted


async def test_create_task_service_rejects_invalid_trigger_fields(
    hass, setup_entry
) -> None:
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN,
            SERVICE_CREATE_TASK,
            {
                "title": "Broken Count Task",
                "interval_value": 1,
                "trigger_type": "count",
            },
            blocking=True,
        )


async def test_create_task_service_rejects_unparseable_last_performed(
    hass, setup_entry
) -> None:
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN,
            SERVICE_CREATE_TASK,
            {
                "title": "Bad Date",
                "interval_value": 30,
                "last_performed": "not-a-date",
            },
            blocking=True,
        )


async def _entity_id_for(hass, task_id: str) -> str:
    from homeassistant.helpers import entity_registry as er

    return er.async_get(hass).async_get_entity_id("binary_sensor", DOMAIN, task_id)


async def test_mark_overdue_time_task(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(
        Task(
            id="tasks_fresh",
            title="Fresh Task",
            interval_value=30,
            interval_type="days",
            last_performed=dt_util.now().isoformat(),
        )
    )
    await hass.async_block_till_done()
    entity_id = await _entity_id_for(hass, "tasks_fresh")
    assert hass.states.get(entity_id).state == "off"

    await hass.services.async_call(
        DOMAIN, SERVICE_MARK_OVERDUE, {"entity_id": entity_id}, blocking=True
    )
    await hass.async_block_till_done()

    state = hass.states.get(entity_id)
    assert state.state == "on"
    assert state.attributes["days_until_due"] < 0


async def test_mark_overdue_date_task(hass, setup_entry, freezer) -> None:
    freezer.move_to(local(2026, 8, 23))
    data: TasksData = hass.data[DOMAIN]
    data.store.add(
        Task(
            id="tasks_dated",
            title="Dated Task",
            trigger_type="date",
            interval_value=1,
            interval_type="months",
            anchor_date="2026-01-15",
            last_performed=dt_util.now().isoformat(),
        )
    )
    await hass.async_block_till_done()
    entity_id = await _entity_id_for(hass, "tasks_dated")
    assert hass.states.get(entity_id).state == "off"

    await hass.services.async_call(
        DOMAIN, SERVICE_MARK_OVERDUE, {"entity_id": entity_id}, blocking=True
    )
    await hass.async_block_till_done()

    state = hass.states.get(entity_id)
    assert state.state == "on"
    # The forced due date is the most recent fixed occurrence, not an
    # arbitrary backdate: Aug 15 for a monthly Jan 15 anchor.
    assert state.attributes["next_due"].startswith("2026-08-15")


async def test_mark_overdue_date_task_with_future_anchor_errors(
    hass, setup_entry
) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(
        Task(
            id="tasks_future",
            title="Future Anchor",
            trigger_type="date",
            interval_value=1,
            interval_type="years",
            anchor_date=(dt_util.now().date() + timedelta(days=60)).isoformat(),
            last_performed=dt_util.now().isoformat(),
        )
    )
    await hass.async_block_till_done()
    entity_id = await _entity_id_for(hass, "tasks_future")

    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN, SERVICE_MARK_OVERDUE, {"entity_id": entity_id}, blocking=True
        )


async def test_mark_overdue_count_task(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(
        Task(
            id="tasks_count",
            title="Count Task",
            trigger_type="count",
            interval_value=1,
            interval_type="days",
            last_performed=dt_util.now().isoformat(),
            count_entity_id="binary_sensor.door",
            count_threshold=10,
        )
    )
    await hass.async_block_till_done()
    entity_id = await _entity_id_for(hass, "tasks_count")
    assert hass.states.get(entity_id).state == "off"

    await hass.services.async_call(
        DOMAIN, SERVICE_MARK_OVERDUE, {"entity_id": entity_id}, blocking=True
    )
    await hass.async_block_till_done()
    assert hass.states.get(entity_id).state == "on"


async def test_mark_overdue_runtime_task(hass, setup_entry) -> None:
    hass.states.async_set("sensor.pump_hours", "120.0")
    data: TasksData = hass.data[DOMAIN]
    data.store.add(
        Task(
            id="tasks_runtime",
            title="Runtime Task",
            trigger_type="runtime",
            interval_value=1,
            interval_type="days",
            last_performed=dt_util.now().isoformat(),
            runtime_entity_id="sensor.pump_hours",
            runtime_threshold=50,
        )
    )
    await hass.async_block_till_done()
    entity_id = await _entity_id_for(hass, "tasks_runtime")
    assert hass.states.get(entity_id).state == "off"

    await hass.services.async_call(
        DOMAIN, SERVICE_MARK_OVERDUE, {"entity_id": entity_id}, blocking=True
    )
    await hass.async_block_till_done()
    assert hass.states.get(entity_id).state == "on"


async def test_mark_overdue_runtime_task_unavailable_sensor_errors(
    hass, setup_entry
) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(
        Task(
            id="tasks_runtime_gone",
            title="Runtime Gone",
            trigger_type="runtime",
            interval_value=1,
            interval_type="days",
            last_performed=dt_util.now().isoformat(),
            runtime_entity_id="sensor.missing",
            runtime_threshold=50,
        )
    )
    await hass.async_block_till_done()
    entity_id = await _entity_id_for(hass, "tasks_runtime_gone")

    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN, SERVICE_MARK_OVERDUE, {"entity_id": entity_id}, blocking=True
        )


async def test_mark_overdue_rejects_foreign_entity(hass, setup_entry) -> None:
    hass.states.async_set("binary_sensor.not_ours", "off")
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN,
            SERVICE_MARK_OVERDUE,
            {"entity_id": "binary_sensor.not_ours"},
            blocking=True,
        )


async def test_mark_overdue_seasonal_task_out_of_season_errors(
    hass, setup_entry, freezer
) -> None:
    """Forcing an out-of-season seasonal task fails instead of no-opping."""
    freezer.move_to(local(2026, 12, 15))
    data: TasksData = hass.data[DOMAIN]
    data.store.add(
        Task(
            id="tasks_seasonal",
            title="Seasonal Task",
            interval_value=2,
            interval_type="weeks",
            last_performed=local(2026, 10, 1).isoformat(),
            active_months=[4, 5, 6, 7, 8, 9, 10],
        )
    )
    await hass.async_block_till_done()
    entity_id = await _entity_id_for(hass, "tasks_seasonal")

    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN, SERVICE_MARK_OVERDUE, {"entity_id": entity_id}, blocking=True
        )


async def test_create_task_rejects_nonpositive_interval(hass, setup_entry) -> None:
    import voluptuous as vol

    with pytest.raises(vol.Invalid):
        await hass.services.async_call(
            DOMAIN,
            SERVICE_CREATE_TASK,
            {"title": "Zero Interval", "interval_value": 0},
            blocking=True,
        )


async def test_create_task_strips_active_months_on_date_trigger(
    hass, setup_entry
) -> None:
    response = await hass.services.async_call(
        DOMAIN,
        SERVICE_CREATE_TASK,
        {
            "title": "Half Seasonal",
            "interval_value": 1,
            "interval_type": "years",
            "trigger_type": "date",
            "anchor_date": "2026-01-15",
            "active_months": [4, 5],
        },
        blocking=True,
        return_response=True,
    )
    await hass.async_block_till_done()
    data: TasksData = hass.data[DOMAIN]
    assert data.store.tasks[response["task_id"]].active_months == []


async def test_create_task_requires_admin_user(
    hass, setup_entry, hass_read_only_user
) -> None:
    """A non-admin user context is rejected; no-user contexts pass."""
    from homeassistant.core import Context
    from homeassistant.exceptions import Unauthorized

    with pytest.raises(Unauthorized):
        await hass.services.async_call(
            DOMAIN,
            SERVICE_CREATE_TASK,
            {"title": "Denied", "interval_value": 30},
            blocking=True,
            context=Context(user_id=hass_read_only_user.id),
        )
    data: TasksData = hass.data[DOMAIN]
    assert not any(t.title == "Denied" for t in data.store.tasks.values())
