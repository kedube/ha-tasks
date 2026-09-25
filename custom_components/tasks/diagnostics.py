"""Diagnostics support for Tasks."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from homeassistant.components.diagnostics import async_redact_data

from . import const
from .store import STORAGE_VERSION_MAJOR, STORAGE_VERSION_MINOR

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

    from . import TasksConfigEntry

# Free-text and identifying fields: task descriptions, history notes, the
# notification "Open" URL (often an internal address), and NFC tag ids.
TO_REDACT = {"description", "note", "notification_url", "tag_id"}


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant,  # noqa: ARG001
    entry: TasksConfigEntry,
) -> dict[str, Any]:
    """Return diagnostics for the config entry."""
    store = entry.runtime_data.store
    tasks = store.get_all()
    return {
        "version": const.VERSION,
        "storage_version": f"{STORAGE_VERSION_MAJOR}.{STORAGE_VERSION_MINOR}",
        "entry": {
            "data": dict(entry.data),
            "options": dict(entry.options),
        },
        "task_count": len(tasks),
        "groups": store.get_groups(),
        # Serialized with computed trigger state (due / next_due / progress),
        # so a report shows exactly what the entities and panel see.
        "tasks": async_redact_data(tasks, TO_REDACT),
    }
