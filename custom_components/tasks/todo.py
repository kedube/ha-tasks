"""
Todo list of every task.

A single todo entity mirrors the task store: due tasks are pending
(needs_action) and everything else shows as completed, so the native todo
card, the companion-app widgets, and voice assistants ("what's on my tasks
list?") all work without the custom panel. Checking an item off
completes the task through the store — the same path as the panel and the
services — and editing an item's summary or description renames the task.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from homeassistant.components.todo import (
    TodoItem,
    TodoItemStatus,
    TodoListEntity,
    TodoListEntityFeature,
)
from homeassistant.core import callback
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.util import dt as dt_util

from . import const
from .triggers import get_trigger

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry
    from homeassistant.core import HomeAssistant
    from homeassistant.helpers.device_registry import DeviceInfo
    from homeassistant.helpers.entity_platform import AddEntitiesCallback

    from .store import Task, TaskStore


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the Tasks todo platform."""
    async_add_entities([TasksTodoList(hass, entry.runtime_data.store)])


class TasksTodoList(TodoListEntity):
    """Every task as a todo item; due tasks are pending."""

    _attr_should_poll = False
    _attr_icon = "mdi:clipboard-check-outline"
    # SET_DUE_DATE_ON_ITEM must be declared even though due dates are
    # computed: the native todo card echoes each item's due_date back on
    # every update (a checkbox tap included), and core rejects the whole
    # update when the field isn't declared as supported. Due edits are
    # accepted and ignored — the schedule, not the item, owns the date.
    _attr_supported_features = (
        TodoListEntityFeature.UPDATE_TODO_ITEM
        | TodoListEntityFeature.SET_DESCRIPTION_ON_ITEM
        | TodoListEntityFeature.SET_DUE_DATE_ON_ITEM
    )

    def __init__(self, hass: HomeAssistant, store: TaskStore) -> None:
        """Initialize the todo list entity."""
        self.hass = hass
        self._store = store
        self._attr_unique_id = f"{const.DOMAIN}_todo"
        self._attr_name = const.NAME

    @property
    def device_info(self) -> DeviceInfo:
        """Return device information for this todo list."""
        return const.device_info()

    def _to_item(self, task: Task) -> TodoItem:
        """Map a task onto a todo item."""
        trigger = get_trigger(task.trigger_type)
        due = trigger.next_due(self.hass, task)
        # Hand the computed due date to is_due rather than letting it repeat
        # the interval/season walk — the seasonal out-of-season gate still
        # applies there, so this stays in agreement with the binary sensor.
        is_due = trigger.is_due(self.hass, task, due)
        return TodoItem(
            summary=task.title,
            uid=task.id,
            status=(
                TodoItemStatus.NEEDS_ACTION if is_due else TodoItemStatus.COMPLETED
            ),
            due=dt_util.as_local(due).date() if due else None,
            description=task.description or None,
        )

    @property
    def todo_items(self) -> list[TodoItem]:
        """Return the tasks as todo items, due first, then by due date."""
        today = dt_util.now().date()

        def sort_key(item: TodoItem) -> tuple:
            return (
                item.status != TodoItemStatus.NEEDS_ACTION,
                item.due is None,
                item.due or today,
                (item.summary or "").casefold(),
            )

        return sorted(
            (self._to_item(task) for task in self._store.tasks.values()),
            key=sort_key,
        )

    async def async_update_todo_item(self, item: TodoItem) -> None:
        """
        Apply a todo item update: check-off completes, text edits rename.

        A changed due date is deliberately ignored — the due date is computed
        from the task's schedule, counter, or sensor, never stored per item.
        """
        task = self._store.tasks.get(item.uid or "")
        if task is None:
            msg = "Unknown task."
            raise ServiceValidationError(msg)

        updates: dict = {}
        if item.summary is not None and item.summary != task.title:
            updates["title"] = item.summary
        if item.description is not None and item.description != (
            task.description or ""
        ):
            updates["description"] = item.description
        # The todo schemas don't bound text lengths; enforce the same cap the
        # websocket API applies so this path can't bloat the storage file.
        for field, value in updates.items():
            if len(value) > const.MAX_STRING_LENGTH:
                msg = f"Task {field} exceeds {const.MAX_STRING_LENGTH} characters."
                raise ServiceValidationError(msg)
        if updates:
            self._store.update_task(task.id, updates)

        currently_due = get_trigger(task.trigger_type).is_due(self.hass, task)
        # The update service passes status as a plain string; compare by
        # value (TodoItemStatus is a str enum), not identity.
        if item.status == TodoItemStatus.COMPLETED and currently_due:
            self._store.update_last_performed(task.id)
        elif item.status == TodoItemStatus.NEEDS_ACTION and not currently_due:
            # There is no sensible "reopen": due state is computed from the
            # schedule, a counter, or a sensor — not from the checkbox.
            msg = (
                "Tasks can't be reopened from the todo list; "
                "adjust the task's last performed date in the panel instead."
            )
            raise ServiceValidationError(msg)

    @callback
    def _handle_tasks_changed(self) -> None:
        self.async_write_ha_state()

    async def async_added_to_hass(self) -> None:
        """Subscribe to task changes."""
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass, const.SIGNAL_TASKS_CHANGED, self._handle_tasks_changed
            )
        )
