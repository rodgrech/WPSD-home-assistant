"""Sensors for DMR Hotspot."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntityDescription
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import UnitOfTemperature
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .api import DmrHotspotData
from .const import DOMAIN
from .coordinator import DmrHotspotDataUpdateCoordinator


@dataclass(frozen=True, kw_only=True)
class DmrHotspotSensorDescription(SensorEntityDescription):
    """Describe a DMR hotspot sensor."""

    value_fn: Callable[[DmrHotspotData], Any]


SENSORS: tuple[DmrHotspotSensorDescription, ...] = (
    DmrHotspotSensorDescription(
        key="status",
        translation_key="status",
        value_fn=lambda data: "Connected" if data.connected else "Disconnected",
    ),
    DmrHotspotSensorDescription(
        key="callsign",
        translation_key="callsign",
        value_fn=lambda data: data.callsign,
    ),
    DmrHotspotSensorDescription(
        key="name",
        translation_key="name",
        value_fn=lambda data: data.name,
    ),
    DmrHotspotSensorDescription(
        key="country",
        translation_key="country",
        value_fn=lambda data: data.country,
    ),
    DmrHotspotSensorDescription(
        key="mode",
        translation_key="mode",
        value_fn=lambda data: data.mode,
    ),
    DmrHotspotSensorDescription(
        key="network",
        translation_key="network",
        value_fn=lambda data: data.network,
    ),
    DmrHotspotSensorDescription(
        key="talkgroup",
        translation_key="talkgroup",
        value_fn=lambda data: data.talkgroup,
    ),
    DmrHotspotSensorDescription(
        key="last_heard",
        translation_key="last_heard",
        value_fn=lambda data: data.last_heard,
    ),
    DmrHotspotSensorDescription(
        key="timestamp",
        translation_key="timestamp",
        value_fn=lambda data: data.timestamp,
    ),
    DmrHotspotSensorDescription(
        key="duration",
        translation_key="duration",
        value_fn=lambda data: data.duration,
    ),
    DmrHotspotSensorDescription(
        key="ber",
        translation_key="ber",
        value_fn=lambda data: data.ber,
    ),
    DmrHotspotSensorDescription(
        key="temperature",
        translation_key="temperature",
        device_class=SensorDeviceClass.TEMPERATURE,
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
        value_fn=lambda data: data.temperature,
    ),
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up DMR hotspot sensors."""
    coordinator: DmrHotspotDataUpdateCoordinator = hass.data[DOMAIN][entry.entry_id]
    async_add_entities(
        DmrHotspotSensor(coordinator, entry, description) for description in SENSORS
    )


class DmrHotspotSensor(CoordinatorEntity[DmrHotspotData]):
    """DMR hotspot sensor."""

    entity_description: DmrHotspotSensorDescription

    def __init__(
        self,
        coordinator: DmrHotspotDataUpdateCoordinator,
        entry: ConfigEntry,
        description: DmrHotspotSensorDescription,
    ) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator)
        self.entity_description = description
        self._attr_unique_id = f"{entry.entry_id}_{description.key}"
        self._attr_device_info = {
            "identifiers": {(DOMAIN, entry.entry_id)},
            "name": "DMR Hotspot",
            "manufacturer": "MMDVM",
        }

    @property
    def native_value(self) -> Any:
        """Return the sensor value."""
        return self.entity_description.value_fn(self.coordinator.data)
