# Release Notes - v0.0.4

Fourth public release of DMR Hotspot for Home Assistant.

## Highlights

- Changes the default WPSD API polling interval from 30 seconds to 5 seconds.
- Adds Home Assistant integration options for changing the scan interval.
- Polishes the modern DMR/R7-style card BER/loss layout.
- Adds mappings for real WPSD last-heard API output.
- Adds source and loss sensors.
- Maps `target` to talkgroup and `time_utc` to timestamp.
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
