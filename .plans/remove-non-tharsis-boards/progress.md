# Progress

## 2026-08-09

- Created the task plan and began the removal phase.

- Removed every non-Tharsis board class, registration, enum value, random-board option, and deleted-board-only map bonus/type/asset.
- Removed the board picker and alternate-map SVG labels/styles; saved create-game settings can no longer override the fixed Tharsis selection.
- Made the create-game API and saved-game deserialization force Tharsis, including when stale or manually crafted input names another board.
- Reduced board-defined milestones, awards, legends, and relevant tests to Tharsis.
- Updated AGENTS.md to document the fixed-board constraint.
- Server/test TypeScript builds, focused server tests, focused client tests, lint, and the full production build pass.
- Attempted a create-game screenshot, but the environment could not download Playwright Chromium because the browser CDN returned HTTP 403.
