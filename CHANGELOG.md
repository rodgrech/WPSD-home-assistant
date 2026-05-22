# Changelog

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
