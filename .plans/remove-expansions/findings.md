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
