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
   - **4b2. Remove expansion player-input views and the Delta Project client domain** — complete
   - **4b3. Remove expansion fields from shared game/player models** — complete
   - 4c. Remove server expansion engines, setup hooks, and serialization — in progress
     - **4c1. Remove expansion state from game/player serialization** — complete
     - 4c2. Remove expansion engines and setup hooks — in progress
       - **4c2a. Remove expansion setup and enforce Base/Corporate Era runtime options** — complete
       - 4c2b. Delete unreachable expansion engine implementations — in progress
         - **4c2b1. Remove Prelude and CEO engine/deck abstractions** — complete
         - 4c2b2. Remove remaining board and global-parameter expansion engines — in progress
           - **4c2b2a. Remove Moon and Pathfinders engines** — complete
           - 4c2b2b. Remove Ares, Colonies, Turmoil, Underworld, Venus, and Delta engines — pending
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
| Client type-check lacked generated settings JSON after resuming phase 4b2 | 1 | Ran `npm run make:json`, then generated all card data with `npm run make:cards` before focused verification. |
| Broad regex cleanup of retained card-gallery presentation produced invalid Vue scripts | 1 | Restored those files and kept phase 4b2 at the client player-input boundary; their shared expansion models remain coordinated with phases 4b3/4c. |
| Full lint found excess blank lines left by removed factory test cases | 1 | Ran the repository ESLint fixer before repeating full verification. |
| Server build found expansion scoring fields still used internally by the legacy engines | 1 | Kept those counters private to `VictoryPointsBreakdownBuilder` while returning only the reduced Base/Corporate Era transport model. |
| Client type-check exposed stale Underworld space rendering and allied-party overview code | 1 | Removed those disconnected presentation paths instead of restoring fields to the reduced shared models. |
| Full server suite found the API game fixture still expected expansion options | 1 | Updated the route assertion to cover the reduced Base/Corporate Era game-options response. |
| Removing all server subsystem directories at once produced widespread missing imports | 1 | Restored the directories and split phase 4c at the persistence boundary so serialization is removed before runtime engines. |
| Focused clone coverage compared internal project deck objects after expansion decks stopped round-tripping | 1 | Kept the clone assertion on the project discard pile and serialized corporation deck, the stable persisted boundaries relevant to cloning. |
| Server tests initially expected expansion setup after the production boundary was enforced | 1 | Added an explicit temporary `TestGame` bypass for retained engine coverage and removed direct expansion-only `Game`/`ConvertPlants` cases. |
| Deleting all remaining engines at once produced more than one hundred broken core integration imports | 2 | Restored the broad deletion and split 4c2b into coherent engine slices, beginning with Prelude/CEO. |
| Initial `Player.ts` patch did not match the repository's spaced import formatting | 1 | Inspected the current file and applied targeted structural edits instead. |
| Server tests initially lacked generated CSS | 2 | Ran `npm run make:css` before rerunning the suite. |
| Prelude/CEO removal left two stale expected test shapes | 1 | Removed obsolete initial-selection and serialized-game deck expectations. |
| Server tests lacked generated CSS after the engine files were removed | 3 | Ran `npm run make:css` before rerunning the complete server suite. |
| Automated Moon cleanup removed too much of the Robotic Workforce test harness | 1 | Restored the generic card-play/deferred-action portion while leaving only Moon-specific setup removed. |
| Moon/Pathfinders deletion exposed their remaining core imports and type branches | 1 | Removed each integration point compile-first rather than restoring engine shims. |
| Clone-tag cleanup removed a `Tag` import still used by Aridor serialization | 1 | Restored the shared import while keeping the Pathfinders `cloneTag` field removed. |
