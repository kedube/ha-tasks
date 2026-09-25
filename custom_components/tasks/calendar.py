"""
Calendar of upcoming Tasks due dates.

A single calendar entity exposes all-day events for every dated (time- and
fixed-date-based) task: the real next due date plus projected recurrences up
to a one-year horizon. Projections assume each task is completed on its due
date — completing early or late shifts a time-based task's future dates, so
projections are refreshed on every task change. Count- and runtime-based
tasks have no date and are excluded, matching the panel's Next Due column.
"""

from __future__ import annotations

from datetime import timedelta
from typing import TYPE_CHECKING

from homeassistant.components.calendar import CalendarEntity, CalendarEvent
from homeassistant.core import callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.util import dt as dt_util

from . import const
from .triggers import get_trigger

if TYPE_CHECKING:
    from datetime import datetime

    from homeassistant.config_entries import ConfigEntry
    from homeassistant.core import HomeAssistant
    from homeassistant.helpers.device_registry import DeviceInfo
    from homeassistant.helpers.entity_platform import AddEntitiesCallback

    from .store import TaskStore


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the Tasks calendar platform."""
    async_add_entities([TasksCalendar(hass, entry.runtime_data.store)])


def _event_identity(event: CalendarEvent | None) -> tuple | None:
    """Return a comparable identity of the current event, for change checks."""
    if event is None:
        return None
    return (event.uid, event.start, event.summary)


class TasksCalendar(CalendarEntity):
    """All-day due-date events for every time-based task."""

    _attr_should_poll = False
    _attr_icon = "mdi:calendar-check"

    def __init__(self, hass: HomeAssistant, store: TaskStore) -> None:
        """Initialize the calendar entity."""
        self.hass = hass
        self._store = store
        self._attr_unique_id = f"{const.DOMAIN}_calendar"
        self._attr_name = const.NAME
        self._cached_events: list[CalendarEvent] | None = None
        # The local day the cache was built on: projections depend on "today"
        # (rolling horizon, past-repetition skipping), so a cache from
        # yesterday is stale even when no task changed.
        self._cache_day: object = None
        self._fingerprint: tuple | None = None

    @property
    def device_info(self) -> DeviceInfo:
        """Return device information for this calendar."""
        return const.device_info()

    def _events(self) -> list[CalendarEvent]:
        """
        Return all-day events per dated task, soonest first.

        Each dated task contributes its next due date plus projected
        recurrences within the projection horizon.

        Cached until a task change or a new local day invalidates it, so
        repeated reads (the state property plus every calendar-card query)
        don't re-project every task each time.
        """
        today = dt_util.now().date()
        if self._cached_events is not None and self._cache_day == today:
            return self._cached_events
        self._cache_day = today

        horizon = dt_util.start_of_local_day() + timedelta(
            days=const.CALENDAR_PROJECTION_DAYS
        )
        events = []
        for task in self._store.tasks.values():
            occurrences = get_trigger(task.trigger_type).upcoming(
                self.hass, task, horizon, const.CALENDAR_MAX_OCCURRENCES
            )
            for index, occurrence in enumerate(occurrences):
                due_date = dt_util.as_local(occurrence).date()
                events.append(
                    CalendarEvent(
                        start=due_date,
                        end=due_date + timedelta(days=1),
                        summary=task.title,
                        description=task.description or None,
                        # The real next due date keeps the task id as its uid
                        # (stable for existing automations); projections get a
                        # per-date uid so every event stays unique.
                        uid=task.id if index == 0 else f"{task.id}-{due_date}",
                    )
                )
        events.sort(key=lambda event: event.start)
        self._cached_events = events
        return events

    @property
    def event(self) -> CalendarEvent | None:
        """Return the active or next upcoming event."""
        today = dt_util.now().date()
        return next(
            (
                event
                for event in self._events()
                if event.end_datetime_local.date() > today
            ),
            None,
        )

    async def async_get_events(
        self,
        hass: HomeAssistant,
        start_date: datetime,
        end_date: datetime,
    ) -> list[CalendarEvent]:
        """Return events overlapping the requested window."""
        return [
            event
            for event in self._events()
            if event.start_datetime_local < end_date
            and event.end_datetime_local > start_date
        ]

    def _task_fingerprint(self) -> tuple:
        """
        Summarize (cheaply) everything the events depend on.

        One next_due per task — the signal fires on count increments and
        runtime ticks too, and rebuilding the full multi-occurrence
        projection for those would be pure waste.
        """
        return tuple(
            sorted(
                (task.id, due.isoformat(), task.title, task.description or "")
                for task in self._store.tasks.values()
                if (due := get_trigger(task.trigger_type).next_due(self.hass, task))
                is not None
            )
        )

    @callback
    def _handle_tasks_changed(self) -> None:
        # Skip entirely when nothing calendar-visible changed — count
        # increments, runtime ticks, and group renames fire this signal but
        # don't affect the calendar.
        fingerprint = self._task_fingerprint()
        if fingerprint == self._fingerprint:
            return
        self._fingerprint = fingerprint

        # Rebuild, and only rewrite state if the visible next event changed.
        previous = self.event
        self._cached_events = None
        if _event_identity(self.event) != _event_identity(previous):
            self.async_write_ha_state()

    async def async_added_to_hass(self) -> None:
        """Subscribe to task changes."""
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass, const.SIGNAL_TASKS_CHANGED, self._handle_tasks_changed
            )
        )
