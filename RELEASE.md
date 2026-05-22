# Release Notes - v0.0.1

Initial public release of DMR Hotspot for Home Assistant.

## Highlights

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
