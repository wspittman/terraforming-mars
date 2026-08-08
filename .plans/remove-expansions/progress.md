# Progress

## 2026-08-07 — Phase 1

- Created the persistent plan for removing expansion support.
- Next: inventory remaining references, then remove the game-creation expansion configuration slice.

- Removed all expansion selectors except Corporate Era from the create-game form.
- Added server-side sanitization so crafted/restored requests cannot enable removed expansions.
- Added focused client and route regression assertions.
- Generated static card/settings JSON and passed focused client coverage.
- Passed focused server coverage, server/test TypeScript builds, ESLint on all touched source/test files, and `git diff --check`.
- Full lint remains blocked by pre-existing references to already-deleted fan-board enum members.
- Screenshot not captured because this environment has no installed Chromium/Chrome browser or browser automation package.
- Phase 1 complete; stop here for feedback before phase 2.

## 2026-08-07 — Phase 2

- Restricted global card registration and new-game deck construction to Base and Corporate Era manifests.
- Removed expansion compatibility filtering and Prelude/CEO fallback deck construction from `GameCards`.
- Updated `GameCards` tests to prove legacy expansion flags cannot add cards or expansion decks.
- Passed server/test TypeScript builds and the complete 1,679-test server suite.
- Phase 2 complete; stop here for feedback before phase 3.

## 2026-08-07 — Phase 3

- Removed Turmoil, Moon, Pathfinders, Delta Project, Colonies, Underworld, Venus, Ares, Prelude, and CEO presentation from primary player and spectator views.
- Reduced setup details and help rulebooks to Base/Corporate Era information.
- Removed expansion global parameters, board spaces, sidebar shortcuts, hand/tableau handling, and stale deleted-board rendering branches.
- Added focused component assertions and passed all targeted client tests.
- Full lint and the production client build now pass; webpack reports only its existing bundle-size warnings.
- Screenshot not captured because the environment still has no Chromium/Chrome executable or browser automation package.
- Phase 3 complete; stop here for feedback before phase 4.

## 2026-08-07 — Phase 4a

- Deleted all Moon and Pathfinders client components and the Moon component test.
- Removed their remaining setup and end-game mounts, scoring columns, contribution data, and global chart datasets.
- Added regression assertions that setup and end-game views do not mount Moon or Pathfinders components.
- Next: phase 4b shared expansion models and player-input contracts.

## 2026-08-07 — Phase 4b1

- Replaced the new-game expansion map with a single Corporate Era flag.
- Removed all expansion-specific options, lists, completion requirements, and Prelude/CEO fields from `NewGameConfig`.
- Removed expansion-only validation and payload serialization from the create form.
- Updated legacy settings restore to migrate only Corporate Era and ignore obsolete expansion fields.
- Updated route and client tests for the reduced transport contract.
- Next: phase 4b2 expansion player-input contracts and their remaining client domains.

## 2026-08-08 — Phase 4b2

- Removed all expansion-only player-input components and registrations from the client input factory.
- Narrowed the factory's accepted model type to the Base/Corporate Era input variants while retaining server-side expansion contracts until their engines are removed in phase 4c.
- Deleted the Delta Project client domain, which existed solely to render its removed player input.
- Removed the focused expansion input component tests and their factory cases; retained factory coverage now enumerates only supported inputs.
- Next: phase 4b3 expansion fields in shared game/player models.

## 2026-08-08 — Phase 4b3

- Reduced `GameModel`, `GameOptionsModel`, `PublicPlayerModel`, `PlayerViewModel`, `SpaceModel`, and `VictoryPointsBreakdown` to Base/Corporate Era data.
- Replaced the client game-options expansion map with a single `corporateEra` value.
- Updated `ServerModel` to omit expansion game, player, space, setup-card, and scoring fields while leaving save compatibility and engine state for phase 4c.
- Removed stale Aridor colony selection, Underworld board-token rendering, allied-party overview rendering, and expansion-only tag counts.
- Updated shared client fixtures and focused tag/input tests to use the reduced contracts.
- Passed full lint, the production build, the server build, and all server/client tests; screenshot capture remains unavailable because the environment has no browser executable.
- Next: phase 4c server expansion engines, setup hooks, and serialization.

## 2026-08-08 — Phase 4c1

- Split phase 4c into serialization removal followed by engine/setup removal after an all-at-once deletion exposed the breadth of core coupling.
- Reduced serialized game options to Base/Corporate Era settings and stopped saving expansion decks, boards, global parameters, subsystem data, and flags.
- Stopped saving expansion-specific player cards, colony/trade state, Turmoil state, Underworld state, Delta Project state, and fan-card counters.
- Deserialization now supplies safe default runtime options and empty Prelude/CEO decks instead of restoring expansion state.
- Removed obsolete Moon migration tests and the saved-game Turmoil inspection tool; updated serialization and cloning coverage for the reduced persistence contract.
- Next: phase 4c2 expansion engines and setup hooks.

## 2026-08-08 — Phase 4c2a

- Enforced Base/Corporate Era options inside `Game.newInstance`, including for direct server/test callers that bypass the create-game API.
- Disabled Ares, Colonies, Turmoil, Underworld, Moon, Pathfinders, Delta Project, Prelude, and CEO initialization for all production and ordinary direct callers.
- Added a temporary test-only setup bypass so the retained expansion-engine tests remain usable until their implementations are deleted in 4c2b.
- Added a regression test that enables legacy flags and verifies no expansion state or setup cards are created.
- Next: phase 4c2b deletion of the now-unreachable expansion engine implementations.

## 2026-08-08 — Phase 4c2b1

- Deleted the Prelude and CEO card base classes, manifests, deck implementations, setup dealing, initial-selection branches, draft phases, and action-phase hooks.
- Removed Prelude/CEO card creation and serialization paths, module-manifest slots, player/game state, and export-tool processing.
- Removed the Delta Project card implementation because it depended on the deleted Prelude base class; its remaining subsystem will be deleted with the later expansion-engine slice.
- Simplified focused game, drafting, card-registry, and serialization tests to the Base/Corporate Era selection shape.
- Full lint, production build, and automated test suites pass (1,671 server and 304 client tests).
- Next: phase 4c2b2 removal of the remaining board and global-parameter expansion engines.

## 2026-08-08 — Phase 4c2b2a

- Deleted the Moon board, global-track engine, placement actions, milestones/awards, requirements, behavior DSL branches, scoring, and focused tests.
- Deleted the Pathfinders track engine, rewards/deferred actions, clone-tag serialization/model support, scoring, and card hooks.
- Simplified shared Mars tile scoring, project-card reserve payments, Turmoil Reds handling, and milestone/award selection after removing the two engines.
- Full lint, production build, and automated test suites pass (1,659 server and 304 client tests).
- Next: phase 4c2b2b removal of Ares, Colonies, Turmoil, Underworld, Venus, and Delta engines.

## 2026-08-08 — Phase 4c2b2b1

- Split the final six-engine boundary into smaller coherent slices after inventory showed it still crossed about 200 retained integration files.
- Deleted the Delta Project advancement engine, server player input, shared response/model contracts, player runtime state, empty card manifest, and victory-point hook.
- Passed server and test TypeScript builds, the complete lint suite, and all automated tests (1,659 server and 304 client tests).
- Next: phase 4c2b2b2 Venus and Ares global-parameter engines.

## 2026-08-08 — Phase 4c2b2b2

- Deleted the Ares hazard/setup/adjacency engine, global-parameter input, behavior hooks, board state, placement costs, and expansion milestones/awards.
- Deleted the Venus global track, alternate-track deferred rewards, requirements, card support, MarsBot track, and expansion milestones/award.
- Removed Ares/Venus cross-expansion effects from retained Colonies, Turmoil, and Underworld code without restoring compatibility shims.
- Simplified retained Base card tile placement and Mining Guild handling to their Base/Corporate Era behavior and updated focused tests accordingly.
- Passed the production build, server/test TypeScript builds, the complete lint suite, and all automated tests (1,638 server and 304 client tests); webpack emitted only its existing bundle-size warnings.
- Next: phase 4c2b2b3 Colonies, Turmoil, and Underworld engines.

## 2026-08-08 — Phase 4c2b2b3

- Deleted the Colonies trading engine, Turmoil political engine, Underworld excavation engine, their common contracts, deferred actions, player inputs, requirements, client components, and focused tests.
- Removed their hooks from game/player state, behavior execution, boards, cards, logs, milestone/award scoring, API setup, and generated-card tooling.
- Removed the temporary expansion test bypass and normalized all direct game construction to Base/Corporate Era behavior.
- Full lint, production build, and automated suites pass (1,525 server and 296 client tests); webpack reports only its existing bundle-size warnings.
- Next: phase 5 repository-wide dead asset, script, dependency, fixture, and terminology cleanup.
