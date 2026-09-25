"""Config flow for Tasks integration."""

from typing import Any

from homeassistant.config_entries import (
    CONN_CLASS_LOCAL_POLL,
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.core import callback

from .const import (
    CONFIG_STEP_USER_DATA_SCHEMA,
    DOMAIN,
    NAME,
    get_options_schema,
)


class TasksConfigFlow(ConfigFlow, domain=DOMAIN):
    """Config flow for Home Maintenenance."""

    # HA's contract is an int; async_migrate_entry keys off this.
    VERSION = 1
    CONNECTION_CLASS = CONN_CLASS_LOCAL_POLL

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle a flow initialized by the user."""
        # Single-instance integration (also declared via single_config_entry
        # in the manifest); no per-entry unique_id is needed.
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        if user_input is None:
            return self.async_show_form(
                step_id="user", data_schema=CONFIG_STEP_USER_DATA_SCHEMA
            )

        return self.async_create_entry(
            title=NAME,
            data=user_input,
            options=user_input,
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:  # noqa: ARG004
        """Handle callback for options flow."""
        return TasksOptionsFlowHandler()


class TasksOptionsFlowHandler(OptionsFlow):
    """
    Options flow for Home Maintenenance.

    config_entry is provided by the OptionsFlow base class; assigning it
    manually has been an error since HA made it a read-only property.
    """

    async def async_step_init(
        self, user_input: dict[str, Any] | None
    ) -> ConfigFlowResult:
        """Handle a flow initialized by the user."""
        if user_input is not None:
            result = self.async_create_entry(title="", data=user_input)
            self.hass.async_create_task(
                self.hass.config_entries.async_reload(self.config_entry.entry_id)
            )
            return result

        return self.async_show_form(
            step_id="init",
            data_schema=get_options_schema(self.config_entry),
        )
