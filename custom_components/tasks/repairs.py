"""
Repair issues for broken task references.

A count/runtime task whose watched entity is gone, or a task whose notify
service no longer exists, silently stops doing its job — the trigger never
advances, or the notification never arrives. These checks surface both as
Repairs issues (Settings → System → Repairs) and clear them automatically
once the reference is valid again.
"""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Any

from homeassistant.const import (
    EVENT_HOMEASSISTANT_STARTED,
    EVENT_SERVICE_REGISTERED,
    EVENT_SERVICE_REMOVED,
)
from homeassistant.core import Event, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import issue_registry as ir
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.event import async_track_state_change_event

from . import const
from .notifications import resolve_notify_service
from .triggers import get_trigger

if TYPE_CHECKING:
    from homeassistant.core import CALLBACK_TYPE, HomeAssistant

    from .store import TaskStore

_LOGGER = logging.getLogger(__name__)

# Issue id prefixes; the suffix is the task id. Also used to recognize (and
# clean up) issues persisted from previous runs.
ISSUE_MISSING_ENTITY = "missing_watched_entity"
ISSUE_MISSING_NOTIFY = "missing_notify_service"
_PREFIXES = (f"{ISSUE_MISSING_ENTITY}_", f"{ISSUE_MISSING_NOTIFY}_")


class RepairsManager:
    """Keep Repairs issues in sync with the tasks' external references."""

    def __init__(self, hass: HomeAssistant, store: TaskStore) -> None:
        """Initialize the repairs manager."""
        self.hass = hass
        self._store = store
        # Caches for the bus event filters, refreshed on every check pass —
        # cheap membership tests that keep unrelated bus events out of the
        # listeners entirely.
        self._notify_domains: set[str] = set()
        self._watched_entities: set[str] = set()
        # The last synced (issues, missing-entity) state; a check pass whose
        # result matches is a no-op, so hot signals like count increments
        # don't rescan the issue registry.
        self._synced: tuple[dict, frozenset[str]] | None = None
        # All watched entities get a state listener: a removed state means a
        # deleted entity (the registry event alone can fire before the state
        # is torn down), and a first state on a flagged-missing entity means
        # it came back — both re-check without waiting for a task change.
        self._missing_entities: frozenset[str] = frozenset()
        self._watch_set: frozenset[str] | None = None
        self._unsub_watch: CALLBACK_TYPE | None = None

    @callback
    def async_setup(self) -> list[CALLBACK_TYPE]:
        """Subscribe the re-check triggers and run the first check."""
        self._refresh_filter_caches()
        unsubs = [
            async_dispatcher_connect(
                self.hass, const.SIGNAL_TASKS_CHANGED, self._async_check
            ),
            self.hass.bus.async_listen(
                EVENT_SERVICE_REGISTERED,
                self._async_check,
                event_filter=self._service_event_filter,
            ),
            self.hass.bus.async_listen(
                EVENT_SERVICE_REMOVED,
                self._async_check,
                event_filter=self._service_event_filter,
            ),
            # Deleting a watched entity fires no task or service event; the
            # registry event is the only signal that it is gone for good.
            self.hass.bus.async_listen(
                er.EVENT_ENTITY_REGISTRY_UPDATED,
                self._async_check,
                event_filter=self._registry_event_filter,
            ),
            self._async_unwatch,
        ]
        if self.hass.is_running:
            self._async_check()
        else:
            # Other integrations (and their entities/services) are still
            # setting up — checking now would flag them all as missing.
            unsubs.append(
                self.hass.bus.async_listen_once(
                    EVENT_HOMEASSISTANT_STARTED, self._async_check
                )
            )
        return unsubs

    @callback
    def _refresh_filter_caches(self) -> None:
        """Recompute the entity/domain sets the bus event filters test."""
        self._watched_entities = {
            entity_id
            for task in self._store.tasks.values()
            if (entity_id := get_trigger(task.trigger_type).watched_entity(task))
        }
        self._notify_domains = {
            resolve_notify_service(task.notification_target)[0]
            for task in self._store.tasks.values()
            if task.notifications_enabled
        }

    @callback
    def _service_event_filter(self, event_data: dict[str, Any]) -> bool:
        """Only react to (de)registrations in a domain some task notifies via."""
        return event_data.get("domain") in self._notify_domains

    @callback
    def _registry_event_filter(self, event_data: dict[str, Any]) -> bool:
        """Only react to registry changes touching a watched entity."""
        return (
            event_data.get("entity_id") in self._watched_entities
            or event_data.get("old_entity_id") in self._watched_entities
        )

    @callback
    def _async_unwatch(self) -> None:
        if self._unsub_watch is not None:
            self._unsub_watch()
            self._unsub_watch = None

    @callback
    def _handle_watched_entity_event(self, event: Event) -> None:
        """Re-check on a watched entity's deletion or a missing one's return."""
        if (
            event.data.get("new_state") is None
            or event.data["entity_id"] in self._missing_entities
        ):
            self._async_check()

    @callback
    def _async_check(self, *_args: object) -> None:
        """Compute the issues the current tasks warrant and sync the registry."""
        if not self.hass.is_running:
            return

        self._refresh_filter_caches()
        registry = er.async_get(self.hass)
        expected: dict[str, tuple[str, dict[str, str]]] = {}
        missing_entities: set[str] = set()

        for task in self._store.tasks.values():
            entity_id = get_trigger(task.trigger_type).watched_entity(task)
            if (
                entity_id
                and self.hass.states.get(entity_id) is None
                and registry.async_get(entity_id) is None
            ):
                expected[f"{ISSUE_MISSING_ENTITY}_{task.id}"] = (
                    ISSUE_MISSING_ENTITY,
                    {"title": task.title, "entity_id": entity_id},
                )
                missing_entities.add(entity_id)

            if task.notifications_enabled:
                domain, service = resolve_notify_service(task.notification_target)
                if not self.hass.services.has_service(domain, service):
                    expected[f"{ISSUE_MISSING_NOTIFY}_{task.id}"] = (
                        ISSUE_MISSING_NOTIFY,
                        {"title": task.title, "service": f"{domain}.{service}"},
                    )

        # Keep the watched-entity state listener in step with the watched set
        # (independent of the issue sync below — the set can change while the
        # issue picture stays the same, e.g. swapping to a healthy entity).
        self._missing_entities = frozenset(missing_entities)
        watch_set = frozenset(self._watched_entities)
        if watch_set != self._watch_set:
            self._watch_set = watch_set
            self._async_unwatch()
            if watch_set:
                self._unsub_watch = async_track_state_change_event(
                    self.hass, sorted(watch_set), self._handle_watched_entity_event
                )

        # Unchanged since the last sync: skip the registry scan and writes.
        state = (expected, self._missing_entities)
        if self._synced == state:
            return
        self._synced = state

        issue_registry = ir.async_get(self.hass)
        for domain, issue_id in list(issue_registry.issues):
            if (
                domain == const.DOMAIN
                and issue_id.startswith(_PREFIXES)
                and issue_id not in expected
            ):
                ir.async_delete_issue(self.hass, const.DOMAIN, issue_id)

        for issue_id, (translation_key, placeholders) in expected.items():
            ir.async_create_issue(
                self.hass,
                const.DOMAIN,
                issue_id,
                is_fixable=False,
                severity=ir.IssueSeverity.WARNING,
                translation_key=translation_key,
                translation_placeholders=placeholders,
            )
