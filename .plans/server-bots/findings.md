# Findings & Decisions

## Requirements

- A multiplayer-sized game has exactly one human participant; every other participant runs on the server.
- Placeholder bots choose the first corporation, choose the first available draft card, buy no cards, and always pass during action rounds.
- Remove multi-human communication code only when it becomes unnecessary under the local single-human model.
- This session implements only Phase 4, per the repository planning workflow.

## Research Findings

- `Player.process` is the shared validated input path and can be reused without HTTP.
- Initial selection and each draft/research round assign inputs to every player in a batch, so bots must be resolved only after each batch is fully assigned.
- A bot can bypass the normal action menu by passing in `takeAction`; it must also decline final greenery so end-game traversal cannot wait on it.
- Bot identity belongs in `SerializedPlayer` so reloaded games recreate bot behavior.
- Game creation currently posts a full `players` array and returns a `SimpleGameModel` containing a usable ID for every player, then opens a multiplayer link-sharing screen.
- The creation form can retain its existing option model while rendering and submitting only the first player as the human; bot names, colors, IDs, and flags should be authoritative server-generated data.
- `GameHome` is the obsolete link-sharing lobby reached through `/game` and `api/game`; new games no longer enter it, but loading a game still does.
- The waiting poll exposes every participant currently awaiting input even though the single human only needs to know whether their own state changed.
- Spectator support remains broader than human-to-human coordination and is still used by administrative/game-end views; Phase 3 can remove player-facing spectator links and spectator waiting polls without coupling this phase to a full persistence migration.
- Existing game tests already provide helpers to maximize the three global parameters and drive the final production/end-game transition; an end-to-end bot test can combine those helpers with a real human-plus-bots game rather than mocking `gameIsOver`.
- The repository test type-check currently has five stale errors in automa/removed-tag tests, which Phase 4 should clean up so verification can be authoritative.

## Technical Decisions

| Decision | Rationale |
| -------- | --------- |
| Keep the first phase below HTTP game creation. | A reusable server bot/input layer can be tested independently before changing the creation UI and contracts. |
| Submit one `player` plus a total `playerCount`, and return only `playerId`. | The browser should neither define bots nor receive credentials for server-controlled players. |
| Seat the human first unless random-first-player is enabled. | The old per-player first-player selector no longer makes sense when only one participant is human-configurable. |
| Remove the `/game` link-sharing lobby and return the human credential when loading. | Both creation and loading should enter the sole human view directly. |
| Keep the waiting endpoint but make it player-only and omit other players' input state. | Polling is required for the human client, but cross-player readiness information is not. |
| Drop all legacy settings and optional bot serialization handling. | The user explicitly said neither saved settings nor in-progress games need backward compatibility. |
| Add a lifecycle test at the game-engine boundary. | It exercises real setup, bot turn passing, final production, and termination without making a slow browser test the only completion proof. |

## Resources

- `AGENTS.md`
- `STYLE.md`
