# Release Notes - v0.0.2

Second public release of DMR Hotspot for Home Assistant.

## Highlights

- Fixes sensor values showing as unknown in Home Assistant.
- Adds branding assets for HACS, GitHub, and integration packaging.
- Adds an entry count sensor for WPSD API troubleshooting.
- Local polling support for the WPSD API.
- Home Assistant config flow setup.
- Sensors for hotspot and last-heard values.
- Two dashboard examples:
  - MCS2000-style green LCD
  - Modern DMR radio colour LCD
- HACS custom repository support.

## Notes

This release does not require any Linux changes on the DMR hotspot. Home
Assistant reads the WPSD API over HTTP from the local network.

The WPSD parser is intentionally tolerant while real-world hotspot API response
shapes are confirmed.
