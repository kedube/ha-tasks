"""
Per-task notifications for Tasks.

Each task can opt into notifications through a notify service of its choice.
The manager re-evaluates every minute (to honor each task's send time) and on
every task change, sends at most one notification per task, kind, and day,
and handles the actionable buttons (complete / snooze) coming back from the
Home Assistant mobile apps.
"""

from __future__ import annotations

import asyncio
import logging
from datetime import timedelta
from typing import TYPE_CHECKING, Any

from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.event import async_track_time_change
from homeassistant.util import dt as dt_util

from . import const
from .datetime_utils import parse_local_datetime
from .triggers import get_trigger

if TYPE_CHECKING:
    from datetime import datetime

    from homeassistant.core import CALLBACK_TYPE

    from .store import Task, TaskStore

_LOGGER = logging.getLogger(__name__)

MOBILE_APP_ACTION_EVENT = "mobile_app_notification_action"


def parse_notification_time(value: str | None) -> tuple[int, int]:
    """Parse an HH:MM[:SS] time selector value, defaulting to 09:00."""
    if value:
        parts = value.split(":")
        if len(parts) >= 2:  # noqa: PLR2004
            try:
                return (int(parts[0]), int(parts[1]))
            except ValueError:
                pass
    return (9, 0)


def resolve_notify_service(value: str | None) -> tuple[str, str]:
    """Resolve "notify.mobile_app_x" / "mobile_app_x" into (domain, service)."""
    if not value:
        return ("notify", "notify")
    if "." in value:
        domain, service = value.split(".", 1)
        return (domain, service)
    return ("notify", value)


class NotificationManager:
    """Send per-task notifications and handle mobile notification actions."""

    def __init__(self, hass: HomeAssistant, store: TaskStore) -> None:
        """Initialize the notification manager."""
        self.hass = hass
        self._store = store
        # Serializes processing passes so an in-flight (awaiting) send can't
        # overlap with a second pass and double-send the same task/kind/day.
        self._lock = asyncio.Lock()
        # Tasks whose last send failed, with the day it failed on, so a broken
        # notify target is retried at most once per day instead of every tick.
        self._send_failed_on: dict[str, str] = {}

    @callback
    def async_setup(self) -> list[CALLBACK_TYPE]:
        """Subscribe to task changes, the minute tick, and mobile actions."""
        unsubs = [
            async_dispatcher_connect(
                self.hass, const.SIGNAL_TASKS_CHANGED, self._schedule_processing
            ),
            async_track_time_change(
                self.hass, self._schedule_processing, minute="*", second=0
            ),
            self.hass.bus.async_listen(
                MOBILE_APP_ACTION_EVENT, self._handle_mobile_action
            ),
            self.hass.bus.async_listen(
                const.EVENT_TASK_COMPLETED, self._handle_task_completed
            ),
        ]
        self._schedule_processing()
        return unsubs

    @callback
    def _schedule_processing(self, *_args: Any) -> None:
        """Queue a processing pass, unless any task even wants notifications."""
        # Skip the whole O(n) pass (and its per-task datetime parsing) when no
        # task has notifications enabled — the common case for most installs.
        if not any(t.notifications_enabled for t in self._store.tasks.values()):
            return
        self.hass.async_create_task(self.async_process_notifications())

    async def async_process_notifications(self) -> None:
        """Send any notifications that are currently due (one pass at a time)."""
        # The lock makes overlapping passes run sequentially, so the second
        # pass sees the last_notification_date the first one just committed.
        async with self._lock:
            for task_id in list(self._store.tasks):
                await self.async_send_notification(task_id)

    async def async_send_notification(
        self, task_id: str, *, force: bool = False
    ) -> bool:
        """
        Send a task's notification if one is currently warranted.

        With force=True (the send_task_notification service) the enabled,
        snooze, send-time, and once-per-day checks are skipped.
        """
        task = self._store.tasks.get(task_id)
        if task is None:
            return False

        kind, days_until_due = self._notification_kind(task)
        now = dt_util.now()
        today = now.date().isoformat()

        if force:
            kind = kind or "manual"
        elif not self._should_send_now(task, kind, now, today):
            return False
        elif self._send_failed_on.get(task_id) == today:
            # A send already failed today (e.g. the notify target is gone) —
            # don't retry every minute and spam the log; try again tomorrow.
            return False

        domain, service = resolve_notify_service(task.notification_target)
        try:
            await self.hass.services.async_call(
                domain,
                service,
                {
                    "title": task.title,
                    "message": self._build_message(task, kind, days_until_due),
                    "data": self._build_payload(task),
                },
                blocking=True,
            )
        except HomeAssistantError as err:
            # One concise warning per failure day, not a per-minute traceback.
            if self._send_failed_on.get(task_id) != today:
                _LOGGER.warning(
                    "Failed to send notification for task %s via %s.%s: %s",
                    task_id,
                    domain,
                    service,
                    err,
                )
            if not force:
                self._send_failed_on[task_id] = today
            return False

        self._send_failed_on.pop(task_id, None)
        self._store.update_notification_state(
            task_id,
            last_notification_kind=kind,
            last_notification_date=today,
        )
        return True

    def _should_send_now(
        self, task: Task, kind: str | None, now: datetime, today: str
    ) -> bool:
        """Apply the enabled, snooze, send-time, and once-per-day gates."""
        if not task.notifications_enabled or kind is None:
            return False
        if self._is_snoozed(task):
            return False
        if (now.hour, now.minute) < parse_notification_time(task.notification_time):
            return False
        return not (
            task.last_notification_date == today and task.last_notification_kind == kind
        )

    @callback
    def snooze_task(self, task_id: str, days: int) -> None:
        """Silence a task's notifications for the given number of days."""
        snooze_until = (dt_util.start_of_local_day() + timedelta(days=days)).isoformat()
        self._store.update_notification_state(
            task_id,
            snooze_until=snooze_until,
            last_notification_kind=None,
            last_notification_date=None,
        )

    async def _handle_task_completed(self, event: Event) -> None:
        """
        Dismiss a task's outstanding mobile notification when it is completed.

        Companion-app notify targets support clearing by tag with a
        clear_notification message; other notify services would deliver it as
        literal text, so dismissal is limited to mobile_app targets. The
        recorded notification state is cleared either way, so a task that
        becomes due again later re-notifies.
        """
        task = self._store.tasks.get(event.data.get("task_id"))
        if task is None or not task.notifications_enabled:
            return
        if task.last_notification_date is None:
            return

        self._store.update_notification_state(
            task.id,
            last_notification_kind=None,
            last_notification_date=None,
        )

        domain, service = resolve_notify_service(task.notification_target)
        if domain != "notify" or not service.startswith("mobile_app"):
            return
        try:
            await self.hass.services.async_call(
                domain,
                service,
                {
                    "message": "clear_notification",
                    "data": {"tag": f"{const.DOMAIN}_{task.id}"},
                },
                blocking=True,
            )
        except HomeAssistantError as err:
            _LOGGER.debug(
                "Could not dismiss notification for task %s via %s.%s: %s",
                task.id,
                domain,
                service,
                err,
            )

    async def _handle_mobile_action(self, event: Event) -> None:
        """Handle complete/snooze actions from mobile app notifications."""
        action = event.data.get("action")
        if not isinstance(action, str):
            return

        complete_prefix = f"{const.NOTIFICATION_ACTION_COMPLETE}::"
        snooze_prefix = f"{const.NOTIFICATION_ACTION_SNOOZE}::"

        if action.startswith(complete_prefix):
            task_id = action.removeprefix(complete_prefix)
            if task_id in self._store.tasks:
                self._store.update_last_performed(task_id)
        elif action.startswith(snooze_prefix):
            task_id = action.removeprefix(snooze_prefix)
            if task_id in self._store.tasks:
                self.snooze_task(task_id, const.DEFAULT_SNOOZE_DAYS)

    def _notification_kind(self, task: Task) -> tuple[str | None, int | None]:
        """
        Return (kind, days_until_due) for the notification a task warrants.

        Time-based tasks distinguish due_soon / due / overdue by calendar
        date; count- and runtime-based tasks have no date, so being due maps
        to "due" (repeated daily until completed, like an overdue reminder).
        """
        trigger = get_trigger(task.trigger_type)
        next_due = trigger.next_due(self.hass, task)

        if next_due is None:
            # Dateless (count/runtime) tasks have no due-day vs overdue-day
            # distinction: being over threshold satisfies any notify_when,
            # including "overdue" (otherwise that option would never fire).
            if trigger.is_due(self.hass, task):
                return ("due", None)
            return (None, None)

        days_until_due = (next_due.date() - dt_util.now().date()).days
        if (
            task.notify_days_before_due is not None
            and days_until_due == task.notify_days_before_due
            and days_until_due > 0
        ):
            return ("due_soon", days_until_due)
        if days_until_due == 0 and task.notify_when in ("due", "due_and_overdue"):
            return ("due", days_until_due)
        if days_until_due < 0 and task.notify_when in ("overdue", "due_and_overdue"):
            return ("overdue", days_until_due)
        return (None, days_until_due)

    def _is_snoozed(self, task: Task) -> bool:
        """Whether the task's snooze window covers today."""
        snooze_until = parse_local_datetime(task.snooze_until)
        if snooze_until is None:
            return False
        return dt_util.start_of_local_day() < snooze_until

    @staticmethod
    def _build_message(task: Task, kind: str | None, days_until_due: int | None) -> str:
        """Build the notification body for a task and notification kind."""
        if kind == "due_soon":
            return f"{task.title} is due in {days_until_due} day(s)."
        if kind == "overdue":
            return f"{task.title} is overdue."
        if kind == "manual":
            return f"{task.title} notification sent."
        return f"{task.title} is due."

    @staticmethod
    def _build_payload(task: Task) -> dict[str, Any]:
        """Build the mobile notification action payload."""
        actions: list[dict[str, str]] = [
            {
                "action": f"{const.NOTIFICATION_ACTION_COMPLETE}::{task.id}",
                "title": "Mark complete",
            },
            {
                "action": f"{const.NOTIFICATION_ACTION_SNOOZE}::{task.id}",
                "title": "Snooze",
            },
        ]
        if task.notification_url:
            actions.append(
                {"action": "URI", "title": "Open", "uri": task.notification_url}
            )

        return {
            # One tag per task so a newer notification replaces the older one.
            "tag": f"{const.DOMAIN}_{task.id}",
            "actions": actions,
            "url": task.notification_url,
        }
