"""
Single source of truth for user-settable task fields.

The websocket add/update schemas and the store's update whitelist are all
generated from TASK_FIELDS so adding a field is a one-line change here rather
than five coordinated edits across the schemas, the whitelist, and the
add-task constructor.
"""

from __future__ import annotations

import voluptuous as vol

from .const import MAX_STRING_LENGTH, NOTIFICATION_URL_SCHEMES, NOTIFY_WHEN_OPTIONS

TRIGGER_TYPES = ["time", "date", "count", "runtime"]
INTERVAL_TYPES = ["days", "weeks", "months", "years"]

# Shared length-bounded string validators, used across the field map and the
# websocket layer's free-text fields (e.g. history notes).
bounded_str = vol.All(vol.Coerce(str), vol.Length(max=MAX_STRING_LENGTH))
bounded_str_or_none = vol.Any(None, bounded_str)

# Labels ride along with add/update (they live on the entity registry, not
# the task). Bounded so one call cannot bloat the registry entry.
MAX_LABELS = 50
LABELS_VALIDATOR = vol.All([bounded_str], vol.Length(max=MAX_LABELS))


MONTHS_IN_YEAR = 12


def _active_months(value: object) -> list[int]:
    """Validate a seasonal month list: ints 1-12, deduplicated and sorted."""
    if value in (None, "", []):
        return []
    if not isinstance(value, list):
        msg = "active_months must be a list of month numbers"
        raise vol.Invalid(msg)
    months = set()
    for item in value:
        try:
            month = int(item)
        except (TypeError, ValueError):
            msg = f"active_months entry is not a month number: {item!r}"
            raise vol.Invalid(msg) from None
        if not 1 <= month <= MONTHS_IN_YEAR:
            msg = f"active_months entry out of range 1-12: {month}"
            raise vol.Invalid(msg)
        months.add(month)
    return sorted(months)


def _notification_url(value: object) -> str | None:
    """Validate an optional notification URL: http(s) only, length-bounded."""
    if value in (None, ""):
        return None
    text = str(value)
    if len(text) > MAX_STRING_LENGTH:
        msg = f"notification_url exceeds {MAX_STRING_LENGTH} characters"
        raise vol.Invalid(msg)
    scheme = text.split(":", 1)[0].lower() if ":" in text else ""
    if scheme not in NOTIFICATION_URL_SCHEMES:
        msg = "notification_url must be an http(s) URL"
        raise vol.Invalid(msg)
    return text


# Each entry maps a task field to its voluptuous validator. This drives the
# add_task schema, UPDATES_SCHEMA, and ALLOWED_UPDATE_FIELDS. "labels" is
# handled separately (it lives on the entity registry, not the task).
TASK_FIELD_VALIDATORS: dict[str, object] = {
    "title": bounded_str,
    "trigger_type": vol.In(TRIGGER_TYPES),
    # min 1: a zero/negative interval would make a time task permanently due
    # (next_due = last_performed) — the panel enforces this, the API must too.
    "interval_value": vol.All(vol.Coerce(int), vol.Range(min=1)),
    "interval_type": vol.In(INTERVAL_TYPES),
    "last_performed": vol.Any(str, None),
    "anchor_date": bounded_str_or_none,
    "active_months": _active_months,
    "icon": bounded_str_or_none,
    "tag_id": bounded_str_or_none,
    "area_id": bounded_str_or_none,
    "description": bounded_str_or_none,
    "count_entity_id": bounded_str_or_none,
    "count_threshold": vol.Coerce(int),
    "runtime_entity_id": bounded_str_or_none,
    "runtime_threshold": vol.Coerce(float),
    "group_id": bounded_str_or_none,
    "notifications_enabled": bool,
    "notification_target": bounded_str_or_none,
    "notification_time": bounded_str,
    "notification_url": _notification_url,
    "notify_when": vol.In(NOTIFY_WHEN_OPTIONS),
    "notify_days_before_due": vol.Any(None, vol.Coerce(int)),
}

# Fields the store's update_task may write. Everything else (id, current_count,
# runtime_baseline, notification bookkeeping) is integration-managed.
ALLOWED_UPDATE_FIELDS = frozenset(TASK_FIELD_VALIDATORS)

# The subset a client provides when constructing a new task (last_performed
# is normalized separately in websocket_add_task).
ADD_TASK_FIELDS = tuple(
    field for field in TASK_FIELD_VALIDATORS if field != "last_performed"
)
