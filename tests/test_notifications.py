"""Tests for per-task notifications."""

import asyncio
from datetime import timedelta
from unittest.mock import AsyncMock, patch

import pytest
import voluptuous as vol
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.setup import async_setup_component
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import async_mock_service

from custom_components.tasks import TasksData
from custom_components.tasks.const import (
    DOMAIN,
    NOTIFICATION_ACTION_COMPLETE,
    NOTIFICATION_ACTION_SNOOZE,
    SERVICE_SEND_TASK_NOTIFICATION,
    SERVICE_SNOOZE_TASK,
    SIGNAL_TASKS_CHANGED,
)
from custom_components.tasks.notifications import (
    MOBILE_APP_ACTION_EVENT,
    parse_notification_time,
    resolve_notify_service,
)
from custom_components.tasks.store import Task

from . import entity_id_for


def make_task(**overrides) -> Task:
    """Build an overdue, notification-enabled task with sensible defaults."""
    defaults = {
        "id": "tasks_notify_test",
        "title": "Change Filter",
        "interval_value": 5,
        "interval_type": "days",
        "last_performed": (dt_util.now() - timedelta(days=10)).isoformat(),
        "notifications_enabled": True,
        "notification_target": "notify.mobile_test",
        "notification_time": "00:00",
    }
    defaults.update(overrides)
    return Task(**defaults)


def test_parse_notification_time() -> None:
    assert parse_notification_time("07:30") == (7, 30)
    assert parse_notification_time("07:30:15") == (7, 30)
    assert parse_notification_time(None) == (9, 0)
    assert parse_notification_time("bogus") == (9, 0)


def test_resolve_notify_service() -> None:
    assert resolve_notify_service("notify.mobile_app_x") == ("notify", "mobile_app_x")
    assert resolve_notify_service("mobile_app_x") == ("notify", "mobile_app_x")
    assert resolve_notify_service(None) == ("notify", "notify")


async def test_overdue_task_sends_notification(hass, setup_entry) -> None:
    calls = async_mock_service(hass, "notify", "mobile_test")
    data: TasksData = hass.data[DOMAIN]

    data.store.add(make_task())
    await hass.async_block_till_done()

    assert len(calls) == 1
    assert calls[0].data["title"] == "Change Filter"
    assert "overdue" in calls[0].data["message"]
    actions = calls[0].data["data"]["actions"]
    action_ids = [action["action"] for action in actions]
    assert f"{NOTIFICATION_ACTION_COMPLETE}::tasks_notify_test" in action_ids
    assert f"{NOTIFICATION_ACTION_SNOOZE}::tasks_notify_test" in action_ids

    task = data.store.tasks["tasks_notify_test"]
    assert task.last_notification_kind == "overdue"
    assert task.last_notification_date == dt_util.now().date().isoformat()


async def test_notification_sent_once_per_day(hass, setup_entry) -> None:
    calls = async_mock_service(hass, "notify", "mobile_test")
    data: TasksData = hass.data[DOMAIN]

    data.store.add(make_task())
    await hass.async_block_till_done()
    assert len(calls) == 1

    await data.notifications.async_process_notifications()
    await hass.async_block_till_done()
    assert len(calls) == 1


async def test_not_due_task_does_not_notify(hass, setup_entry) -> None:
    calls = async_mock_service(hass, "notify", "mobile_test")
    data: TasksData = hass.data[DOMAIN]

    data.store.add(
        make_task(last_performed=dt_util.now().isoformat(), interval_value=30)
    )
    await hass.async_block_till_done()

    assert len(calls) == 0


async def test_notifications_disabled_does_not_notify(hass, setup_entry) -> None:
    calls = async_mock_service(hass, "notify", "mobile_test")
    data: TasksData = hass.data[DOMAIN]

    data.store.add(make_task(notifications_enabled=False))
    await hass.async_block_till_done()

    assert len(calls) == 0


async def test_notification_waits_for_send_time(hass, setup_entry, freezer) -> None:
    calls = async_mock_service(hass, "notify", "mobile_test")
    data: TasksData = hass.data[DOMAIN]

    freezer.move_to(dt_util.now().replace(hour=10, minute=0, second=0))
    data.store.add(make_task(notification_time="12:00"))
    await hass.async_block_till_done()
    assert len(calls) == 0

    freezer.move_to(dt_util.now().replace(hour=12, minute=1))
    await data.notifications.async_process_notifications()
    await hass.async_block_till_done()
    assert len(calls) == 1


async def test_due_soon_notification(hass, setup_entry) -> None:
    calls = async_mock_service(hass, "notify", "mobile_test")
    data: TasksData = hass.data[DOMAIN]

    data.store.add(
        make_task(
            interval_value=30,
            last_performed=(dt_util.now() - timedelta(days=27)).isoformat(),
            notify_days_before_due=3,
        )
    )
    await hass.async_block_till_done()

    assert len(calls) == 1
    assert "due in 3 day(s)" in calls[0].data["message"]
    task = data.store.tasks["tasks_notify_test"]
    assert task.last_notification_kind == "due_soon"


async def test_notify_when_due_skips_overdue(hass, setup_entry) -> None:
    calls = async_mock_service(hass, "notify", "mobile_test")
    data: TasksData = hass.data[DOMAIN]

    data.store.add(make_task(notify_when="due"))
    await hass.async_block_till_done()

    assert len(calls) == 0


async def test_count_task_notify_when_overdue_fires(hass, setup_entry) -> None:
    """A dateless task with notify_when='overdue' still notifies when due."""
    calls = async_mock_service(hass, "notify", "mobile_test")
    data: TasksData = hass.data[DOMAIN]

    data.store.add(
        make_task(
            trigger_type="count",
            count_entity_id="switch.test",
            count_threshold=1,
            notify_when="overdue",
        )
    )
    await hass.async_block_till_done()
    assert len(calls) == 0

    data.store.increment_count("tasks_notify_test")
    await hass.async_block_till_done()
    assert len(calls) == 1


async def test_failing_target_retried_at_most_once_per_day(
    hass, setup_entry, caplog
) -> None:
    """A missing notify target is not retried (or re-logged) every pass."""
    data: TasksData = hass.data[DOMAIN]

    # No matching notify service is registered, so the call raises.
    data.store.add(make_task(notification_target="notify.gone"))
    await hass.async_block_till_done()

    warnings = [r for r in caplog.records if "Failed to send notification" in r.message]
    assert len(warnings) == 1

    caplog.clear()
    await data.notifications.async_process_notifications()
    await hass.async_block_till_done()
    # Second pass same day: no retry, no second warning.
    assert not [r for r in caplog.records if "Failed to send notification" in r.message]


async def test_due_count_task_notifies(hass, setup_entry) -> None:
    calls = async_mock_service(hass, "notify", "mobile_test")
    data: TasksData = hass.data[DOMAIN]

    data.store.add(
        make_task(
            trigger_type="count",
            count_entity_id="switch.test",
            count_threshold=1,
        )
    )
    await hass.async_block_till_done()
    assert len(calls) == 0  # counter starts at zero

    data.store.increment_count("tasks_notify_test")
    await hass.async_block_till_done()

    assert len(calls) == 1
    assert "due" in calls[0].data["message"]


async def test_snooze_service_blocks_notifications(hass, setup_entry) -> None:
    calls = async_mock_service(hass, "notify", "mobile_test")
    data: TasksData = hass.data[DOMAIN]

    data.store.add(make_task())
    await hass.async_block_till_done()
    assert len(calls) == 1

    entity_id = entity_id_for(hass, "tasks_notify_test")
    await hass.services.async_call(
        DOMAIN,
        SERVICE_SNOOZE_TASK,
        {"entity_id": entity_id, "days": 1},
        blocking=True,
    )
    await hass.async_block_till_done()

    task = data.store.tasks["tasks_notify_test"]
    assert task.snooze_until is not None
    # Snoozing cleared the daily dedupe state; only the snooze suppresses now.
    assert task.last_notification_date is None

    await data.notifications.async_process_notifications()
    await hass.async_block_till_done()
    assert len(calls) == 1


async def test_send_task_notification_service_forces_send(hass, setup_entry) -> None:
    calls = async_mock_service(hass, "notify", "mobile_test")
    data: TasksData = hass.data[DOMAIN]

    # Not due and notifications disabled — force should send anyway.
    data.store.add(
        make_task(
            notifications_enabled=False,
            last_performed=dt_util.now().isoformat(),
            interval_value=30,
        )
    )
    await hass.async_block_till_done()
    assert len(calls) == 0

    await hass.services.async_call(
        DOMAIN,
        SERVICE_SEND_TASK_NOTIFICATION,
        {"entity_id": entity_id_for(hass, "tasks_notify_test")},
        blocking=True,
    )
    await hass.async_block_till_done()

    assert len(calls) == 1
    assert calls[0].data["title"] == "Change Filter"


async def test_mobile_action_complete_marks_task_done(hass, setup_entry) -> None:
    async_mock_service(hass, "notify", "mobile_test")
    data: TasksData = hass.data[DOMAIN]

    data.store.add(make_task())
    await hass.async_block_till_done()

    hass.bus.async_fire(
        MOBILE_APP_ACTION_EVENT,
        {"action": f"{NOTIFICATION_ACTION_COMPLETE}::tasks_notify_test"},
    )
    await hass.async_block_till_done()

    task = data.store.tasks["tasks_notify_test"]
    assert task.last_performed == dt_util.start_of_local_day().isoformat()


async def test_mobile_action_snooze_snoozes_task(hass, setup_entry) -> None:
    async_mock_service(hass, "notify", "mobile_test")
    data: TasksData = hass.data[DOMAIN]

    data.store.add(make_task())
    await hass.async_block_till_done()

    hass.bus.async_fire(
        MOBILE_APP_ACTION_EVENT,
        {"action": f"{NOTIFICATION_ACTION_SNOOZE}::tasks_notify_test"},
    )
    await hass.async_block_till_done()

    task = data.store.tasks["tasks_notify_test"]
    expected = (dt_util.start_of_local_day() + timedelta(days=1)).isoformat()
    assert task.snooze_until == expected


async def test_mobile_action_for_unknown_task_ignored(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]

    hass.bus.async_fire(
        MOBILE_APP_ACTION_EVENT,
        {"action": f"{NOTIFICATION_ACTION_COMPLETE}::tasks_missing"},
    )
    await hass.async_block_till_done()

    assert data.store.tasks == {}


async def test_notification_url_adds_open_action(hass, setup_entry) -> None:
    calls = async_mock_service(hass, "notify", "mobile_test")
    data: TasksData = hass.data[DOMAIN]

    data.store.add(make_task(notification_url="https://example.com/manual"))
    await hass.async_block_till_done()

    payload = calls[0].data["data"]
    assert payload["url"] == "https://example.com/manual"
    open_actions = [a for a in payload["actions"] if a["action"] == "URI"]
    assert open_actions[0]["uri"] == "https://example.com/manual"


async def test_missing_notify_service_does_not_mark_sent(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]

    data.store.add(make_task(notification_target="notify.does_not_exist"))
    await hass.async_block_till_done()

    task = data.store.tasks["tasks_notify_test"]
    assert task.last_notification_date is None


async def test_completion_dismisses_mobile_notification(hass, setup_entry) -> None:
    """Completing a task clears its outstanding mobile-app notification."""
    calls = async_mock_service(hass, "notify", "mobile_app_test")
    data: TasksData = hass.data[DOMAIN]

    data.store.add(make_task(notification_target="notify.mobile_app_test"))
    await hass.async_block_till_done()
    assert len(calls) == 1  # the overdue notification

    data.store.update_last_performed("tasks_notify_test")
    await hass.async_block_till_done()

    assert len(calls) == 2
    dismiss = calls[1]
    assert dismiss.data["message"] == "clear_notification"
    assert dismiss.data["data"]["tag"] == f"{DOMAIN}_tasks_notify_test"
    task = data.store.tasks["tasks_notify_test"]
    assert task.last_notification_kind is None
    assert task.last_notification_date is None


async def test_completion_does_not_dismiss_non_mobile_target(hass, setup_entry) -> None:
    """Non-companion notify targets never receive a literal clear message."""
    calls = async_mock_service(hass, "notify", "smtp_test")
    data: TasksData = hass.data[DOMAIN]

    data.store.add(make_task(notification_target="notify.smtp_test"))
    await hass.async_block_till_done()
    assert len(calls) == 1

    data.store.update_last_performed("tasks_notify_test")
    await hass.async_block_till_done()

    # No clear_notification call, but the recorded state is still cleared so
    # the task re-notifies when it next becomes due.
    assert len(calls) == 1
    task = data.store.tasks["tasks_notify_test"]
    assert task.last_notification_date is None


async def test_failing_target_does_not_starve_other_tasks(hass, setup_entry) -> None:
    """
    One task's failure used to abort the whole pass, every minute: a target
    rejecting the payload raises vol.Invalid (not a HomeAssistantError).
    """
    assert await async_setup_component(hass, "persistent_notification", {})
    calls = async_mock_service(hass, "notify", "mobile_test")

    async def broken(call) -> None:
        raise KeyError("boom")  # an integration bug, not a HomeAssistantError

    hass.services.async_register("notify", "broken", broken)
    data: TasksData = hass.data[DOMAIN]

    data.store.add(
        make_task(
            id="a", title="A", notification_target="persistent_notification.create"
        )
    )
    data.store.add(make_task(id="c", title="C", notification_target="notify.broken"))
    data.store.add(make_task(id="b", title="B"))
    await hass.async_block_till_done()

    assert [call.data["title"] for call in calls] == ["B"]
    today = dt_util.now().date().isoformat()
    # Both failures back off until tomorrow instead of retrying every minute.
    assert data.notifications._send_failed_on == {"a": today, "c": today}


async def test_seasonal_task_does_not_nag_out_of_season(hass, setup_entry) -> None:
    """Out of season the entity reads not-due; notifications must agree."""
    calls = async_mock_service(hass, "notify", "mobile_test")
    due_day = dt_util.now().date() - timedelta(days=60)
    data: TasksData = hass.data[DOMAIN]
    data.store.add(
        make_task(
            last_performed=dt_util.start_of_local_day(
                due_day - timedelta(days=5)
            ).isoformat(),
            active_months=[due_day.month],
        )
    )
    await hass.async_block_till_done()

    assert hass.states.get(entity_id_for(hass, "tasks_notify_test")).state == "off"
    assert calls == []


async def test_hung_notify_coalesces_and_times_out(hass, setup_entry, caplog) -> None:
    """
    A hung notify call used to hold the lock forever while every change
    signal queued another pass behind it.
    """
    never = asyncio.Event()
    attempts = 0

    async def hang(call) -> None:
        nonlocal attempts
        attempts += 1
        await never.wait()

    hass.services.async_register("notify", "slow", hang)
    data: TasksData = hass.data[DOMAIN]
    manager = data.notifications

    with patch("custom_components.tasks.notifications.SEND_TIMEOUT", 0.05):
        data.store.add(make_task(notification_target="notify.slow"))
        await asyncio.sleep(0)
        for _ in range(200):
            async_dispatcher_send(hass, SIGNAL_TASKS_CHANGED)
        assert not manager._lock._waiters  # coalesced: nothing queued
        await hass.async_block_till_done(wait_background_tasks=True)

    # The coalesced re-run skips the task: its send already failed today.
    assert attempts == 1
    assert "TimeoutError" in caplog.text


async def test_reload_cancels_in_flight_pass(hass, setup_entry) -> None:
    """
    A pass blocked on a send used to resume after a reload, write to the old
    store (leaving a stale save pending), and duplicate the notification.
    """
    release = asyncio.Event()
    delivered: list[str] = []

    async def slow(call) -> None:
        await release.wait()
        delivered.append(call.data["title"])

    hass.services.async_register("notify", "slow", slow)
    old_store = hass.data[DOMAIN].store
    old_store.add(make_task(notification_target="notify.slow"))
    for _ in range(5):
        await asyncio.sleep(0)

    with (
        patch("custom_components.tasks.async_register_panel", new=AsyncMock()),
        patch("custom_components.tasks.async_unregister_panel"),
    ):
        await hass.config_entries.async_reload(setup_entry.entry_id)
    release.set()
    await hass.async_block_till_done()

    new_store = hass.data[DOMAIN].store
    assert new_store is not old_store
    assert delivered == ["Change Filter"]  # once, by the new entry's pass
    assert old_store.tasks["tasks_notify_test"].last_notification_date is None
    assert old_store._store._delay_handle is None  # no stale write pending
    assert new_store.tasks["tasks_notify_test"].last_notification_date is not None


async def test_snooze_days_are_bounded(hass, setup_entry) -> None:
    """A huge snooze used to overflow the date computation."""
    data: TasksData = hass.data[DOMAIN]
    data.store.add(make_task(notifications_enabled=False))
    await hass.async_block_till_done()
    with pytest.raises(vol.Invalid):
        await hass.services.async_call(
            DOMAIN,
            SERVICE_SNOOZE_TASK,
            {"entity_id": entity_id_for(hass, "tasks_notify_test"), "days": 10**7},
            blocking=True,
        )
