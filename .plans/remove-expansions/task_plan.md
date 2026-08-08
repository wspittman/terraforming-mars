# Remove Expansion Support

## Goal

Reduce this personal fork to Base and Corporate Era only, removing the remaining expansion-specific runtime, client, configuration, and test support while preserving a passing build, lint, and test suite.

## Scope rule

Only implement the next incomplete phase in each work session, then stop for feedback.

## Phases

1. **Inventory and remove game-creation expansion configuration** — **complete**
   - Inventory remaining expansion references and group them into coherent later phases.
   - Remove expansion toggles/options from shared game options, game creation UI/API, and their focused tests.
   - Verify targeted tests plus build/lint as practical.
2. **Remove expansion card-engine integration** — **complete**
   - Restrict new-game card manifests and generated card registries to Base and Corporate Era.
   - Remove expansion compatibility filtering and expansion-only Prelude/CEO deck fallbacks.
   - Preserve legacy runtime/deserialization structures until their domain subsystems are removed in phase 4.
3. **Remove expansion client presentation** — **complete**
   - Remove expansion-only panels, icons, filters, settings, and rendering branches no longer required after engine cleanup.
4. **Remove expansion domain subsystems** — in progress
   - **4a. Remove disconnected Moon and Pathfinders client domains** — complete
   - **4b1. Remove expansion fields from the new-game transport contract** — complete
   - 4b2. Remove expansion player-input contracts and remaining client domains — pending
   - 4b3. Remove expansion fields from shared game/player models — pending
   - 4c. Remove server expansion engines, setup hooks, and serialization — pending
   - Consolidate the remaining Base/Corporate Era types after each boundary is removed.
5. **Repository-wide cleanup and documentation** — pending
   - Remove dead assets, scripts, dependencies, fixtures, and residual terminology; update README/AGENTS documentation where appropriate.
6. **Final verification** — pending
   - Run full build, lint, and test; resolve all remaining Base/Corporate Era regressions.

## Key Questions

- Which remaining option fields are expansion toggles versus general Base/Corporate Era variants?
- Which expansion types are embedded in serialized game compatibility and need staged migration/removal?
- Are any nominally promo mechanics/cards intended to remain? The stated target says no expansions, so default to removing all promo support.

## Errors Encountered

| Error | Attempt | Resolution |
| --- | ---: | --- |
| Direct client test lacked generated JSON files | 1 | Ran `npm run make:json`; card and colony JSON were still absent. |
| Client test still lacked card and colony JSON | 2 | Ran `npm run make:cards`; focused client test then passed. |
| Full lint found pre-existing removed-board references | 1 | Recorded as an unrelated baseline failure for a later cleanup phase; focused lint/server tests cover this phase. |
| Full server test initially lacked generated CSS | 1 | Ran `npm run make:css`, then reran the complete server suite. |
| Enforcing Base-only options in `Game.newInstance` broke legacy subsystem tests | 1 | Kept the API enforcement boundary from phase 1; removed only new-game card integration so legacy deserialization/runtime cleanup remains staged for phase 4. |
| Updated Game Setup Detail test expected Base for a Corporate Era fixture | 1 | Corrected the assertion to match the fixture, while retaining coverage of the Base/Corporate Era-only label. |
| Initial end-game template cleanup left an extra closing tag | 1 | Removed the orphaned tag and normalized setup-view whitespace; full lint then passed. |
| Focused create-game client tests lacked generated card/colony JSON | 1 | Run `npm run make:cards` before rerunning the focused tests. |

