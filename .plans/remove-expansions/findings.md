# Findings

## 2026-08-07

- The repository began clean on branch `work`.
- The user already deleted roughly 2,000 expansion card and test files and restored build, lint, and test health.
- Work must be split into phases; this session is limited to phase 1.

- Remaining expansion support is broad and spans shared models, serialized game state, engine subsystems, client panels, card rendering, and creation filters.
- Phase 1 is therefore an enforcement boundary: the creation UI exposes only Corporate Era, and the create-game route sanitizes every other expansion flag to false. Later phases can safely delete unreachable internals.
- Focused client tests require generated JSON files; running the test directly before generation fails on missing `src/genfiles/settings.json`, `cards.json`, and `colonies.json`.

## 2026-08-07 — Phase 2

- `ALL_MODULE_MANIFESTS` feeds card creation, generated card JSON, metadata checks, and global initialization. Restricting it to Base/Corporate Era removes expansion cards from those registries.
- `GameCards` independently selected expansion manifests and created fallback Prelude/CEO decks. It now uses only Base plus optional Corporate Era and returns empty expansion decks.
- Sanitizing options inside `Game.newInstance` is premature: retained tests and deserialization paths still construct expansion state directly. The phase 1 API boundary already prevents new local games from doing so, while phase 4 can delete those subsystems coherently.

## 2026-08-07 — Phase 3

- Expansion presentation remained reachable from the shared board view, player/spectator homes, sidebar, setup details, and help rulebooks even though new games could not enable it.
- Removing the expansion board branches also exposed stale references to three already-deleted fan boards. Removing those branches and typing the empty legend map explicitly restored full Vue type-checking.
- Expansion component files remain on disk but are no longer mounted by the primary game views; they can be deleted with their common/server domain models in phase 4.

## 2026-08-07 — Phase 4a

- Moon and Pathfinders client components were disconnected from the main game views in phase 3 but remained mounted by setup and end-game views.
- Colonies, Turmoil, Delta Project, and Underworld components still back legacy player-input/card-list contracts. Their deletion must be coordinated with shared input/model removal in phase 4b rather than leaving broken imports.
- End-game global charts and contribution tables also contained Moon, Venus, and Pathfinders scoring branches; these were removed with the two disconnected domains.

## 2026-08-07 — Phase 4b1

- `NewGameConfig` still exposed every expansion-specific creation field even though the API discarded them. The transport now carries one `corporateEra` flag and only Base/Corporate Era settings.
- The create form still has legacy internal fields for settings-file migration, but serialized requests and saved current settings no longer contain the expansion object or expansion-specific variants.
- API construction continues to populate legacy `GameOptions` with safe defaults until shared game models and server serialization are removed in later phase 4 boundaries.

## 2026-08-08 — Phase 4b2

- Expansion player-input implementations are still required by the retained server engines, so their server-side model/response types must remain until phase 4c removes those engines.
- The client registrations and views are independently removable: Base/Corporate Era games cannot produce colony, delegate, party, global-event, Ares, Underworld, or Delta Project inputs.
- The remaining Colonies, Turmoil, Underworld, and Delta client domains are also referenced by the card gallery, log rendering, and legacy board decorations; those presentation paths belong in this client-domain boundary.

## 2026-08-08 — Phase 4b3

- Shared game and player view models were still transporting expansion state even though the primary game views no longer mounted expansion panels.
- The server engines and serialized save format can retain expansion fields until phase 4c without exposing them to the client; `ServerModel` is the boundary that now drops those fields.
- Legacy expansion scoring is still calculated internally by `VictoryPointsBreakdownBuilder`. Its public result now explicitly selects Base/Corporate Era fields so expansion counters do not leak through structural typing at runtime.
- Removing the shared fields exposed three stale presentation paths: Aridor colony selection, Underworld board tokens, and allied-party overview data. All were unreachable in Base/Corporate Era games and were removed rather than weakening the reduced contracts.

## 2026-08-08 — Phase 4c1

- Phase 4c spans more than one hundred server files because expansion handlers are embedded in `Game`, `Player`, behavior execution, boards, logging, and card abstractions.
- Removing all subsystem directories before narrowing the persistence boundary produced a deliberately abandoned compile attempt with widespread missing imports. Phase 4c is therefore split at the serialization boundary: 4c1 removes expansion save fields, then 4c2 can remove runtime engines without also carrying migration concerns.

## 2026-08-08 — Phase 4c2a

- Even after the create-game API sanitized expansion settings, direct callers of `Game.newInstance` could still activate legacy setup paths.
- `Game.newInstance` is now the runtime enforcement boundary: it normalizes all expansion flags to false, limits the module map to the Base/Corporate Era selection, builds empty Prelude/CEO decks, and omits all expansion subsystem initialization and setup-card dealing.
- With new games and deserialized games both normalized, the remaining expansion engines are unreachable and can be deleted in phase 4c2b without another behavior migration.
- The server suite still contains expansion-engine coverage needed while 4c2b is pending. `testGame` uses an explicit final argument to bypass normalization only in tests; production and ordinary direct callers cannot opt into expansion setup.

## 2026-08-08 — Phase 4c2b inventory

- The remaining expansion implementations are comparatively small after the manual card deletion: 71 subsystem files, 23 expansion-card manifest/support files, and 16 common-domain files.
- Expansion types are still referenced throughout roughly 300 core server/common files, so deletion must be compile-driven: remove the isolated implementations first, then eliminate or simplify every broken core integration point rather than restoring compatibility shims.
- Only two tests remain under expansion-named paths, but many retained core tests still exercise expansions through `testGame`; the temporary legacy setup bypass and those assertions must be removed with the engines.

## 2026-08-08 — Phase 4c2b2a inventory

- Moon and Pathfinders share global-parameter, behavior-executor, card-serialization, scoring, and board hooks, making them a coherent engine-removal slice.
- Their remaining implementations are isolated under `src/server/moon`, `src/server/pathfinders`, and matching common/card support directories; retained core references can be removed compile-first without touching Ares, Colonies, Turmoil, Underworld, or Venus behavior yet.

## 2026-08-08 — Phase 4c2b2b inventory

- The final engine slice contains 88 directly expansion-scoped files plus integration branches in about 200 retained server/common/test files.
- The isolated implementations cover Ares hazards, Colonies trading, Turmoil politics, Underworld excavation, Venus deferred bonuses, and Delta Project input/state.
- Client Colonies, Turmoil, and Underworld components are already disconnected from the reduced player/game model and can be deleted with their server domains in this slice.

## 2026-08-08 — Phase 4c2b2b1

- Delta Project persistence and setup had already been removed, leaving only its player-input transport, per-player runtime model, advancement engine, and victory-point hook.
- No retained tests directly exercised that unreachable engine, so deleting the complete vertical slice required no replacement compatibility behavior.

## 2026-08-08 — Phase 4c2b2b2 inventory

- Ares has five isolated engine files plus board-space, tile-placement, behavior, input, and scoring hooks in retained core files.
- Venus has one deferred-action implementation and a requirement/global-parameter path; its remaining MarsBot board is expansion-specific and can be removed with the Venus track.
- Base cards still import Ares adjacency types for optional upgraded-tile bonuses. Those optional fields and callbacks can be removed without changing their Base/Corporate Era behavior.

## 2026-08-08 — Phase 4c2b2b2

- Removing Ares adjacency support simplifies ordinary land availability and placement costs to the existing board-specific costs; Base placement bonuses and ocean adjacency income are unchanged.
- The Ares-specific Entrepreneur/Rugged awards and Networker/Purifier milestones, plus the Venus-specific Venuphile award and Hoverlord/Planetologist milestones, had to be removed with their engine dependencies.
- Colonies, Turmoil, and Underworld contained cross-expansion Ares/Venus effects. Those individual effects were removed while retaining the three domains for the next phase.
- Expansion option fields, tile enum values, renderer assets, and other dead terminology remain repository-cleanup work after the last runtime domains are removed.

## 2026-08-08 — Phase 4c2b2b3 inventory

- The last runtime slice contains 65 directly scoped Colonies, Turmoil, and Underworld files plus integration hooks across roughly 220 retained source/test files.
- All three client component domains are already disconnected from the reduced public game/player models and can be deleted with their shared/server contracts.
- This boundary also removes the temporary legacy expansion setup bypass after the final expansion engine tests disappear.

## 2026-08-08 — Phase 4c2b2b3

- Colonies, Turmoil, and Underworld no longer have shared models, runtime engines, player inputs, behavior branches, board state, scoring hooks, or client presentation domains.
- The static card-data exporter now emits only cards, milestones, and awards; the removed colony and global-event catalogs no longer require generated JSON.
- With the final expansion engines gone, `Game.newInstance` no longer exposes the temporary test-only normalization bypass. Expansion option and enum terminology that does not activate runtime behavior remains phase 5 cleanup.
