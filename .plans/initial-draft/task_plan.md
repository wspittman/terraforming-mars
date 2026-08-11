# Initial Draft Plan

## Goal

Make the custom initial draft mandatory: deal ten cards to every player, draft one card per pass in the direction opposite the first round draft, and only then enter the buy phase. Make between-round drafting mandatory, remove both draft settings from game creation and persistence, and clean up obsolete variant code without supporting old saves.

## Phases

1. **Discovery** — complete
   - Trace game options, create-game UI, initial research/draft flow, round draft flow, serialization, and tests.
2. **Implementation** — complete
   - Make both drafting behaviors unconditional and implement the initial draft sequence.
   - Remove obsolete options/UI/persistence and simplify affected code.
3. **Tests and documentation** — complete
   - Add or update Mocha tests following repository conventions.
   - Update relevant docs if user-visible setup documentation references removed options.
4. **Verification and delivery** — complete
   - Run focused tests, builds/lints as appropriate, review the diff, commit, and create a pull request.
5. **Full-suite regression fixes** — complete
   - Reproduce the reported `npm run test` failures with all generated prerequisites present.
   - Fix test helpers and expectations that assumed multiplayer games skipped initial drafting.
   - Run the complete test suite, commit the corrections, and update the pull request.

## Key Questions

- Where is the first-round draft direction determined, and how should initial drafting invert it?
- Does the existing initial-draft variant already defer buying until all draft picks finish?
- Which serialized/configured option fields can be deleted safely given no compatibility requirement?

## Errors Encountered

| Error | Attempt | Resolution |
| --- | --- | --- |
| `npm run build:server` could not find generated `genfiles/settings.json`. | 1 | Generate required static JSON with the repository's build prerequisite before rerunning compilation. |
| Bulk removal deleted test fixture declarations whose lines also contained removed options. | 1 | Restored the declarations without the obsolete option properties, then reran compilation. |
| Focused client test compilation could not find generated `src/genfiles/cards.json`. | 1 | Run the `make:cards` prerequisite before rerunning the client test. |
| Full server suite could not start because ignored `build/styles.css` was absent. | 1 | Generate CSS with the repository prerequisite, then rerun the full suite to expose the reported regressions. |
| Bot regression test used the `TestPlayer`-only `popWaitingFor` helper on a production `Player`. | 1 | Read and clear the production player's input explicitly before processing the draft selection. |
| `npm run test` reached the client suite without ignored generated JSON assets in this fresh workspace. | 1 | Regenerate the documented client prerequisites and rerun the client suite; this is unrelated to the draft regression. |
