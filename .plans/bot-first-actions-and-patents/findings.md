# Findings

- `Player.takeAction()` has a dedicated bot branch before the shared `pendingInitialActions` branch, so bots currently skip corporation first actions entirely.
- Human first actions log the corporation, invoke `initialAction`, remove it from `pendingInitialActions`, count the action, run deferred work, and continue the turn.
- Every bot strategy inherits `RandoBotStrategy.takeAction()`, making it the shared place to prioritize selling cards.
- `SellPatentsStandardProject.action()` already owns all expected behavior: select cards, award 1 M€ per card, discard them, count the standard project, and log the sale.
- Bot project-card purchases are intentionally empty, but effects such as Inventrix's first action can still put cards into a bot hand.
- Tests use Mocha and Chai in `tests/bots/RandoBotStrategy.spec.ts`; focused regressions belong there.

## Decisions

- Handle a bot's pending corporation action in `Player.takeAction()` before asking its strategy for a normal action, mirroring the existing human action semantics.
- Add `trySellPatents()` to the shared bot utilities and make it the highest-priority normal bot action so the full hand is discarded immediately.
