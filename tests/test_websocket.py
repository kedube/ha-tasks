"""Tests for the websocket API."""


async def add_task_via_ws(ws_client, **overrides):
    """Add a task through the websocket API and return its id."""
    payload = {
        "type": "tasks/add_task",
        "title": "WS Task",
        "interval_value": 30,
        "interval_type": "days",
    }
    payload.update(overrides)
    await ws_client.send_json_auto_id(payload)
    response = await ws_client.receive_json()
    assert response["success"], response
    return response["result"]["id"]


async def test_add_and_get_tasks(hass, setup_entry, hass_ws_client) -> None:
    client = await hass_ws_client(hass)
    task_id = await add_task_via_ws(client, description="notes")

    await client.send_json_auto_id({"type": "tasks/get_tasks"})
    response = await client.receive_json()
    assert response["success"]
    tasks = response["result"]
    assert len(tasks) == 1
    task = tasks[0]
    assert task["id"] == task_id
    assert task["title"] == "WS Task"
    assert task["description"] == "notes"
    # Computed trigger state is included for the panel
    assert task["due"] is False
    assert task["next_due"] is not None


async def test_add_count_task_requires_fields(
    hass, setup_entry, hass_ws_client
) -> None:
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {
            "type": "tasks/add_task",
            "title": "Bad Count",
            "interval_value": 1,
            "interval_type": "days",
            "trigger_type": "count",
        }
    )
    response = await client.receive_json()
    assert not response["success"]
    assert response["error"]["code"] == "invalid_input"


async def test_update_task_rejects_unknown_fields(
    hass, setup_entry, hass_ws_client
) -> None:
    client = await hass_ws_client(hass)
    task_id = await add_task_via_ws(client)

    await client.send_json_auto_id(
        {
            "type": "tasks/update_task",
            "task_id": task_id,
            "updates": {"id": "hacked", "title": "x"},
        }
    )
    response = await client.receive_json()
    assert not response["success"]

    await client.send_json_auto_id(
        {
            "type": "tasks/update_task",
            "task_id": task_id,
            "updates": {"title": "Renamed", "last_performed": "2026-01-15"},
        }
    )
    response = await client.receive_json()
    assert response["success"], response

    await client.send_json_auto_id({"type": "tasks/get_task", "task_id": task_id})
    response = await client.receive_json()
    assert response["result"]["title"] == "Renamed"
    assert response["result"]["id"] == task_id


async def test_increment_and_reset_count(hass, setup_entry, hass_ws_client) -> None:
    client = await hass_ws_client(hass)
    task_id = await add_task_via_ws(
        client,
        trigger_type="count",
        count_entity_id="binary_sensor.door",
        count_threshold=2,
    )

    for _ in range(2):
        await client.send_json_auto_id(
            {"type": "tasks/increment_count", "task_id": task_id}
        )
        response = await client.receive_json()
        assert response["success"]

    await client.send_json_auto_id({"type": "tasks/get_task", "task_id": task_id})
    response = await client.receive_json()
    assert response["result"]["current_count"] == 2
    assert response["result"]["due"] is True
    assert response["result"]["progress_current"] == 2
    assert response["result"]["progress_target"] == 2

    await client.send_json_auto_id({"type": "tasks/reset_count", "task_id": task_id})
    response = await client.receive_json()
    assert response["success"]

    await client.send_json_auto_id({"type": "tasks/get_task", "task_id": task_id})
    response = await client.receive_json()
    assert response["result"]["current_count"] == 0
    assert response["result"]["due"] is False


async def test_complete_task(hass, setup_entry, hass_ws_client) -> None:
    client = await hass_ws_client(hass)
    task_id = await add_task_via_ws(client, last_performed="2020-01-01")

    await client.send_json_auto_id({"type": "tasks/get_task", "task_id": task_id})
    response = await client.receive_json()
    assert response["result"]["due"] is True

    await client.send_json_auto_id({"type": "tasks/complete_task", "task_id": task_id})
    response = await client.receive_json()
    assert response["success"]

    await client.send_json_auto_id({"type": "tasks/get_task", "task_id": task_id})
    response = await client.receive_json()
    assert response["result"]["due"] is False


async def test_remove_task(hass, setup_entry, hass_ws_client) -> None:
    client = await hass_ws_client(hass)
    task_id = await add_task_via_ws(client)

    await client.send_json_auto_id({"type": "tasks/remove_task", "task_id": task_id})
    response = await client.receive_json()
    assert response["success"]

    await client.send_json_auto_id({"type": "tasks/get_tasks"})
    response = await client.receive_json()
    assert response["result"] == []


async def test_get_missing_task_errors(hass, setup_entry, hass_ws_client) -> None:
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "tasks/get_task", "task_id": "nope"})
    response = await client.receive_json()
    assert not response["success"]
    assert response["error"]["code"] == "not_found"


async def test_subscribe_updates_pushes_on_change(
    hass, setup_entry, hass_ws_client
) -> None:
    client = await hass_ws_client(hass)

    await client.send_json_auto_id({"type": "tasks/subscribe_updates"})
    response = await client.receive_json()
    assert response["success"]
    subscription_id = response["id"]

    # The store fires the dispatcher signal synchronously inside add_task, so
    # the pushed event may arrive before the command result.
    await client.send_json_auto_id(
        {
            "type": "tasks/add_task",
            "title": "WS Task",
            "interval_value": 30,
            "interval_type": "days",
        }
    )
    messages = [await client.receive_json(), await client.receive_json()]

    events = [m for m in messages if m["type"] == "event"]
    results = [m for m in messages if m["type"] == "result"]
    assert len(events) == 1
    assert events[0]["id"] == subscription_id
    assert events[0]["event"] == {"event": "tasks_changed"}
    assert len(results) == 1
    assert results[0]["success"]


async def test_get_config_includes_version(hass, setup_entry, hass_ws_client) -> None:
    from custom_components.tasks.const import VERSION

    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "tasks/get_config"})
    response = await client.receive_json()
    assert response["success"]
    assert response["result"]["version"] == VERSION
    assert response["result"]["options"]["admin_only"] is True
    # Entries predating the option get the default window.
    assert response["result"]["due_soon_days"] == 14


async def test_group_lifecycle(hass, setup_entry, hass_ws_client) -> None:
    """Create, list, rename, and delete groups over the websocket API."""
    client = await hass_ws_client(hass)
    task_id = await add_task_via_ws(client, group_id="Kitchen")

    await client.send_json_auto_id({"type": "tasks/create_group", "group_id": "Garage"})
    response = await client.receive_json()
    assert response["success"], response

    await client.send_json_auto_id({"type": "tasks/get_groups"})
    response = await client.receive_json()
    assert response["success"]
    assert response["result"] == ["Garage", "Kitchen"]

    await client.send_json_auto_id(
        {
            "type": "tasks/rename_group",
            "old_group_id": "Kitchen",
            "new_group_id": "Cuisine",
        }
    )
    response = await client.receive_json()
    assert response["success"], response

    await client.send_json_auto_id({"type": "tasks/get_task", "task_id": task_id})
    response = await client.receive_json()
    assert response["result"]["group_id"] == "Cuisine"

    await client.send_json_auto_id(
        {"type": "tasks/delete_group", "group_id": "Cuisine"}
    )
    response = await client.receive_json()
    assert response["success"], response

    await client.send_json_auto_id({"type": "tasks/get_task", "task_id": task_id})
    response = await client.receive_json()
    assert response["result"]["group_id"] is None

    await client.send_json_auto_id({"type": "tasks/get_groups"})
    response = await client.receive_json()
    assert response["result"] == ["Garage"]


async def test_create_group_rejects_blank_name(
    hass, setup_entry, hass_ws_client
) -> None:
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "tasks/create_group", "group_id": "   "})
    response = await client.receive_json()
    assert not response["success"]
    assert response["error"]["code"] == "invalid_input"


async def test_update_task_group(hass, setup_entry, hass_ws_client) -> None:
    client = await hass_ws_client(hass)
    task_id = await add_task_via_ws(client)

    await client.send_json_auto_id(
        {
            "type": "tasks/update_task",
            "task_id": task_id,
            "updates": {"group_id": "Outdoors"},
        }
    )
    response = await client.receive_json()
    assert response["success"], response

    await client.send_json_auto_id({"type": "tasks/get_task", "task_id": task_id})
    response = await client.receive_json()
    assert response["result"]["group_id"] == "Outdoors"

    await client.send_json_auto_id({"type": "tasks/get_groups"})
    response = await client.receive_json()
    assert response["result"] == ["Outdoors"]


async def test_update_to_count_requires_fields(
    hass, setup_entry, hass_ws_client
) -> None:
    """Switching a task's trigger via update is validated like add."""
    client = await hass_ws_client(hass)
    task_id = await add_task_via_ws(client)

    await client.send_json_auto_id(
        {
            "type": "tasks/update_task",
            "task_id": task_id,
            "updates": {"trigger_type": "count"},
        }
    )
    response = await client.receive_json()
    assert not response["success"]
    assert response["error"]["code"] == "invalid_input"

    # The task was left untouched
    await client.send_json_auto_id({"type": "tasks/get_task", "task_id": task_id})
    response = await client.receive_json()
    assert response["result"]["trigger_type"] == "time"


async def test_mutations_on_missing_task_return_clean_errors(
    hass, setup_entry, hass_ws_client
) -> None:
    """Store errors surface as websocket errors, not unhandled exceptions."""
    client = await hass_ws_client(hass)
    for msg in (
        {
            "type": "tasks/update_task",
            "task_id": "nope",
            "updates": {"title": "x"},
        },
        {"type": "tasks/complete_task", "task_id": "nope"},
        {"type": "tasks/remove_task", "task_id": "nope"},
        {"type": "tasks/increment_count", "task_id": "nope"},
        {"type": "tasks/reset_count", "task_id": "nope"},
    ):
        await client.send_json_auto_id(msg)
        response = await client.receive_json()
        assert not response["success"], msg
        assert response["error"]["code"] == "invalid_input", msg


async def test_rename_group_collision_rejected(
    hass, setup_entry, hass_ws_client
) -> None:
    """Renaming a group onto an existing one returns a clean error."""
    client = await hass_ws_client(hass)
    for group in ("Garage", "Basement"):
        await client.send_json_auto_id(
            {"type": "tasks/create_group", "group_id": group}
        )
        assert (await client.receive_json())["success"]

    await client.send_json_auto_id(
        {
            "type": "tasks/rename_group",
            "old_group_id": "Garage",
            "new_group_id": "Basement",
        }
    )
    response = await client.receive_json()
    assert not response["success"]
    assert response["error"]["code"] == "invalid_input"


async def test_notification_fields_round_trip(
    hass, setup_entry, hass_ws_client
) -> None:
    """Notification settings can be set on add, updated, and read back."""
    client = await hass_ws_client(hass)
    task_id = await add_task_via_ws(
        client,
        notifications_enabled=True,
        notification_target="notify.mobile_app_phone",
        notification_time="07:30",
        notify_when="overdue",
        notify_days_before_due=3,
        notification_url="https://example.com/manual",
    )

    await client.send_json_auto_id({"type": "tasks/get_task", "task_id": task_id})
    task = (await client.receive_json())["result"]
    assert task["notifications_enabled"] is True
    assert task["notification_target"] == "notify.mobile_app_phone"
    assert task["notification_time"] == "07:30"
    assert task["notify_when"] == "overdue"
    assert task["notify_days_before_due"] == 3
    assert task["notification_url"] == "https://example.com/manual"

    await client.send_json_auto_id(
        {
            "type": "tasks/update_task",
            "task_id": task_id,
            "updates": {
                "notifications_enabled": False,
                "notification_target": None,
                "notify_days_before_due": None,
            },
        }
    )
    assert (await client.receive_json())["success"]

    await client.send_json_auto_id({"type": "tasks/get_task", "task_id": task_id})
    task = (await client.receive_json())["result"]
    assert task["notifications_enabled"] is False
    assert task["notification_target"] is None
    assert task["notify_days_before_due"] is None

    # Manager-owned bookkeeping is not writable through the API
    await client.send_json_auto_id(
        {
            "type": "tasks/update_task",
            "task_id": task_id,
            "updates": {"snooze_until": "2030-01-01T00:00:00"},
        }
    )
    assert not (await client.receive_json())["success"]


async def test_commands_after_unload_return_error(
    hass, setup_entry, hass_ws_client
) -> None:
    """Commands stay registered after unload but fail cleanly, not with KeyError."""
    client = await hass_ws_client(hass)
    assert await hass.config_entries.async_unload(setup_entry.entry_id)
    await hass.async_block_till_done()

    await client.send_json_auto_id({"type": "tasks/get_tasks"})
    response = await client.receive_json()
    assert not response["success"]
    assert response["error"]["code"] == "invalid_input"


async def test_mutating_commands_require_admin(
    hass, setup_entry, hass_ws_client, hass_read_only_access_token
) -> None:
    """A non-admin user cannot add/update/remove tasks or manage groups."""
    admin = await hass_ws_client(hass)
    task_id = await add_task_via_ws(admin)

    client = await hass_ws_client(hass, hass_read_only_access_token)

    for message in (
        {
            "type": "tasks/add_task",
            "title": "x",
            "interval_value": 1,
            "interval_type": "days",
        },
        {
            "type": "tasks/update_task",
            "task_id": task_id,
            "updates": {"title": "hacked"},
        },
        {"type": "tasks/remove_task", "task_id": task_id},
        {"type": "tasks/create_group", "group_id": "G"},
        {"type": "tasks/delete_group", "group_id": "G"},
    ):
        await client.send_json_auto_id(message)
        response = await client.receive_json()
        assert not response["success"], message
        assert response["error"]["code"] == "unauthorized", message

    # Read-only commands still work for a non-admin.
    await client.send_json_auto_id({"type": "tasks/get_tasks"})
    assert (await client.receive_json())["success"]


async def test_non_admin_can_complete_task(
    hass, setup_entry, hass_ws_client, hass_read_only_access_token
) -> None:
    """Completing is open to every user, as it is via the todo list and services."""
    admin = await hass_ws_client(hass)
    task_id = await add_task_via_ws(admin, last_performed="2020-01-01")

    client = await hass_ws_client(hass, hass_read_only_access_token)
    await client.send_json_auto_id(
        {"type": "tasks/complete_task", "task_id": task_id, "note": "done"}
    )
    response = await client.receive_json()
    assert response["success"], response

    await client.send_json_auto_id({"type": "tasks/get_task", "task_id": task_id})
    task = (await client.receive_json())["result"]
    assert task["due"] is False
    assert task["history"][0]["note"] == "done"


async def test_update_last_performed_null_does_not_complete(
    hass, setup_entry, hass_ws_client
) -> None:
    """An explicit last_performed: null must not silently mark the task done."""
    client = await hass_ws_client(hass)
    task_id = await add_task_via_ws(
        client, last_performed="2020-01-01", interval_value=30, interval_type="days"
    )

    await client.send_json_auto_id({"type": "tasks/get_task", "task_id": task_id})
    original = (await client.receive_json())["result"]["last_performed"]

    await client.send_json_auto_id(
        {
            "type": "tasks/update_task",
            "task_id": task_id,
            "updates": {"last_performed": None, "title": "Renamed"},
        }
    )
    assert (await client.receive_json())["success"]

    await client.send_json_auto_id({"type": "tasks/get_task", "task_id": task_id})
    task = (await client.receive_json())["result"]
    # Title changed, but the completion date was left untouched (not today).
    assert task["title"] == "Renamed"
    assert task["last_performed"] == original


async def test_notification_url_scheme_rejected(
    hass, setup_entry, hass_ws_client
) -> None:
    """A non-http(s) notification_url is rejected by the schema."""
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {
            "type": "tasks/add_task",
            "title": "Bad URL",
            "interval_value": 1,
            "interval_type": "days",
            "notification_url": "javascript:alert(1)",
        }
    )
    response = await client.receive_json()
    assert not response["success"]


async def test_oversized_string_rejected(hass, setup_entry, hass_ws_client) -> None:
    """A title beyond the length bound is rejected."""
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {
            "type": "tasks/add_task",
            "title": "x" * 5000,
            "interval_value": 1,
            "interval_type": "days",
        }
    )
    response = await client.receive_json()
    assert not response["success"]


async def test_update_watched_entity_rebaselines(
    hass, setup_entry, hass_ws_client
) -> None:
    """Changing a runtime task's sensor re-captures the baseline."""
    hass.states.async_set("sensor.a", "100")
    hass.states.async_set("sensor.b", "5000")
    client = await hass_ws_client(hass)
    task_id = await add_task_via_ws(
        client,
        trigger_type="runtime",
        runtime_entity_id="sensor.a",
        runtime_threshold=50,
    )

    await client.send_json_auto_id(
        {
            "type": "tasks/update_task",
            "task_id": task_id,
            "updates": {"runtime_entity_id": "sensor.b"},
        }
    )
    assert (await client.receive_json())["success"]

    await client.send_json_auto_id({"type": "tasks/get_task", "task_id": task_id})
    task = (await client.receive_json())["result"]
    # Baseline re-captured from sensor.b (5000), so not instantly due.
    assert task["runtime_baseline"] == 5000
    assert task["due"] is False


async def test_add_date_task_defaults_to_anchor_pending(
    hass, setup_entry, hass_ws_client
) -> None:
    """A date task with a past anchor and no last_performed is due now."""
    from datetime import timedelta

    from homeassistant.util import dt as dt_util

    anchor = (dt_util.now() - timedelta(days=10)).date()
    client = await hass_ws_client(hass)
    task_id = await add_task_via_ws(
        client,
        title="Winterize Sprinklers",
        trigger_type="date",
        anchor_date=anchor.isoformat(),
        interval_value=1,
        interval_type="years",
    )

    await client.send_json_auto_id({"type": "tasks/get_task", "task_id": task_id})
    response = await client.receive_json()
    task = response["result"]
    assert task["due"] is True
    assert task["next_due"].startswith(anchor.isoformat())
    # An explicit last_performed still wins (checked via a future anchor).
    future = (dt_util.now() + timedelta(days=30)).date()
    other_id = await add_task_via_ws(
        client,
        title="Explicit",
        trigger_type="date",
        anchor_date=future.isoformat(),
        interval_value=1,
        interval_type="years",
        last_performed=dt_util.now().isoformat(),
    )
    await client.send_json_auto_id({"type": "tasks/get_task", "task_id": other_id})
    response = await client.receive_json()
    assert response["result"]["due"] is False
