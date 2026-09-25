"""Constants for the Tasks integration."""

import voluptuous as vol
from homeassistant.config_entries import ConfigEntry
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.device_registry import DeviceInfo

VERSION = "1.8"
NAME = "Tasks"
MANUFACTURER = "@TJPoorman"

DOMAIN = "tasks"

# Upper bound on user-supplied free-text fields, enforced by the websocket
# schemas so a client cannot bloat the storage file with huge strings.
MAX_STRING_LENGTH = 500

# Completion-history entries kept per task (oldest dropped beyond this) —
# the default for the max_history_entries option, where 0 means unlimited —
# and how many of them ride along in the task-list payload every panel
# refetches on every change (the single-task fetch returns the full history).
MAX_HISTORY_ENTRIES = 50
LIST_HISTORY_ENTRIES = 5
OPTION_MAX_HISTORY = "max_history_entries"

# How many days ahead the panel counts a task as "Due soon" (0 = only tasks
# due today or overdue); the default for the due_soon_days option.
DEFAULT_DUE_SOON_DAYS = 14
OPTION_DUE_SOON_DAYS = "due_soon_days"

# Calendar projection bounds: future occurrences per task are generated up to
# this horizon, capped so a short-interval task can't flood the calendar.
CALENDAR_PROJECTION_DAYS = 365
CALENDAR_MAX_OCCURRENCES = 53

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

PANEL_URL = "tasks"
PANEL_API_PATH = "/tasks_static"
# The ?v= query string maps each frontend bundle to the installed integration
# version so browsers refetch (instead of reusing cached modules) on upgrade.
PANEL_API_URL = f"{PANEL_API_PATH}/main.js?v={VERSION}"
ADD_TASK_CARD_API_URL = f"{PANEL_API_PATH}/add-task-card.js?v={VERSION}"
PANEL_TITLE = NAME
PANEL_ICON = "mdi:checkbox-marked-circle-auto-outline"
PANEL_NAME = "tasks-panel"

DEVICE_KEY = "tasks_hub"


def device_info() -> DeviceInfo:
    """Return the shared hub DeviceInfo every entity attaches to."""
    return DeviceInfo(
        identifiers={(DOMAIN, DEVICE_KEY)},
        name=NAME,
        model=NAME,
        sw_version=VERSION,
        manufacturer=MANUFACTURER,
    )


# Dispatcher signals fired by the TaskStore on mutations. Entities, the
# watched-entity listeners, and panel subscriptions all react to these.
SIGNAL_TASK_ADDED = f"{DOMAIN}_task_added"  # payload: (task, labels)
SIGNAL_TASK_REMOVED = f"{DOMAIN}_task_removed"  # payload: (task_id,)
SIGNAL_TASKS_CHANGED = f"{DOMAIN}_tasks_changed"  # payload: none


def signal_task_updated(task_id: str) -> str:
    """
    Per-task update signal name (payload: none).

    Each task's entity subscribes to its own signal so an update dispatches to
    exactly that entity, instead of a global signal every entity subscribes to
    and then filters — which was O(n) per update.
    """
    return f"{DOMAIN}_task_updated_{task_id}"


# Bus events for automations. task_completed fires on every completion (panel,
# service, tag scan, mobile action, todo item); task_due fires when a task's
# entity transitions to due while Home Assistant is running.
EVENT_TASK_COMPLETED = f"{DOMAIN}_task_completed"
EVENT_TASK_DUE = f"{DOMAIN}_task_due"

SERVICE_RESET = "reset_last_performed"
SERVICE_RESET_SCHEMA = vol.Schema(
    {
        vol.Required("entity_id"): cv.entity_id,
        vol.Optional("performed_date"): cv.string,
        vol.Optional("note"): vol.All(cv.string, vol.Length(max=MAX_STRING_LENGTH)),
    }
)

SERVICE_INCREMENT_COUNT = "increment_count"
SERVICE_INCREMENT_COUNT_SCHEMA = vol.Schema(
    {
        vol.Required("entity_id"): cv.entity_id,
    }
)

SERVICE_RESET_COUNT = "reset_count"
SERVICE_RESET_COUNT_SCHEMA = vol.Schema(
    {
        vol.Required("entity_id"): cv.entity_id,
    }
)

# Per-task notifications. notify_when picks which due states notify;
# the mobile action ids round-trip through mobile_app notification events.
NOTIFY_WHEN_OPTIONS = ["due", "overdue", "due_and_overdue"]

# Only these schemes are allowed for a task's notification "Open" URL, so a
# task edit cannot smuggle a javascript:/intent:/file: target into a trusted
# Home Assistant notification.
NOTIFICATION_URL_SCHEMES = ("http", "https")
NOTIFICATION_ACTION_COMPLETE = "TASKS_COMPLETE"
NOTIFICATION_ACTION_SNOOZE = "TASKS_SNOOZE"
DEFAULT_SNOOZE_DAYS = 1

SERVICE_SNOOZE_TASK = "snooze_task"
SERVICE_SNOOZE_TASK_SCHEMA = vol.Schema(
    {
        vol.Required("entity_id"): cv.entity_id,
        vol.Optional("days", default=DEFAULT_SNOOZE_DAYS): vol.All(
            vol.Coerce(int), vol.Range(min=1)
        ),
    }
)

SERVICE_SEND_TASK_NOTIFICATION = "send_task_notification"
SERVICE_SEND_TASK_NOTIFICATION_SCHEMA = vol.Schema(
    {
        vol.Required("entity_id"): cv.entity_id,
    }
)

# The create_task schema is built in __init__.py from the shared task-field
# validators (task_fields.py) so it stays in lockstep with the websocket API.
SERVICE_CREATE_TASK = "create_task"

SERVICE_MARK_OVERDUE = "mark_overdue"
SERVICE_MARK_OVERDUE_SCHEMA = vol.Schema(
    {
        vol.Required("entity_id"): cv.entity_id,
    }
)

CONFIG_STEP_USER_DATA_SCHEMA = vol.Schema(
    {
        vol.Optional("admin_only", default=True): cv.boolean,
        vol.Optional("sidebar_title", default=PANEL_TITLE): cv.string,
    }
)


def get_options_schema(config_entry: ConfigEntry) -> vol.Schema:
    """Return the schema for get options."""
    return vol.Schema(
        {
            vol.Optional(
                "admin_only",
                default=config_entry.options.get(
                    "admin_only", config_entry.data.get("admin_only", True)
                ),
            ): cv.boolean,
            vol.Optional(
                "sidebar_title",
                default=config_entry.options.get(
                    "sidebar_title",
                    config_entry.data.get("sidebar_title", PANEL_TITLE),
                ),
            ): cv.string,
            vol.Optional(
                OPTION_DUE_SOON_DAYS,
                default=config_entry.options.get(
                    OPTION_DUE_SOON_DAYS, DEFAULT_DUE_SOON_DAYS
                ),
            ): vol.All(vol.Coerce(int), vol.Range(min=0, max=365)),
            vol.Optional(
                OPTION_MAX_HISTORY,
                default=config_entry.options.get(
                    OPTION_MAX_HISTORY, MAX_HISTORY_ENTRIES
                ),
            ): vol.All(vol.Coerce(int), vol.Range(min=0)),
        }
    )
