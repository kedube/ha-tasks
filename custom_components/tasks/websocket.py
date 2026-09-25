"""
Websocket commands for the Tasks integration.

Each command is declared with @websocket_api.websocket_command so its schema
sits next to its handler and registration is a single loop at the bottom.
Mutating commands additionally carry @websocket_api.require_admin: the panel's
admin_only option only hides the sidebar, so without this any authenticated
user could add/update/delete tasks and groups directly over the API. The one
exception is complete_task: every user can already complete a task through
the todo list entity and the reset_last_performed service, and it lets
non-admins use the panel to check tasks off when admin_only is turned off.
"""

from __future__ import annotations

import functools
from typing import TYPE_CHECKING, Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.components.websocket_api import connection
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect

from .const import (
    DEFAULT_DUE_SOON_DAYS,
    DOMAIN,
    OPTION_DUE_SOON_DAYS,
    SIGNAL_TASKS_CHANGED,
    VERSION,
)
from .datetime_utils import normalize_last_performed
from .store import new_task_from_fields
from .task_fields import (
    ADD_TASK_FIELDS,
    INTERVAL_TYPES,
    LABELS_VALIDATOR,
    TASK_FIELD_VALIDATORS,
    bounded_str_or_none,
)

if TYPE_CHECKING:
    from collections.abc import Callable

    from .store import TaskStore

# Add-task schema: required core fields plus every optional task field, all
# generated from the single field map so a new field is one edit there.
_ADD_TASK_SCHEMA = {
    vol.Required("type"): "tasks/add_task",
    vol.Required("title"): TASK_FIELD_VALIDATORS["title"],
    vol.Required("interval_value"): TASK_FIELD_VALIDATORS["interval_value"],
    vol.Required("interval_type"): vol.In(INTERVAL_TYPES),
    vol.Optional("last_performed"): vol.Any(str, None),
    vol.Optional("labels"): LABELS_VALIDATOR,
    **{
        vol.Optional(field): TASK_FIELD_VALIDATORS[field]
        for field in ADD_TASK_FIELDS
        if field not in ("title", "interval_value", "interval_type")
    },
}

# Update schema: the same field validators, all optional, plus labels (which
# live on the entity registry, not the task).
_UPDATES_SCHEMA = vol.Schema(
    {
        vol.Optional("labels"): LABELS_VALIDATOR,
        **{
            vol.Optional(field): validator
            for field, validator in TASK_FIELD_VALIDATORS.items()
        },
    }
)


def _get_store(hass: HomeAssistant) -> TaskStore:
    data = hass.data.get(DOMAIN)
    if data is None:
        msg = "Tasks is not loaded"
        raise RuntimeError(msg)
    return data.store


type _WsHandler = Callable[
    [HomeAssistant, connection.ActiveConnection, dict[str, Any]], None
]


def _handle_store_errors(handler: _WsHandler) -> _WsHandler:
    """Map store RuntimeErrors (and not-loaded) to a clean websocket error."""

    @functools.wraps(handler)
    def wrapper(
        hass: HomeAssistant,
        conn: connection.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        try:
            handler(hass, conn, msg)
        except RuntimeError as err:
            conn.send_error(msg["id"], "invalid_input", str(err))

    return wrapper


# Handlers registered at import time; async_register_websockets registers them.
_COMMANDS: list[_WsHandler] = []


def _register(handler: _WsHandler) -> _WsHandler:
    """Collect a decorated command handler for later registration."""
    _COMMANDS.append(handler)
    return handler


@_register
@websocket_api.websocket_command({vol.Required("type"): "tasks/get_tasks"})
@callback
@_handle_store_errors
def websocket_get_tasks(
    hass: HomeAssistant, connection: connection.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Get all tasks."""
    connection.send_result(msg["id"], _get_store(hass).get_all())


@_register
@websocket_api.websocket_command(
    {
        vol.Required("type"): "tasks/get_task",
        vol.Required("task_id"): str,
    }
)
@callback
@_handle_store_errors
def websocket_get_task(
    hass: HomeAssistant, connection: connection.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Get single tasks."""
    result = _get_store(hass).get(msg["task_id"])
    if result is None:
        connection.send_error(msg["id"], "not_found", "Task not found")
        return
    connection.send_result(msg["id"], result)


@_register
@websocket_api.require_admin
@websocket_api.websocket_command({**_ADD_TASK_SCHEMA})
@callback
@_handle_store_errors
def websocket_add_task(
    hass: HomeAssistant, connection: connection.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Add a new task. The store validates trigger-specific required fields."""
    store = _get_store(hass)

    new_task = new_task_from_fields(msg)
    if new_task is None:
        connection.send_error(
            msg["id"], "invalid_date", f"Could not parse date: {msg['last_performed']}"
        )
        return

    new_id = store.add(new_task, msg.get("labels", []))
    connection.send_result(msg["id"], {"success": True, "id": new_id})


@_register
@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "tasks/update_task",
        vol.Required("task_id"): str,
        vol.Required("updates"): _UPDATES_SCHEMA,
    }
)
@callback
@_handle_store_errors
def websocket_update_task(
    hass: HomeAssistant, connection: connection.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Update a tasks values."""
    store = _get_store(hass)
    updates = dict(msg.get("updates", {}))

    # Only normalize last_performed when a real value was sent. An explicit
    # null (allowed by the schema) is dropped rather than silently rewritten
    # to today — which would mark the task completed today.
    if updates.get("last_performed"):
        last_performed = normalize_last_performed(updates["last_performed"])
        if last_performed is None:
            connection.send_error(
                msg["id"],
                "invalid_date",
                f"Could not parse date: {updates['last_performed']}",
            )
            return
        updates["last_performed"] = last_performed
    else:
        updates.pop("last_performed", None)

    store.update_task(msg["task_id"], updates)
    connection.send_result(msg["id"], {"success": True})


@_register
@websocket_api.websocket_command(
    {
        vol.Required("type"): "tasks/complete_task",
        vol.Required("task_id"): str,
        vol.Optional("note"): bounded_str_or_none,
    }
)
@callback
@_handle_store_errors
def websocket_complete_task(
    hass: HomeAssistant, connection: connection.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Mark a task as completed, optionally recording a history note."""
    _get_store(hass).update_last_performed(msg["task_id"], note=msg.get("note"))
    connection.send_result(msg["id"], {"success": True})


@_register
@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "tasks/remove_task",
        vol.Required("task_id"): str,
    }
)
@callback
@_handle_store_errors
def websocket_remove_task(
    hass: HomeAssistant, connection: connection.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Remove a task."""
    _get_store(hass).delete(msg["task_id"])
    connection.send_result(msg["id"], {"success": True})


@_register
@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "tasks/increment_count",
        vol.Required("task_id"): str,
    }
)
@callback
@_handle_store_errors
def websocket_increment_count(
    hass: HomeAssistant, connection: connection.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Increment the count for a count-based task."""
    _get_store(hass).increment_count(msg["task_id"])
    connection.send_result(msg["id"], {"success": True})


@_register
@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "tasks/reset_count",
        vol.Required("task_id"): str,
    }
)
@callback
@_handle_store_errors
def websocket_reset_count(
    hass: HomeAssistant, connection: connection.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Reset the count for a count-based task."""
    _get_store(hass).reset_count(msg["task_id"])
    connection.send_result(msg["id"], {"success": True})


@_register
@websocket_api.websocket_command({vol.Required("type"): "tasks/get_groups"})
@callback
@_handle_store_errors
def websocket_get_groups(
    hass: HomeAssistant, connection: connection.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Get all group names."""
    connection.send_result(msg["id"], _get_store(hass).get_groups())


@_register
@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "tasks/create_group",
        vol.Required("group_id"): str,
    }
)
@callback
@_handle_store_errors
def websocket_create_group(
    hass: HomeAssistant, connection: connection.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Create a group."""
    _get_store(hass).create_group(msg["group_id"])
    connection.send_result(msg["id"], {"success": True})


@_register
@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "tasks/rename_group",
        vol.Required("old_group_id"): str,
        vol.Required("new_group_id"): str,
    }
)
@callback
@_handle_store_errors
def websocket_rename_group(
    hass: HomeAssistant, connection: connection.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Rename a group, reassigning its member tasks."""
    _get_store(hass).rename_group(msg["old_group_id"], msg["new_group_id"])
    connection.send_result(msg["id"], {"success": True})


@_register
@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "tasks/delete_group",
        vol.Required("group_id"): str,
    }
)
@callback
@_handle_store_errors
def websocket_delete_group(
    hass: HomeAssistant, connection: connection.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Delete a group, moving its member tasks to ungrouped."""
    _get_store(hass).delete_group(msg["group_id"])
    connection.send_result(msg["id"], {"success": True})


@_register
@websocket_api.websocket_command({vol.Required("type"): "tasks/subscribe_updates"})
@callback
def websocket_subscribe_updates(
    hass: HomeAssistant, connection: connection.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Push an event to the subscriber whenever tasks change."""

    @callback
    def forward_update() -> None:
        connection.send_message(
            websocket_api.event_message(msg["id"], {"event": "tasks_changed"})
        )

    connection.subscriptions[msg["id"]] = async_dispatcher_connect(
        hass, SIGNAL_TASKS_CHANGED, forward_update
    )
    connection.send_result(msg["id"])


@_register
@websocket_api.websocket_command({vol.Required("type"): "tasks/get_config"})
@callback
def websocket_get_config(
    hass: HomeAssistant, connection: connection.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Retrieve integration configuration."""
    entries = hass.config_entries.async_entries(DOMAIN)

    if not entries:
        connection.send_error(msg["id"], "not_found", "No config entry found for tasks")
        return

    entry = entries[0]

    connection.send_result(
        msg["id"],
        {
            "data": dict(entry.data),
            "options": dict(entry.options),
            "version": VERSION,
            # Resolved here so installs predating the option get the default.
            "due_soon_days": entry.options.get(
                OPTION_DUE_SOON_DAYS, DEFAULT_DUE_SOON_DAYS
            ),
        },
    )


async def async_register_websockets(hass: HomeAssistant) -> None:
    """Register every collected websocket command."""
    for handler in _COMMANDS:
        websocket_api.async_register_command(hass, handler)
