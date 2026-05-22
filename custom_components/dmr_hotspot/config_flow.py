"""Config flow for DMR Hotspot."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.const import CONF_URL
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .api import DmrHotspotClient, DmrHotspotClientError
from .const import CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL, DOMAIN


class DmrHotspotConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for DMR Hotspot."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.FlowResult:
        """Handle the initial step."""
        errors: dict[str, str] = {}

        if user_input is not None:
            url = user_input[CONF_URL].rstrip("/")
            await self.async_set_unique_id(url)
            self._abort_if_unique_id_configured()

            client = DmrHotspotClient(async_get_clientsession(self.hass), url)

            try:
                await client.async_test_connection()
            except DmrHotspotClientError:
                errors["base"] = "cannot_connect"
            else:
                return self.async_create_entry(
                    title="DMR Hotspot",
                    data={CONF_URL: url},
                    options={
                        CONF_SCAN_INTERVAL: user_input.get(
                            CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL
                        )
                    },
                )

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_URL): str,
                    vol.Optional(
                        CONF_SCAN_INTERVAL, default=DEFAULT_SCAN_INTERVAL
                    ): vol.All(vol.Coerce(int), vol.Range(min=5, max=3600)),
                }
            ),
            errors=errors,
        )
