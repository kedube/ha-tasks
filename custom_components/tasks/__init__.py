"""Support for Tasks platform."""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import TYPE_CHECKING

import voluptuous as vol
from homeassistant.components.binary_sensor import DOMAIN as BINARY_SENSOR_PLATFORM
from homeassistant.components.calendar import DOMAIN as CALENDAR_PLATFORM
from homeassistant.components.tag.const import EVENT_TAG_SCANNED
from homeassistant.components.todo import DOMAIN as TODO_PLATFORM
from homeassistant.core import (
    Event,
    HomeAssistant,
    ServiceCall,
    ServiceResponse,
    SupportsResponse,
    callback,
)
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.dispatcher import (
    async_dispatcher_connect,
    async_dispatcher_send,
)
from homeassistant.helpers.event import async_track_state_change_event
from homeassistant.util import dt as dt_util

from . import const
from .config_flow import TasksConfigFlow
from .datetime_utils import MAX_YEAR, MIN_YEAR, year_in_range
from .notifications import NotificationManager
from .panel import (
    async_register_panel,
    async_unregister_panel,
)
from .permissions import async_require_admin, async_require_entity_control
from .repairs import RepairsManager
from .store import TaskStore, new_task_from_fields
from .task_fields import (
    ADD_TASK_FIELDS,
    LABELS_VALIDATOR,
    TASK_FIELD_VALIDATORS,
)
from .triggers import get_trigger, parse_numeric_state
from .websocket import async_register_websockets

if TYPE_CHECKING:
    from datetime import datetime

    from homeassistant.config_entries import ConfigEntry
    from homeassistant.core import CALLBACK_TYPE
    from homeassistant.helpers.typing import ConfigType

    from .store import Task

_LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = const.CONFIG_SCHEMA

PLATFORMS = [BINARY_SENSOR_PLATFORM, CALENDAR_PLATFORM, TODO_PLATFORM]

# create_task mirrors the websocket add_task schema, generated from the same
# shared field map so the two APIs cannot drift apart.
CREATE_TASK_SCHEMA = vol.Schema(
    {
        vol.Required("title"): TASK_FIELD_VALIDATORS["title"],
        vol.Required("interval_value"): TASK_FIELD_VALIDATORS["interval_value"],
        vol.Optional("interval_type", default="days"): TASK_FIELD_VALIDATORS[
            "interval_type"
        ],
        vol.Optional("last_performed"): vol.Any(str, None),
        vol.Optional("labels"): LABELS_VALIDATOR,
        **{
            vol.Optional(field_name): TASK_FIELD_VALIDATORS[field_name]
            for field_name in ADD_TASK_FIELDS
            if field_name not in ("title", "interval_value", "interval_type")
        },
    }
)


@dataclass
class TasksData:
    """Runtime data for the Tasks config entry."""

    store: TaskStore
    notifications: NotificationManager | None = None
    unsub_watchers: list[CALLBACK_TYPE] = field(default_factory=list)
    watcher_signature: frozenset[tuple[str, str, str]] = frozenset()


type TasksConfigEntry = ConfigEntry[TasksData]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Track states and offer events for sensors."""
    # HA runs this before it sets up (and so migrates) the stored entries.
    for entry in hass.config_entries.async_entries(const.DOMAIN):
        _async_normalize_entry_version(hass, entry)
    return True


@callback
def _async_normalize_entry_version(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """
    Store the current int VERSION on an entry that carries a string one.

    Entries created before the config-flow VERSION became an int carry a
    string version ("1.1.0"). Since 2026.11, HA's migrate step compares the
    stored version with > before dispatching to async_migrate_entry, which
    raises TypeError on a string and leaves the entry unloaded — so this has
    to happen in async_setup, before HA reaches the migrate step.
    """
    if not isinstance(entry.version, int):
        hass.config_entries.async_update_entry(entry, version=TasksConfigFlow.VERSION)


async def async_setup_entry(hass: HomeAssistant, entry: TasksConfigEntry) -> bool:
    """Set up the Tasks config entry."""
    # Initialize and load stored tasks. The history cap option takes effect
    # on the next completion (an options save reloads the entry, so a fresh
    # store picks it up immediately).
    task_store = TaskStore(
        hass,
        max_history_entries=entry.options.get(
            const.OPTION_MAX_HISTORY, const.MAX_HISTORY_ENTRIES
        ),
    )
    await task_store.async_load()

    # Register Device (shared identity, defined once in const.device_info)
    device_registry = dr.async_get(hass)
    device_registry.async_get_or_create(
        config_entry_id=entry.entry_id,
        **const.device_info(),
    )

    data = TasksData(store=task_store)
    entry.runtime_data = data
    # Websocket handlers and the panel are not entry-scoped; give them a
    # typed handle to the same runtime data.
    hass.data[const.DOMAIN] = data

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    # Register the panel (frontend)
    await async_register_panel(hass, entry)

    # Websocket support
    async_register_websockets(hass)

    # Register custom services
    register_services(hass)

    # Per-task notifications
    data.notifications = NotificationManager(hass, task_store, entry)
    for unsub in data.notifications.async_setup():
        entry.async_on_unload(unsub)

    # Repairs issues for broken watched-entity / notify-service references
    for unsub in RepairsManager(hass, task_store).async_setup():
        entry.async_on_unload(unsub)

    @callback
    def handle_tag_scanned_event(event: Event) -> None:
        """Handle when a tag is scanned."""
        tag_id = event.data.get("tag_id")  # Actually tag UUID
        # Guard against events without a tag_id: the lookup would match
        # every task whose tag entity is missing from the registry (its
        # lookup yields None == None) and complete them all.
        if not tag_id:
            return

        task_ids = task_store.get_task_ids_by_tag_uuid(tag_id)
        if not task_ids:
            return

        _LOGGER.debug("Tag scanned: %s", tag_id)

        # One physical scan → one save and one change signal, even when the
        # tag is shared by several tasks.
        task_store.complete_tasks(task_ids)

    entry.async_on_unload(
        hass.bus.async_listen(EVENT_TAG_SCANNED, handle_tag_scanned_event)
    )

    # Watch the entities referenced by count- and runtime-based tasks, and
    # re-evaluate the watch list whenever tasks change.
    _async_setup_watchers(hass, data)

    @callback
    def handle_tasks_changed() -> None:
        # Rebuild when the (entity, task, trigger) wiring changes — not only
        # when the set of watched entity ids does. Two tasks can watch the
        # same entity, or a task can be retyped while keeping its entity, and
        # the closure-captured maps would otherwise go stale.
        if _watcher_signature(data.store) != data.watcher_signature:
            _async_setup_watchers(hass, data)

    entry.async_on_unload(
        async_dispatcher_connect(hass, const.SIGNAL_TASKS_CHANGED, handle_tasks_changed)
    )

    @callback
    def unsub_all_watchers() -> None:
        for unsub in data.unsub_watchers:
            unsub()
        data.unsub_watchers.clear()

    entry.async_on_unload(unsub_all_watchers)

    return True


async def async_unload_entry(hass: HomeAssistant, entry: TasksConfigEntry) -> bool:
    """Unload Tasks config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if not unload_ok:
        return False

    # Flush any pending delayed save before a fresh store can reload from disk
    # (e.g. an options-save reload right after a task mutation).
    data: TasksData | None = hass.data.get(const.DOMAIN)
    if data is not None:
        await data.store.async_flush()

    async_unregister_panel(hass)
    for service in (
        const.SERVICE_RESET,
        const.SERVICE_INCREMENT_COUNT,
        const.SERVICE_RESET_COUNT,
        const.SERVICE_SNOOZE_TASK,
        const.SERVICE_SEND_TASK_NOTIFICATION,
        const.SERVICE_CREATE_TASK,
        const.SERVICE_MARK_OVERDUE,
    ):
        hass.services.async_remove(const.DOMAIN, service)
    hass.data.pop(const.DOMAIN, None)
    return True


async def async_remove_entry(
    hass: HomeAssistant,
    entry: TasksConfigEntry,
) -> None:
    """
    Remove Tasks config entry.

    HA always calls async_unload_entry before async_remove_entry, so the
    panel and hass.data were already cleaned up there — re-unregistering the
    panel here would only log a spurious 'Removing unknown panel' warning.
    """


async def async_migrate_entry(
    hass: HomeAssistant,
    entry: TasksConfigEntry,
) -> bool:
    """
    Handle migration of config entry.

    Legacy string versions are normalized in async_setup, before HA gets
    here; this stays as a fallback for entries set up any other way.
    """
    _async_normalize_entry_version(hass, entry)
    return True


def _create_task_from_service_call(hass: HomeAssistant, call: ServiceCall) -> str:
    """Build and store a new task from a create_task service call."""
    data: TasksData = hass.data[const.DOMAIN]
    msg = dict(call.data)

    # Shared with the websocket add: normalizes last_performed and applies
    # the fixed-date anchor-pending default.
    new_task = new_task_from_fields(msg)
    if new_task is None:
        message = f"Could not parse last_performed: {msg['last_performed']}"
        raise ServiceValidationError(message)

    try:
        return data.store.add(new_task, msg.get("labels", []))
    except RuntimeError as err:
        raise ServiceValidationError(str(err)) from err


def _task_id_for_entity(hass: HomeAssistant, entity_id: str) -> str:
    """
    Resolve a task entity_id to its task id, or raise ServiceValidationError.

    Only the per-task binary sensors qualify. The integration's other entities
    (the todo list, calendar, and "any task due" sensor) share its platform
    but are not tasks; they used to resolve to a bogus id and surface a raw
    RuntimeError, and an unknown entity used to make the call silently do
    nothing — a typo in an automation went unnoticed.
    """
    entry = er.async_get(hass).async_get(entity_id)
    data: TasksData = hass.data[const.DOMAIN]
    if (
        entry is None
        or entry.platform != const.DOMAIN
        or entry.unique_id not in data.store.tasks
    ):
        message = f"{entity_id} is not a task from the Tasks integration"
        raise ServiceValidationError(message)
    return entry.unique_id


def _parse_performed_date(value: str | None) -> datetime | None:
    """Parse a service performed_date into local midnight of that date."""
    if value is None:
        return None
    parsed_date = dt_util.parse_date(value)
    if parsed_date is None or not year_in_range(parsed_date):
        message = (
            f"Invalid performed_date {value!r}: expected a YYYY-MM-DD date "
            f"between {MIN_YEAR} and {MAX_YEAR}"
        )
        raise ServiceValidationError(message)
    # Midnight of the given calendar date in the *local* timezone —
    # naive-datetime + as_local would have treated the date as UTC.
    return dt_util.start_of_local_day(parsed_date)


@callback
def register_services(hass: HomeAssistant) -> None:
    """
    Register the Tasks services.

    Authorization (see permissions.py): configuring a task — creating it,
    changing its counter, forcing it overdue — is admin-only, like the
    websocket commands; acting on it (complete, snooze, notify) needs control
    permission on its entity, which read-only users lack.
    """

    def _store() -> TaskStore:
        data: TasksData = hass.data[const.DOMAIN]
        return data.store

    def _notifications() -> NotificationManager | None:
        data: TasksData = hass.data[const.DOMAIN]
        return data.notifications

    async def async_srv_reset(call: ServiceCall) -> None:
        entity_id = call.data["entity_id"]
        await async_require_entity_control(hass, call.context, entity_id)
        performed_date = _parse_performed_date(call.data.get("performed_date"))
        task_id = _task_id_for_entity(hass, entity_id)
        _store().update_last_performed(
            task_id, performed_date, note=call.data.get("note")
        )

    hass.services.async_register(
        const.DOMAIN,
        const.SERVICE_RESET,
        async_srv_reset,
        schema=const.SERVICE_RESET_SCHEMA,
    )

    async def async_srv_increment_count(call: ServiceCall) -> None:
        await async_require_admin(hass, call.context)
        _store().increment_count(_task_id_for_entity(hass, call.data["entity_id"]))

    hass.services.async_register(
        const.DOMAIN,
        const.SERVICE_INCREMENT_COUNT,
        async_srv_increment_count,
        schema=const.SERVICE_INCREMENT_COUNT_SCHEMA,
    )

    async def async_srv_reset_count(call: ServiceCall) -> None:
        await async_require_admin(hass, call.context)
        _store().reset_count(_task_id_for_entity(hass, call.data["entity_id"]))

    hass.services.async_register(
        const.DOMAIN,
        const.SERVICE_RESET_COUNT,
        async_srv_reset_count,
        schema=const.SERVICE_RESET_COUNT_SCHEMA,
    )

    async def async_srv_snooze_task(call: ServiceCall) -> None:
        entity_id = call.data["entity_id"]
        await async_require_entity_control(hass, call.context, entity_id)
        task_id = _task_id_for_entity(hass, entity_id)
        if notifications := _notifications():
            notifications.snooze_task(task_id, call.data["days"])

    hass.services.async_register(
        const.DOMAIN,
        const.SERVICE_SNOOZE_TASK,
        async_srv_snooze_task,
        schema=const.SERVICE_SNOOZE_TASK_SCHEMA,
    )

    async def async_srv_send_task_notification(call: ServiceCall) -> None:
        entity_id = call.data["entity_id"]
        await async_require_entity_control(hass, call.context, entity_id)
        task_id = _task_id_for_entity(hass, entity_id)
        if notifications := _notifications():
            await notifications.async_send_notification(task_id, force=True)

    hass.services.async_register(
        const.DOMAIN,
        const.SERVICE_SEND_TASK_NOTIFICATION,
        async_srv_send_task_notification,
        schema=const.SERVICE_SEND_TASK_NOTIFICATION_SCHEMA,
    )

    async def async_srv_create_task(call: ServiceCall) -> ServiceResponse:
        await async_require_admin(hass, call.context)
        new_id = _create_task_from_service_call(hass, call)
        return {"task_id": new_id} if call.return_response else None

    hass.services.async_register(
        const.DOMAIN,
        const.SERVICE_CREATE_TASK,
        async_srv_create_task,
        schema=CREATE_TASK_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )

    async def async_srv_mark_overdue(call: ServiceCall) -> None:
        await async_require_admin(hass, call.context)
        task_id = _task_id_for_entity(hass, call.data["entity_id"])
        try:
            _store().mark_overdue(task_id)
        except RuntimeError as err:
            raise ServiceValidationError(str(err)) from err

    hass.services.async_register(
        const.DOMAIN,
        const.SERVICE_MARK_OVERDUE,
        async_srv_mark_overdue,
        schema=const.SERVICE_MARK_OVERDUE_SCHEMA,
    )


def _watcher_signature(store: TaskStore) -> frozenset[tuple[str, str, str]]:
    """
    Return the (entity_id, task_id, trigger_type) tuples the watchers cover.

    Comparing this set (not just the entity ids) detects task adds/removes and
    trigger-type swaps that reuse an already-watched entity, both of which
    must trigger a watcher rebuild.
    """
    return frozenset(
        (entity_id, task.id, task.trigger_type)
        for task in store.tasks.values()
        if (entity_id := get_trigger(task.trigger_type).watched_entity(task))
    )


def _runtime_change_is_meaningful(
    task: Task, old_value: float | None, new_value: float
) -> bool:
    """
    Whether a runtime sensor tick warrants a refresh push.

    Runtime sensors can update every few seconds; pushing every tick rewrites
    the entity state and reloads every open panel each time. Only a due-state
    flip or a whole-unit progress change is worth announcing.
    """
    baseline = task.runtime_baseline
    if baseline is None or old_value is None or old_value < baseline:
        return True
    old_delta = old_value - baseline
    new_delta = new_value - baseline
    threshold = task.runtime_threshold
    if threshold > 0 and (old_delta >= threshold) != (new_delta >= threshold):
        return True
    return int(old_delta) != int(new_delta)


@callback
def _async_setup_watchers(hass: HomeAssistant, data: TasksData) -> None:
    """
    (Re)subscribe targeted state listeners for count/runtime tasks.

    Uses async_track_state_change_event keyed to the exact entities the tasks
    reference, so unrelated state changes never reach these callbacks.
    """
    for unsub in data.unsub_watchers:
        unsub()
    data.unsub_watchers.clear()

    store = data.store
    data.watcher_signature = _watcher_signature(store)

    count_map: dict[str, list[str]] = {}
    runtime_map: dict[str, list[str]] = {}
    for task in store.tasks.values():
        entity_id = get_trigger(task.trigger_type).watched_entity(task)
        if not entity_id:
            continue
        # State events carry lowercase ids (the tracker lowercases too), so a
        # mixed-case key would never match and the task would never advance.
        entity_id = entity_id.lower()
        if task.trigger_type == "count":
            count_map.setdefault(entity_id, []).append(task.id)
        elif task.trigger_type == "runtime":
            runtime_map.setdefault(entity_id, []).append(task.id)

    if count_map:

        @callback
        def handle_count_event(event: Event) -> None:
            old_state = event.data.get("old_state")
            new_state = event.data.get("new_state")
            if old_state is None or new_state is None:
                return
            # Only count genuine off->on transitions. Excluding old_state 'on'
            # is not enough: unavailable/unknown -> on happens on every
            # reconnect or reload and must not be counted as an activation.
            if new_state.state != "on" or old_state.state != "off":
                return
            for task_id in count_map.get(event.data["entity_id"], []):
                if task_id not in store.tasks:
                    continue
                _LOGGER.debug("Count increment for task %s", task_id)
                store.increment_count(task_id)

        data.unsub_watchers.append(
            async_track_state_change_event(hass, list(count_map), handle_count_event)
        )

    if runtime_map:

        @callback
        def handle_runtime_event(event: Event) -> None:
            new_state = event.data.get("new_state")
            # Finite numbers only: a "nan" reading used to be captured as the
            # baseline, reading the task due and crashing this handler after.
            value = parse_numeric_state(new_state.state) if new_state else None
            if value is None:
                return
            old_state = event.data.get("old_state")
            old_value = parse_numeric_state(old_state.state) if old_state else None
            for task_id in runtime_map.get(event.data["entity_id"], []):
                task = store.tasks.get(task_id)
                if task is None:
                    continue
                if task.runtime_baseline is None:
                    # Baseline was pending (sensor unavailable at create/
                    # complete time) — capture it from this first reading.
                    # update_runtime_baseline fires the change signals itself.
                    _LOGGER.debug("Capturing runtime baseline for task %s", task_id)
                    store.update_runtime_baseline(task_id, value)
                elif _runtime_change_is_meaningful(task, old_value, value):
                    # A dip below the baseline is tolerated transiently by
                    # trigger.delta (treated as baseline 0) without rewriting
                    # stored state, so a momentary glitch can't permanently
                    # convert the sensor's lifetime total into runtime.
                    # Notify the entity (TASK_UPDATED) and any open panel,
                    # whose websocket subscription only listens to
                    # TASKS_CHANGED (coalesced client-side by its debouncer).
                    async_dispatcher_send(hass, const.signal_task_updated(task_id))
                    async_dispatcher_send(hass, const.SIGNAL_TASKS_CHANGED)

        data.unsub_watchers.append(
            async_track_state_change_event(
                hass, list(runtime_map), handle_runtime_event
            )
        )
