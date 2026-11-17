"""Fixtures for Tasks tests."""

from collections.abc import AsyncGenerator
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.auth.const import GROUP_ID_USER
from pytest_homeassistant_custom_component.common import (
    CLIENT_ID,
    MockConfigEntry,
    MockUser,
)

from custom_components.tasks.const import DOMAIN


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations: None) -> None:
    """Enable loading custom integrations in all tests."""
    return


@pytest.fixture
async def hass_regular_user(hass, local_auth) -> MockUser:
    """
    Return a regular (non-admin) user, as created in the HA user settings.

    pytest-homeassistant only ships admin and read-only users; the default
    "Users" group may control every entity but not administer.
    """
    group = await hass.auth.async_get_group(GROUP_ID_USER)
    return MockUser(groups=[group]).add_to_hass(hass)


@pytest.fixture
async def hass_regular_access_token(hass, hass_regular_user) -> str:
    """Return an access token for the regular (non-admin) user."""
    refresh_token = await hass.auth.async_create_refresh_token(
        hass_regular_user, CLIENT_ID
    )
    return hass.auth.async_create_access_token(refresh_token)


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
