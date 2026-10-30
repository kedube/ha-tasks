"""Tests for the Tasks integration."""

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from custom_components.tasks.const import DOMAIN


def entity_id_for(hass: HomeAssistant, unique_id: str) -> str:
    """
    Return the entity id of a Tasks binary sensor, looked up by unique id.

    New entity ids depend on the Home Assistant version: since 2026.11 they
    are prefixed with the device name (binary_sensor.tasks_<title>), so tests
    look them up instead of spelling them out.
    """
    entity_id = er.async_get(hass).async_get_entity_id(
        "binary_sensor", DOMAIN, unique_id
    )
    assert entity_id is not None, f"no binary_sensor with unique id {unique_id}"
    return entity_id
