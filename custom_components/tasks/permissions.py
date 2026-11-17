"""
Authorization checks shared by the services, websocket API, and todo entity.

Home Assistant only enforces entity permissions for entity services; plain
services and websocket commands see every authenticated user — including
read-only ones — unless the integration checks itself. The policy here:

- Configuring tasks (create, edit, rename, counter changes, mark_overdue)
  is admin-only, matching the @require_admin websocket commands.
- Acting on a task (complete, snooze, send its notification) needs control
  permission on the task's entity, so regular users can check tasks off
  while read-only users cannot.
- Calls without a user (automations, scripts, other integrations) pass:
  an admin configured them.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from homeassistant.auth.permissions.const import POLICY_CONTROL
from homeassistant.exceptions import Unauthorized
from homeassistant.helpers import entity_registry as er

from .const import DOMAIN

if TYPE_CHECKING:
    from homeassistant.auth.models import User
    from homeassistant.core import Context, HomeAssistant


def task_entity_id(hass: HomeAssistant, task_id: str) -> str | None:
    """Return the entity id of a task's binary sensor, if registered."""
    return er.async_get(hass).async_get_entity_id("binary_sensor", DOMAIN, task_id)


def check_entity_control(
    user: User, entity_id: str | None, context: Context | None = None
) -> None:
    """Raise Unauthorized unless the user may control the entity."""
    if user.is_admin:
        return
    if entity_id is None or not user.permissions.check_entity(
        entity_id, POLICY_CONTROL
    ):
        raise Unauthorized(
            context=context, entity_id=entity_id, permission=POLICY_CONTROL
        )


async def _async_context_user(
    hass: HomeAssistant, context: Context | None
) -> User | None:
    """Return the calling user; None for a system call (no user)."""
    if context is None or context.user_id is None:
        return None
    user = await hass.auth.async_get_user(context.user_id)
    if user is None:
        raise Unauthorized(context=context)
    return user


async def async_require_admin(hass: HomeAssistant, context: Context | None) -> None:
    """Reject a call made by a non-admin user."""
    user = await _async_context_user(hass, context)
    if user is not None and not user.is_admin:
        raise Unauthorized(context=context)


async def async_require_entity_control(
    hass: HomeAssistant, context: Context | None, entity_id: str
) -> None:
    """Reject a call by a user without control permission on the entity."""
    user = await _async_context_user(hass, context)
    if user is not None:
        check_entity_control(user, entity_id, context)
