# Changelog

## 0.0.7 - 2026-05-23

- Added local Home Assistant brand assets under
  `custom_components/dmr_hotspot/brand`.
- Added HACS repository brand assets under `brand`.
- Added fallback MDI icons for DMR hotspot sensors.
- Lowered the scan interval minimum from 5 seconds to 2 seconds.
- Expanded temperature parsing to support common Raspberry Pi/WPSD CPU
  temperature keys and values with units.
- Bumped the integration manifest version to `0.0.7`.

## 0.0.6 - 2026-05-23

- Changed the Home Assistant device manufacturer from `MMDVM` to
  `DMR Hotspot` so the device page no longer requests a missing MMDVM logo.
- Added PNG brand assets under `brands/dmr_hotspot`.
- Bumped the integration manifest version to `0.0.6`.

## 0.0.5 - 2026-05-23

- Updated the README to recommend the standalone
  `WPSD-Status-Card-Mod` HACS dashboard card.
- Added the current R7 dashboard-card YAML example to the integration README.
- Added an experimental standalone `custom:wpsd-radio-card` Lovelace card.
- Added `style: mcs2000` and `style: r7` options to the JS card.
- Added example YAML files for the JS-based MCS2000 and R7 card styles.
- Moved the MCS2000 LCD invert action to the right-hand `Menu` button.

## 0.0.4 - 2026-05-23

- Changed the default polling interval from 30 seconds to 5 seconds.
- Added an integration options flow so the polling interval can be changed from
  Home Assistant without re-adding the integration.
- Added brand-style icon assets and fallback icon metadata for HACS/Home
  Assistant presentation.
- Split BER and loss into a two-column metric row on the modern DMR radio
  example.

## 0.0.3 - 2026-05-22

- Added mappings for real WPSD API keys including `target`, `src`, `time_utc`,
  and `loss`.
- Added source and loss sensors.
- Updated dashboard examples to use the source sensor.
- Added explicit fallback names for all sensors.
- Redesigned the MCS2000-style dashboard example as a full radio front panel.
- Improved the MCS2000-style dashboard example so it scales within narrow
  dashboard columns instead of clipping.
- Added inverted LCD styling hooks for the MCS2000-style card.
- Removed the rear chassis from the MCS2000-style dashboard example so only the
  control head is shown.
- Hid the default button-card icon and made the MCS2000-style example more
  reliable in narrow dashboard layouts.
- Forced the MCS2000-style dashboard example to render its custom field in
  button-card layouts.
- Increased the MCS2000-style dashboard example size so it renders as a readable
  control head rather than a tiny thumbnail.
- Added explicit icon dimensions and section grid sizing options to the
  dashboard card examples.
- Updated the MCS2000-style dashboard badge text to `MCS2000`.
- Improved responsive scaling and narrow-card text spacing for the dashboard
  card examples.
- Reworked the MCS2000-style dashboard example to use native responsive columns
  instead of transform scaling, reducing horizontal clipping.
- Redesigned the modern DMR radio example to more closely match the original
  handheld-style screen concept.
- Increased the modern DMR radio example size for better readability.
- Rethemed the modern DMR radio example toward a Motorola R7-style handheld
  screen layout.
- Tuned the modern DMR radio example against a real R7 reference photo.
- Simplified the modern DMR radio example to the screen-only R7 layout, with
  zone, channel, and caller lines plus an RF activity strip.
- Updated the modern DMR radio example activity strip colours: red for RF/TX,
  yellow for Net/RX, and blue for standby.
- Tuned the modern DMR radio example font sizing, screen height, and activity
  strip alignment.
- Widened the modern DMR radio example while keeping the same height.
- Split BER and loss into a two-column metric row on the modern DMR radio
  example.
- Updated the modern DMR radio example channel label to show the active
  talkgroup.

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
