# Changelog

## 0.0.3 - 2026-05-22

- Added mappings for real WPSD API keys including `target`, `src`, `time_utc`,
  and `loss`.
- Added source and loss sensors.
- Updated dashboard examples to use the source sensor.
- Added explicit fallback names for all sensors.

## 0.0.2 - 2026-05-22

- Added branding assets for HACS, GitHub, and integration packaging.
- Fixed sensor entity inheritance for Home Assistant sensor values.
- Added entry count sensor to make WPSD API polling easier to verify.

## 0.0.1 - 2026-05-22

Initial release preparation.

- Added Home Assistant custom integration scaffold.
- Added UI-based config flow.
- Added WPSD API polling via `/api/?limit=10&names=true&country=true`.
- Added sensors for DMR hotspot status and last-heard data.
- Added MCS2000-style Lovelace card example.
- Added modern DMR radio LCD Lovelace card example.
- Added HACS metadata.
