"""Sensors for DMR Hotspot."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorEntityDescription,
)
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
        name="Status",
        translation_key="status",
        value_fn=lambda data: "Connected" if data.connected else "Disconnected",
    ),
    DmrHotspotSensorDescription(
        key="entry_count",
        name="Entry count",
        translation_key="entry_count",
        value_fn=lambda data: data.entry_count,
    ),
    DmrHotspotSensorDescription(
        key="callsign",
        name="Callsign",
        translation_key="callsign",
        value_fn=lambda data: data.callsign,
    ),
    DmrHotspotSensorDescription(
        key="name",
        name="Name",
        translation_key="name",
        value_fn=lambda data: data.name,
    ),
    DmrHotspotSensorDescription(
        key="country",
        name="Country",
        translation_key="country",
        value_fn=lambda data: data.country,
    ),
    DmrHotspotSensorDescription(
        key="mode",
        name="Mode",
        translation_key="mode",
        value_fn=lambda data: data.mode,
    ),
    DmrHotspotSensorDescription(
        key="network",
        name="Network",
        translation_key="network",
        value_fn=lambda data: data.network,
    ),
    DmrHotspotSensorDescription(
        key="talkgroup",
        name="Talkgroup",
        translation_key="talkgroup",
        value_fn=lambda data: data.talkgroup,
    ),
    DmrHotspotSensorDescription(
        key="source",
        name="Source",
        translation_key="source",
        value_fn=lambda data: data.source,
    ),
    DmrHotspotSensorDescription(
        key="last_heard",
        name="Last heard",
        translation_key="last_heard",
        value_fn=lambda data: data.last_heard,
    ),
    DmrHotspotSensorDescription(
        key="timestamp",
        name="Timestamp",
        translation_key="timestamp",
        value_fn=lambda data: data.timestamp,
    ),
    DmrHotspotSensorDescription(
        key="duration",
        name="Duration",
        translation_key="duration",
        value_fn=lambda data: data.duration,
    ),
    DmrHotspotSensorDescription(
        key="loss",
        name="Loss",
        translation_key="loss",
        value_fn=lambda data: data.loss,
    ),
    DmrHotspotSensorDescription(
        key="ber",
        name="BER",
        translation_key="ber",
        value_fn=lambda data: data.ber,
    ),
    DmrHotspotSensorDescription(
        key="temperature",
        name="Temperature",
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


class DmrHotspotSensor(CoordinatorEntity[DmrHotspotData], SensorEntity):
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
        self._attr_has_entity_name = True
        self._attr_device_info = {
            "identifiers": {(DOMAIN, entry.entry_id)},
            "name": "DMR Hotspot",
            "manufacturer": "MMDVM",
        }

    @property
    def native_value(self) -> Any:
        """Return the sensor value."""
        if self.coordinator.data is None:
            return None

        return self.entity_description.value_fn(self.coordinator.data)
