"""Fixtures for Tasks tests."""

from collections.abc import AsyncGenerator
from unittest.mock import AsyncMock, patch

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.tasks.const import DOMAIN


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations: None) -> None:
    """Enable loading custom integrations in all tests."""
    return


@pytest.fixture
async def setup_entry(hass) -> AsyncGenerator[MockConfigEntry]:
    """
    Set up the integration with the panel registration stubbed out.

    The sidebar panel needs the http/frontend stack, which is irrelevant to
    backend behavior under test.
    """
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Tasks",
        data={"admin_only": True, "sidebar_title": "Tasks"},
        options={"admin_only": True, "sidebar_title": "Tasks"},
    )
    entry.add_to_hass(hass)
    with (
        patch(
            "custom_components.tasks.async_register_panel",
            new=AsyncMock(),
        ),
        patch("custom_components.tasks.async_unregister_panel"),
    ):
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
        yield entry
