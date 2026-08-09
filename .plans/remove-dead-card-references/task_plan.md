# Remove Dead Card References

## Goal

Restore builds and tests after expansion and fan-made cards were removed, while retaining only Base game and Corporate Era behavior and simplifying dead compatibility code where safe.

## Phases

1. **Baseline and inventory** — complete
   - Captured server/test build failures and classified retained versus removed card names.
2. **Production cleanup** — complete
   - Removed expansion/fan card hooks, alternate-board awards, payment resources, client render mappings, and special-case rules.
   - Restored the six Base card names accidentally removed from `CardName`.
3. **Test cleanup** — complete
   - Removed tests for deleted cards/awards and updated retained tests to use Base/Corporate Era fixtures.
4. **Verification and delivery** — complete
   - Builds, lint, and server/client suites pass individually.
   - Final review and full build passed; delivery metadata is ready.

## Key Decisions

- Delete expansion-only behavior instead of restoring deleted enum members as placeholders.
- Preserve the six numbered Base cards (Industrial Center, Water Splitting Plant, Wave Power, Windmills, Worms, and Zeppelins) and restore their enum names.
- Retain only the five Tharsis awards and the one relevant Tharsis milestone/award synergy.
- Preserve serialized tile labels for removed tile types as strings rather than retaining dead `CardName` references.

## Errors Encountered

| Error | Attempt | Resolution |
| --- | --- | --- |
| Server/test TypeScript builds reported stale removed `CardName` members | 1 | Removed dead branches and restored only six legitimate Base names. |
| Server build could not find generated `genfiles/settings.json` | 1 | Ran the full build, whose static generation step creates the file. |
| First lint run found server formatting issues | 1 | Ran `npm run lint:fix` and corrected remaining client dead references. |
| First server test run had five stale expectations | 1 | Restored Base cards and reduced Tharsis synergy fixtures. |
| Second server test run had one obsolete limited-synergy expectation | 2 | Updated the expectation for the reduced Tharsis-only candidate set. |
| First client test run had two duplicated award fixtures | 1 | Replaced them with distinct retained Tharsis awards. |
