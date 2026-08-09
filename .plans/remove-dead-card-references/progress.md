# Progress

## Session Log

- Created the plan and captured baseline TypeScript failures.
- Removed dead server hooks and expansion-specific resource/payment paths.
- Reduced awards to the five default Tharsis awards.
- Removed expansion-only client mappings and selectors exposed by Vue type checking.
- Restored six legitimate Base `CardName` values.
- Removed obsolete tests and updated retained fixtures.

## Verification

- `npm run build` — passed after final cleanup (webpack emitted only its existing bundle-size warnings).
- `npm run build:test` — passed after final source/test cleanup.
- `npm run lint` — passed.
- `npm run test:server` — 1,476 passing.
- `npm run test:client` — 287 passing.
- `git diff --check` — passed after correcting one trailing blank line.
