"""Client for local DMR hotspot data."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from aiohttp import ClientError, ClientSession


class DmrHotspotClientError(Exception):
    """Raised when the hotspot cannot be queried."""


@dataclass(slots=True)
class DmrHotspotData:
    """Normalized DMR hotspot data."""

    connected: bool
    entry_count: int = 0
    callsign: str | None = None
    name: str | None = None
    country: str | None = None
    mode: str | None = None
    network: str | None = None
    talkgroup: str | None = None
    last_heard: str | None = None
    timestamp: str | None = None
    duration: str | None = None
    ber: float | None = None
    temperature: float | None = None
    raw: Any | None = None


class DmrHotspotClient:
    """Fetch DMR hotspot information from a local endpoint."""

    def __init__(self, session: ClientSession, base_url: str) -> None:
        """Initialize the client."""
        self._session = session
        self._base_url = base_url.rstrip("/")

    async def async_get_data(self) -> DmrHotspotData:
        """Fetch and normalize hotspot data."""
        raw = await self._async_fetch_status()
        return self._normalize(raw)

    async def async_test_connection(self) -> None:
        """Validate that the hotspot can be reached."""
        await self._async_fetch_status()

    async def _async_fetch_status(self) -> Any:
        """Fetch last-heard JSON from the WPSD API."""
        url = f"{self._base_url}/api/?limit=10&names=true&country=true"

        try:
            async with self._session.get(url, timeout=10) as response:
                response.raise_for_status()
                data = await response.json(content_type=None)
        except (ClientError, TimeoutError, ValueError) as err:
            raise DmrHotspotClientError from err

        if not isinstance(data, dict | list):
            raise DmrHotspotClientError("Unexpected WPSD API response")

        return data

    def _normalize(self, raw: Any) -> DmrHotspotData:
        """Normalize hotspot data into integration fields."""
        entries = _extract_entries(raw)
        latest = entries[0] if entries else {}

        return DmrHotspotData(
            connected=True,
            entry_count=len(entries),
            callsign=_first_str(
                latest,
                "callsign",
                "call",
                "src",
                "src_call",
                "source",
                "source_call",
            ),
            name=_first_str(latest, "name", "user_name", "fullname"),
            country=_first_str(latest, "country", "country_name"),
            mode=_first_str(latest, "mode", "protocol") or "DMR",
            network=_first_str(latest, "network", "master", "destination") or "WPSD",
            talkgroup=_first_str(
                latest,
                "talkgroup",
                "tg",
                "dst",
                "dst_id",
                "target",
                "target_id",
            ),
            last_heard=_format_last_heard(latest),
            timestamp=_first_str(latest, "time", "timestamp", "datetime", "date"),
            duration=_first_str(latest, "duration", "dur"),
            ber=_as_float(_first_value(latest, "ber", "BER")),
            temperature=_as_float(_first_value(latest, "temperature", "temp")),
            raw=raw,
        )


def _extract_entries(raw: Any) -> list[dict[str, Any]]:
    """Extract last-heard entries from common WPSD API response shapes."""
    if isinstance(raw, list):
        return [entry for entry in raw if isinstance(entry, dict)]

    if not isinstance(raw, dict):
        return []

    for key in ("data", "entries", "last_heard", "lastHeard", "heard"):
        value = raw.get(key)
        if isinstance(value, list):
            return [entry for entry in value if isinstance(entry, dict)]

    return [raw]


def _format_last_heard(entry: dict[str, Any]) -> str | None:
    """Build a display-friendly last-heard string."""
    callsign = _first_str(entry, "callsign", "call", "src", "src_call", "source")
    name = _first_str(entry, "name", "user_name", "fullname")
    talkgroup = _first_str(entry, "talkgroup", "tg", "dst", "dst_id", "target")
    timestamp = _first_str(entry, "time", "timestamp", "datetime", "date")

    parts = [part for part in (callsign, name, talkgroup, timestamp) if part]
    return " - ".join(parts) if parts else None


def _first_str(data: dict[str, Any], *keys: str) -> str | None:
    """Return the first non-empty string for the given keys."""
    return _as_str(_first_value(data, *keys))


def _first_value(data: dict[str, Any], *keys: str) -> Any:
    """Return the first present value for the given keys."""
    lower_map = {key.lower(): key for key in data}

    for key in keys:
        if key in data:
            return data[key]

        real_key = lower_map.get(key.lower())
        if real_key is not None:
            return data[real_key]

    return None


def _as_str(value: Any) -> str | None:
    """Return a non-empty string or None."""
    if value is None:
        return None

    text = str(value).strip()
    return text or None


def _as_float(value: Any) -> float | None:
    """Return a float or None."""
    if value is None or value == "":
        return None

    try:
        return float(value)
    except (TypeError, ValueError):
        return None
