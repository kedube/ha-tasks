"""Store Tasks configuration."""

import logging
import uuid
from datetime import datetime
from typing import Any

import attr
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry, storage
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.util import dt as dt_util

from . import const
from .datetime_utils import (
    default_date_task_last_performed,
    normalize_last_performed,
)
from .task_fields import ADD_TASK_FIELDS, ALLOWED_UPDATE_FIELDS
from .triggers import get_trigger

_LOGGER = logging.getLogger(__name__)

STORAGE_KEY = f"{const.DOMAIN}.storage"
# The storage file from before the integration was renamed (domain
# home_maintenance). Read once, on the first setup that finds no tasks.storage,
# so existing tasks carry over; the old file is left in place.
LEGACY_STORAGE_KEY = "home_maintenance.storage"
STORAGE_VERSION_MAJOR = 1
STORAGE_VERSION_MINOR = 5
SAVE_DELAY = 1.0

# ALLOWED_UPDATE_FIELDS (the fields a websocket update may modify) is derived
# from the single task-field map in task_fields.py. "labels" is intentionally
# absent: labels live in the entity registry, not on the task, so update_task
# applies them to the registry entry instead. id/current_count/
# runtime_baseline and the notification bookkeeping below are never client-
# writable.

# Fields owned by the notification manager, written via
# update_notification_state rather than update_task.
NOTIFICATION_STATE_FIELDS = {
    "snooze_until",
    "last_notification_kind",
    "last_notification_date",
}


@attr.s(slots=True)
class Task:
    """Represents a single task."""

    id: str = attr.ib()
    title: str = attr.ib()
    interval_value: int = attr.ib()
    interval_type: str = attr.ib()
    last_performed: str = attr.ib()
    # Fixed calendar date the "date" trigger's schedule is anchored to.
    anchor_date: str | None = attr.ib(default=None)
    # Seasonal restriction for time-based tasks: months (1-12) the task is
    # active in. Empty means year-round.
    active_months: list[int] = attr.ib(factory=list)
    tag_id: str | None = attr.ib(default=None)
    icon: str | None = attr.ib(default=None)
    trigger_type: str = attr.ib(default="time")
    count_entity_id: str | None = attr.ib(default=None)
    count_threshold: int = attr.ib(default=0)
    current_count: int = attr.ib(default=0)
    runtime_entity_id: str | None = attr.ib(default=None)
    runtime_threshold: float = attr.ib(default=0)
    # None means "capture the baseline from the sensor's first available
    # reading" — used when the sensor is unavailable at create/complete time
    # so a task never baselines at 0 and instantly reports due.
    runtime_baseline: float | None = attr.ib(default=0)
    area_id: str | None = attr.ib(default=None)
    description: str | None = attr.ib(default=None)
    group_id: str | None = attr.ib(default=None)
    notifications_enabled: bool = attr.ib(default=False)
    notification_target: str | None = attr.ib(default=None)
    notification_time: str = attr.ib(default="09:00")
    notification_url: str | None = attr.ib(default=None)
    notify_when: str = attr.ib(default="due_and_overdue")
    notify_days_before_due: int | None = attr.ib(default=None)
    snooze_until: str | None = attr.ib(default=None)
    last_notification_kind: str | None = attr.ib(default=None)
    last_notification_date: str | None = attr.ib(default=None)
    # Completion history, newest last: {"performed": "YYYY-MM-DD",
    # "recorded_at": ISO datetime, "note": str | None}. Integration-managed —
    # never client-writable, capped at MAX_HISTORY_ENTRIES.
    history: list[dict] = attr.ib(factory=list)


def task_event_data(task: Task, entity_id: str | None) -> dict:
    """
    Build the base payload shared by the completed and due bus events.

    One builder keeps the two events' documented common fields in lockstep.
    """
    return {
        "task_id": task.id,
        "entity_id": entity_id,
        "title": task.title,
        "trigger_type": task.trigger_type,
        "group_id": task.group_id,
    }


def new_task_from_fields(fields: dict[str, Any]) -> Task | None:
    """
    Build a new task from validated API fields (websocket add / create_task).

    Applies the shared last-performed normalization — including the
    fixed-date default, where an omitted date leaves the anchor pending
    rather than "completed today" — and generates the task id. Returns None
    when a supplied last_performed cannot be parsed; trigger-specific field
    validation happens in TaskStore.add.
    """
    raw_last_performed = fields.get("last_performed")
    if not raw_last_performed and fields.get("trigger_type") == "date":
        raw_last_performed = default_date_task_last_performed(fields.get("anchor_date"))

    last_performed = normalize_last_performed(raw_last_performed)
    if last_performed is None:
        return None

    return Task(
        id=f"tasks_{uuid.uuid4().hex}",
        last_performed=last_performed,
        **{name: fields[name] for name in ADD_TASK_FIELDS if name in fields},
    )


def normalize_group_id(group_id: str | None) -> str | None:
    """Normalize a group name to its canonical stored value."""
    if group_id is None:
        return None
    normalized = group_id.strip()
    return normalized or None


class _TaskStorage(storage.Store):
    """
    Store that accepts data written by any other schema version.

    async_load handles the stored shapes itself (a bare task list before
    1.3, a tasks/groups dict since) and ignores unknown task fields, so no
    transformation is needed here — but without this hook HA's Store raises
    NotImplementedError when the stored major version differs (e.g. after
    a downgrade from a future release).
    """

    async def _async_migrate_func(
        self,
        old_major_version: int,
        old_minor_version: int,
        old_data: dict | list,
    ) -> dict | list:
        return old_data


class TaskStore:
    """
    Holds task data — the single source of truth.

    Entities and the panel are decoupled from the store: every mutation fires
    dispatcher signals (SIGNAL_TASK_ADDED / _UPDATED / _REMOVED plus the
    catch-all SIGNAL_TASKS_CHANGED) that interested parties subscribe to.
    """

    def __init__(
        self,
        hass: HomeAssistant,
        max_history_entries: int = const.MAX_HISTORY_ENTRIES,
    ) -> None:
        """Initialize the storage. max_history_entries of 0 means unlimited."""
        self.hass = hass
        self._max_history_entries = max_history_entries
        self._store = _TaskStorage(
            hass,
            STORAGE_VERSION_MAJOR,
            STORAGE_KEY,
            minor_version=STORAGE_VERSION_MINOR,
        )
        self._tasks: dict[str, Task] = {}
        self._groups: set[str] = set()

    async def async_load(self) -> None:
        """Load tasks (and groups, since 1.3) from storage."""
        data = await self._store.async_load()
        if data is None:
            data = await self._async_import_legacy_storage()
            if data is None:
                return

        # Storage < 1.3 was a bare task list; 1.3 wraps it with the group list.
        if isinstance(data, list):
            task_items = data
            group_items: list[str] = []
        else:
            task_items = data.get("tasks", [])
            group_items = data.get("groups", [])

        # Fields added after a task was stored fall back to the attrs
        # defaults; unknown stored fields (e.g. written by a newer version)
        # are dropped instead of aborting setup with a TypeError. A record
        # that is not a dict or lacks an id is skipped (not fatal) so one
        # corrupt entry can't take the whole integration down at setup.
        known_fields = {field.name for field in attr.fields(Task)}
        self._tasks = {}
        for task_data in task_items:
            if not isinstance(task_data, dict) or not task_data.get("id"):
                _LOGGER.warning("Skipping malformed stored task record: %s", task_data)
                continue
            try:
                task = Task(**{k: v for k, v in task_data.items() if k in known_fields})
            except (TypeError, ValueError):
                _LOGGER.warning(
                    "Skipping unloadable stored task %s", task_data.get("id")
                )
                continue
            # A malformed stored history must not break completions later or
            # crash the panel's history rendering: keep only well-formed
            # entries (a dict with a string performed date).
            if isinstance(task.history, list):
                task.history = [
                    entry
                    for entry in task.history
                    if isinstance(entry, dict)
                    and isinstance(entry.get("performed"), str)
                ]
            else:
                task.history = []
            # Same defense for the seasonal month list: keep only in-range
            # month numbers so corrupt storage can't break due computation.
            if isinstance(task.active_months, list):
                task.active_months = sorted(
                    {
                        month
                        for month in task.active_months
                        # bool is an int subclass; True must not become month 1.
                        if type(month) is int and 1 <= month <= 12
                    }
                )
            else:
                task.active_months = []
            self._tasks[task.id] = task
        # Groups in use by tasks always exist, even if the stored list lags.
        self._groups = {
            group
            for group in (
                normalize_group_id(g)
                for g in (*group_items, *(t.group_id for t in self._tasks.values()))
            )
            if group is not None
        }

    async def _async_import_legacy_storage(self) -> Any:
        """Adopt the pre-rename storage file, migrated and saved under the new key."""
        legacy = _TaskStorage(
            self.hass,
            STORAGE_VERSION_MAJOR,
            LEGACY_STORAGE_KEY,
            minor_version=STORAGE_VERSION_MINOR,
        )
        data = await legacy.async_load()
        if data is None:
            return None
        await self._store.async_save(data)
        _LOGGER.info("Imported tasks from the former home_maintenance storage")
        return data

    @property
    def tasks(self) -> dict[str, Task]:
        """Return the task objects keyed by id, without copying."""
        return self._tasks

    def serialize(self, task: Task, history_limit: int | None = None) -> dict:
        """
        Return the task as a dict extended with computed trigger state.

        The computed fields (`due`, `next_due`, `progress_current`,
        `progress_target`) let API consumers render trigger state without
        reimplementing the trigger semantics. history_limit truncates the
        completion history to the most recent N entries.
        """
        # Copy history only up to the requested limit — asdict would deep-copy
        # the full record (unbounded when max_history_entries is 0) just for
        # the truncation below to throw most of it away on every list fetch.
        data = attr.asdict(
            task, filter=lambda attribute, _value: attribute.name != "history"
        )
        recent = task.history[-history_limit:] if history_limit else task.history
        data["history"] = [dict(entry) for entry in recent]
        trigger = get_trigger(task.trigger_type)
        next_due = trigger.next_due(self.hass, task)
        progress = trigger.progress(self.hass, task)
        # Hand the due date back to is_due: for dated triggers it is exactly
        # what is_due would recompute, and get_all() runs this per task.
        data["due"] = trigger.is_due(self.hass, task, next_due)
        data["next_due"] = next_due.isoformat() if next_due else None
        data["progress_current"] = progress[0] if progress else None
        data["progress_target"] = progress[1] if progress else None
        return data

    def get_all(self) -> list[dict]:
        """
        Get all tasks, serialized with computed trigger state.

        The list payload is refetched by every open panel on every change, so
        history is truncated here (the cards show only recent entries); the
        single-task get() keeps the full history for the edit dialog.
        """
        return [
            self.serialize(t, history_limit=const.LIST_HISTORY_ENTRIES)
            for t in self._tasks.values()
        ]

    def get(self, task_id: str) -> dict | None:
        """Get a single serialized task, or None."""
        task = self._tasks.get(task_id)
        return self.serialize(task) if task else None

    def _get_tag_uuids(self) -> dict[str, str]:
        """Return a mapping of all task's tag friendly IDs into tag UUIDs."""
        er = entity_registry.async_get(self.hass)

        # Get each task's tag_id, if configured
        tag_ids = [t.tag_id for t in self._tasks.values() if t.tag_id]

        tag_uuids = {}
        for tag_id in tag_ids:
            # If two tasks have the same tag_id, only get the first
            if tag_id in tag_uuids:
                continue

            # Get the tag_id -> tag_uuid mapping from entity_registry
            entry = er.async_get(tag_id)
            if entry:
                tag_uuids[tag_id] = entry.unique_id

        return tag_uuids

    def get_task_ids_by_tag_uuid(self, tag_uuid: str) -> list[str]:
        """
        Get the ids of the tasks bound to a tag UUID.

        Returns ids rather than serialized tasks: the tag-scan path only
        needs them to complete the tasks, and attr.asdict would deep-copy
        each matching task's whole completion history on every scan.
        """
        tag_uuids = self._get_tag_uuids()

        return [
            task.id
            for task in self._tasks.values()
            if task.tag_id and tag_uuids.get(task.tag_id) == tag_uuid
        ]

    def _entity_id_for(self, task_id: str) -> str | None:
        """Resolve a task's entity_id from the entity registry."""
        registry = entity_registry.async_get(self.hass)
        return registry.async_get_entity_id("binary_sensor", const.DOMAIN, task_id)

    def get_groups(self) -> list[str]:
        """Get all group names, sorted."""
        return sorted(self._groups)

    def create_group(self, group_id: str) -> None:
        """Create a group if it does not already exist."""
        normalized = normalize_group_id(group_id)
        if not normalized:
            msg = "Group name is required."
            raise RuntimeError(msg)

        if normalized in self._groups:
            return
        self._groups.add(normalized)
        self._save()
        async_dispatcher_send(self.hass, const.SIGNAL_TASKS_CHANGED)

    def rename_group(self, old_group_id: str, new_group_id: str) -> None:
        """Rename a group and reassign all member tasks."""
        old_normalized = normalize_group_id(old_group_id)
        new_normalized = normalize_group_id(new_group_id)

        if not old_normalized or not new_normalized:
            msg = "Both old and new group names are required."
            raise RuntimeError(msg)

        if old_normalized == new_normalized:
            return

        if new_normalized in self._groups:
            msg = f'A group named "{new_normalized}" already exists.'
            raise RuntimeError(msg)

        self._groups.discard(old_normalized)
        self._groups.add(new_normalized)
        self._reassign_group_members(old_normalized, new_normalized)

    def delete_group(self, group_id: str) -> None:
        """Delete a group and move member tasks to ungrouped."""
        normalized = normalize_group_id(group_id)
        if not normalized:
            msg = "Group name is required."
            raise RuntimeError(msg)

        self._groups.discard(normalized)
        self._reassign_group_members(normalized, None)

    def _reassign_group_members(self, from_group: str, to_group: str | None) -> None:
        """Move every task in from_group to to_group, then save and announce."""
        for task in self._tasks.values():
            if normalize_group_id(task.group_id) == from_group:
                task.group_id = to_group

        self._save()
        # A group change is invisible to the entities (group_id is not part of
        # entity state), so a single catch-all is enough — no per-task signals.
        async_dispatcher_send(self.hass, const.SIGNAL_TASKS_CHANGED)

    def _register_task_group(self, task: Task) -> None:
        """Normalize a task's group and make sure it exists in the group list."""
        task.group_id = normalize_group_id(task.group_id)
        if task.group_id:
            self._groups.add(task.group_id)

    @staticmethod
    def _normalize_trigger_fields(task: Task) -> None:
        """
        Drop trigger fields that do not apply to the task's trigger type.

        Seasonal months only affect the time trigger; leaving them on another
        type (possible via the service/websocket APIs, which accept any field
        combination) would half-apply — the inherited is_due month gate
        without the due-date adjustment — so the task silently never fires
        out of season while its attributes claim otherwise.
        """
        if task.trigger_type != "time":
            task.active_months = []

    def add(self, task: Task, labels: list[str] | None = None) -> str:
        """Add a new task and announce it."""
        error = get_trigger(task.trigger_type).validate(attr.asdict(task))
        if error is not None:
            raise RuntimeError(error)

        get_trigger(task.trigger_type).initialize(self.hass, task)
        self._normalize_trigger_fields(task)
        self._register_task_group(task)
        self._tasks[task.id] = task
        self._save()
        async_dispatcher_send(
            self.hass, const.SIGNAL_TASK_ADDED, task, list(labels or [])
        )
        async_dispatcher_send(self.hass, const.SIGNAL_TASKS_CHANGED)
        return task.id

    def delete(self, task_id: str) -> None:
        """Remove a task and announce the removal."""
        if task_id not in self._tasks:
            msg = f"No task found with ID {task_id}."
            raise RuntimeError(msg)

        del self._tasks[task_id]
        self._save()
        async_dispatcher_send(self.hass, const.SIGNAL_TASK_REMOVED, task_id)
        async_dispatcher_send(self.hass, const.SIGNAL_TASKS_CHANGED)

    def update_task(self, task_id: str, updated: dict) -> None:
        """Update an existing task with new values from a dictionary."""
        task = self._tasks.get(task_id)
        if task is None:
            msg = "Task not found."
            raise RuntimeError(msg)

        # Validate the post-update trigger fields before mutating anything, so
        # a task can never be switched into a state where it silently never
        # becomes due (e.g. count trigger without an entity).
        merged = attr.asdict(task)
        merged.update(
            (key, value)
            for key, value in updated.items()
            if key in ALLOWED_UPDATE_FIELDS
        )
        error = get_trigger(merged["trigger_type"]).validate(merged)
        if error is not None:
            raise RuntimeError(error)

        previous_trigger = task.trigger_type
        previous_watched = get_trigger(previous_trigger).watched_entity(task)

        for key, value in updated.items():
            if key not in ALLOWED_UPDATE_FIELDS:
                continue
            if key in ("tag_id", "area_id"):
                value = value or None
            setattr(task, key, value)

        self._normalize_trigger_fields(task)
        self._register_task_group(task)

        # Re-initialize trigger-managed state (counter reset, runtime baseline
        # capture) when the trigger type OR the watched entity changes —
        # otherwise a counter/baseline captured from the old entity carries
        # over and the task reads as due immediately.
        new_trigger = get_trigger(task.trigger_type)
        if (
            task.trigger_type != previous_trigger
            or new_trigger.watched_entity(task) != previous_watched
        ):
            new_trigger.initialize(self.hass, task)

        entity_id = self._entity_id_for(task_id)
        if entity_id:
            registry = entity_registry.async_get(self.hass)
            if "area_id" in updated:
                registry.async_update_entity(entity_id, area_id=task.area_id)
            if "labels" in updated:
                registry.async_update_entity(entity_id, labels=set(updated["labels"]))

        self._save()
        self._notify_updated(task_id)

    def _apply_completion(
        self, task_id: str, performed_date: datetime | None, note: str | None = None
    ) -> Task:
        """Mutate one task's completion state without saving or announcing."""
        task = self._tasks.get(task_id)
        if task is None:
            msg = "Task not found."
            raise RuntimeError(msg)

        performed = dt_util.start_of_local_day(
            dt_util.as_local(performed_date) if performed_date is not None else None
        )
        task.last_performed = performed.isoformat()
        get_trigger(task.trigger_type).on_complete(self.hass, task)
        # recorded_at keeps the actual completion moment distinguishable from
        # a back-dated performed date.
        task.history.append(
            {
                "performed": performed.date().isoformat(),
                "recorded_at": dt_util.now().isoformat(),
                "note": note or None,
            }
        )
        if self._max_history_entries > 0:
            del task.history[: -self._max_history_entries]
        return task

    def _fire_completed_event(self, task: Task) -> None:
        """Announce a completion on the event bus for automations."""
        entry = task.history[-1] if task.history else {}
        self.hass.bus.async_fire(
            const.EVENT_TASK_COMPLETED,
            {
                **task_event_data(task, self._entity_id_for(task.id)),
                "performed": entry.get("performed"),
                "note": entry.get("note"),
            },
        )

    def update_last_performed(
        self,
        task_id: str,
        performed_date: datetime | None = None,
        note: str | None = None,
    ) -> None:
        """Mark a task complete: update last_performed, apply trigger effects."""
        task = self._apply_completion(task_id, performed_date, note)
        self._save()
        self._fire_completed_event(task)
        self._notify_updated(task_id)

    def complete_tasks(self, task_ids: list[str]) -> None:
        """
        Mark several tasks complete with a single save and change signal.

        Used for a tag scan shared by multiple tasks, so one scan doesn't
        fan out into k saves, k notification passes, and k panel refetches.
        Unknown ids are skipped.
        """
        completed = [
            self._apply_completion(task_id, None)
            for task_id in task_ids
            if task_id in self._tasks
        ]
        if not completed:
            return

        self._save()
        for task in completed:
            self._fire_completed_event(task)
            async_dispatcher_send(self.hass, const.signal_task_updated(task.id))
        async_dispatcher_send(self.hass, const.SIGNAL_TASKS_CHANGED)

    def mark_overdue(self, task_id: str) -> None:
        """Force a task into the due state (for testing automations)."""
        task = self._tasks.get(task_id)
        if task is None:
            msg = "Task not found."
            raise RuntimeError(msg)

        get_trigger(task.trigger_type).force_overdue(self.hass, task)
        self._save()
        self._notify_updated(task_id)

    def increment_count(self, task_id: str) -> None:
        """Increment the count for a count-based task."""
        task = self._tasks.get(task_id)
        if task is None:
            msg = "Task not found."
            raise RuntimeError(msg)

        if task.trigger_type != "count":
            return

        task.current_count += 1
        self._save()
        self._notify_updated(task_id)

    def reset_count(self, task_id: str) -> None:
        """Reset the count for a count-based task without completing it."""
        task = self._tasks.get(task_id)
        if task is None:
            msg = "Task not found."
            raise RuntimeError(msg)

        task.current_count = 0
        self._save()
        self._notify_updated(task_id)

    def update_notification_state(self, task_id: str, **updates: str | None) -> None:
        """
        Update the notification manager's bookkeeping fields on a task.

        Deliberately does not fire dispatcher signals: snooze/last-sent state
        is not entity or panel state, and announcing it would re-trigger the
        notification manager that just wrote it.
        """
        task = self._tasks.get(task_id)
        if task is None:
            return

        for key, value in updates.items():
            if key in NOTIFICATION_STATE_FIELDS:
                setattr(task, key, value)
        self._save()

    def update_runtime_baseline(self, task_id: str, new_baseline: float) -> None:
        """Update the runtime baseline for a runtime-based task."""
        task = self._tasks.get(task_id)
        if task is None:
            return

        task.runtime_baseline = new_baseline
        self._save()
        self._notify_updated(task_id)

    def _notify_updated(self, task_id: str) -> None:
        async_dispatcher_send(self.hass, const.signal_task_updated(task_id))
        async_dispatcher_send(self.hass, const.SIGNAL_TASKS_CHANGED)

    def _storage_payload(self) -> dict:
        """Build the persisted representation of the current state."""
        return {
            "tasks": [attr.asdict(task) for task in self._tasks.values()],
            "groups": sorted(self._groups),
        }

    def _save(self) -> None:
        """Persist tasks in the background, coalescing rapid successive writes."""
        self._store.async_delay_save(self._storage_payload, SAVE_DELAY)

    async def async_flush(self) -> None:
        """
        Write any pending delayed save immediately.

        Called on entry unload so a mutation made within the delayed-save
        window (e.g. right before an options-save reload) is persisted before
        a fresh store instance reloads from disk — otherwise the pending write
        would land on the old instance after the new one already read stale
        data, and be lost on its next save.
        """
        await self._store.async_save(self._storage_payload())
