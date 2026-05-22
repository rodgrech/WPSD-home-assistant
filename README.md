# DMR Hotspot for Home Assistant

![DMR Hotspot logo](assets/hacs-icon.png)

A custom Home Assistant integration for monitoring a DMR hotspot such as WPSD,
Pi-Star, or an MMDVMHost-based gateway.

Version: `0.0.4`

## Features

- UI-based setup from Home Assistant
- Periodic polling through Home Assistant's data update coordinator
- Device and diagnostic sensors for hotspot status
- Designed for the WPSD last-heard API
- Example MCS2000-style Lovelace card layout
- Example modern DMR radio LCD Lovelace card layout
- HACS-ready repository layout

Supported WPSD last-heard fields include `time_utc`, `mode`, `callsign`,
`name`, `country`, `target`, `src`, `duration`, and `loss`.

## Screenshot

![DMR Hotspot device page](assets/screenshots/device-page.png)

## Branding

Branding assets are included in:

```text
assets/
brands/dmr_hotspot/icon.svg
custom_components/dmr_hotspot/icon.png
custom_components/dmr_hotspot/logo.png
```

These are ready for GitHub/HACS presentation and future Home Assistant Brands
submission work. Home Assistant may still require a formal Brands repository
submission before the integration logo appears consistently in all HA UI areas.

## Installation

### HACS custom repository

1. Open HACS in Home Assistant.
2. Add this repository as a custom repository.
3. Select `Integration` as the repository category.
4. Install **DMR Hotspot**.
5. Restart Home Assistant.

### Manual installation

Copy `custom_components/dmr_hotspot` into your Home Assistant
`custom_components` directory, then restart Home Assistant.

## Configuration

1. Go to **Settings** -> **Devices & services**.
2. Select **Add integration**.
3. Search for **DMR Hotspot**.
4. Enter the local hotspot URL, for example:

```text
http://wpsd.local
http://pi-star.local
http://192.168.1.50
```

The integration reads the WPSD API from:

```text
http://<hotspot-hostname-or-ip>/api/?limit=10&names=true&country=true
```

No changes are required on the hotspot Linux installation.

The default polling interval is `5` seconds. You can change this from the
integration options in Home Assistant.

## Current Status

This integration currently provides the release-ready Home Assistant structure
and a WPSD API polling client. The parser is intentionally tolerant while we
confirm the exact JSON shape returned by your hotspot.

## Release

Latest tagged release: `v0.0.4`

The GitHub repository is:

```text
https://github.com/rodgrech/WPSD-home-assistant
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the full release history.

Recent changes:

- `0.0.4`: faster default polling, configurable scan interval options, and
  modern card BER/loss layout polish.
- `0.0.3`: mapped real WPSD API fields, added source/loss sensors, and added
  explicit fallback names for all sensors.
- `0.0.2`: added branding assets, fixed sensor values showing as unknown, and
  added entry count troubleshooting.
- `0.0.1`: initial Home Assistant custom integration and dashboard examples.

## Dashboard Card

Dashboard examples are included at:

```text
examples/mcs2000-card.yaml
examples/modern-dmr-radio-card.yaml
```

The MCS2000 example keeps the green LCD area at a fixed size, uses Home
Assistant MDI icons, keeps the WPSD/Home Assistant branding compact, and avoids
the changing background size issue from the earlier mockups.

The modern DMR radio example uses a compact colour LCD style similar to current
handheld/mobile DMR radios, with status icons, channel/talkgroup focus, and a
more polished contemporary display.

## Development

The integration lives in:

```text
custom_components/dmr_hotspot
```

## License

MIT
