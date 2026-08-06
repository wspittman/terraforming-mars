# Remove non-English locale support

## Goal
Remove the remaining runtime, build, configuration, documentation, and test support for non-English locales while retaining English-only UI behavior and keeping the project healthy.

## Phases
1. **Inventory locale support** — complete
   - Locate locale/language types, selectors, routes, build scripts, dependencies, tests, and docs.
   - Distinguish translation infrastructure from unrelated uses of “language” or “locale”.
2. **Remove implementation and tests** — complete
   - Simplify the application to English-only behavior.
   - Delete obsolete locale-specific code and tests/configuration.
3. **Verify and document** — complete
   - Run targeted checks, full build, lint, and tests.
   - Review the diff, update plan records, commit, and open a pull request.

## Key Questions
- Is the custom `v-i18n` directive still useful for English interpolation, or can it be removed entirely?
- Which server preferences and serialized fields exist solely for locale selection?
- Which dependencies and scripts exist solely for translations?

## Errors Encountered
| Error | Attempt | Resolution |
| --- | --- | --- |
| `npm run lint`: padded blocks and obsolete `async` bootstrap | 1 | Removed blank padding and made bootstrap synchronous. |
| `npm run lint`: missing generated `settings.json` | 2 | Run `npm run make:json` before linting after test compilation cleaned generated files. |
