"""Data update coordinator for DMR Hotspot."""

from __future__ import annotations

from datetime import timedelta
import logging

from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .api import DmrHotspotClient, DmrHotspotClientError, DmrHotspotData
from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)


class DmrHotspotDataUpdateCoordinator(DataUpdateCoordinator[DmrHotspotData]):
    """Coordinate updates for DMR Hotspot."""

    def __init__(
        self, hass: HomeAssistant, client: DmrHotspotClient, scan_interval: int
    ) -> None:
        """Initialize the coordinator."""
        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            update_interval=timedelta(seconds=scan_interval),
        )
        self.client = client

    async def _async_update_data(self) -> DmrHotspotData:
        """Fetch data from the hotspot."""
        try:
            return await self.client.async_get_data()
        except DmrHotspotClientError as err:
            raise UpdateFailed("Unable to update DMR hotspot data") from err
