# Fixed Base Milestones and Awards

## Goal

Remove obsolete milestone and award selection infrastructure now that every game uses the fixed base-game set, while preserving current game behavior and serialized-game compatibility where needed.

## Phases

1. **Audit** (complete): Trace `src/server/ma`, all consumers, serialization, and tests to identify removable selection abstractions.
2. **Implementation** (complete): Remove unnecessary code and simplify callers to the fixed base milestones and awards.
3. **Verification** (complete): Update focused tests, run required lint/test/build checks, review the diff, commit, and open a pull request.

## Key Questions

- Which `src/server/ma` exports exist solely for expansion/fan selection?
- Does persisted game loading require compatibility handling for old milestone/award names?
- Which tests should change to assert the fixed base set?

## Errors Encountered

| Error | Attempt | Resolution |
| --- | --- | --- |
| `npm run build:server` could not find generated `src/genfiles/settings.json`. | 1 | Run the required full build, which generates static files before compiling the server. |
| `npm run test` could not find generated `build/styles.css`. | 1 | Run the full build before retrying the test suite. |
| `npm run build` found two remaining Vue imports of the removed random MA enum. | 1 | Removed the obsolete setup-detail display and create-game payload fields, then searched Vue and Less sources for remaining references. |
