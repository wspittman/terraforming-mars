# Knip cleanup plan

## Goal

Run Knip, validate each reported item against runtime and tooling entry points, remove genuinely unused code and dependencies, and leave the repository passing its required checks.

## Phases

1. **Inventory** — complete
   - Run Knip and record its findings.
   - Inspect configuration and possible false positives.
2. **Cleanup** — complete
   - Remove only confirmed-unused items.
   - Re-run Knip to verify the cleanup.
3. **Verification** — complete
   - Run `npm run lint:fix`, `npm run test`, and `npm run build`.
   - Review the diff, commit it, and create a pull request.

## Key questions

- Which findings are true dead code versus convention-driven or dynamically loaded entry points?
- Does Knip need repository-specific configuration to model the build and test setup correctly?

## Errors encountered

| Error | Attempt | Resolution |
| --- | --- | --- |
| `npm run test` could not load `build/styles.css` | 1 | Run the required full build before retrying the tests. |

