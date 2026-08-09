# Remove expansion-only enum values

## Goal

Remove expansion- and fan-made-only values from the listed common enums/types, then remove or simplify dependent code while preserving Base + Corporate Era behavior.

## Phases

1. **Audit** (complete): Inventory enum values and all references; classify retained versus removable behavior.
2. **Implementation** (complete): Remove obsolete values and dependent branches/data, keeping types exhaustive and simple.
3. **Verification** (complete): Run focused searches, builds, lint/tests; fix regressions and review scope.
4. **Delivery** (complete): Update plan records, commit changes, and create a pull request.

## Key questions

- Which values are used by Base or Corporate Era cards and core game flow?
- Are apparently unused values part of retained standard projects/actions or serialization?
- Which dependent files can be deleted rather than merely adjusted?

## Errors Encountered

| Error | Attempt | Resolution |
| --- | --- | --- |
| `npm run build:server` could not find `genfiles/settings.json` | 1 | Generate required static files before the next build attempt. |
| First CardRenderItem component rewrite script had a Python syntax error | 1 | Corrected the malformed statement and reran the rewrite successfully. |
| `npm run test:server` could not find `build/styles.css` | 1 | Run the static asset build before retrying the server suite. |
| Playwright could not download Chromium for a screenshot (HTTP 403 from the browser CDN) | 1 | Recorded the environment limitation; builds and component tests verify the affected UI instead. |
