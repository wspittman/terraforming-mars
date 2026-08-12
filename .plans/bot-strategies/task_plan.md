# Bot Strategies Plan

## Goal

Update RandoBot behavior, add a parameter-focused strategy, and randomly assign an available strategy to each bot at game start.

## Phases

1. **Research and design** — complete
   - Inspect current strategy contracts, bot utilities, actions, serialization, and tests.
2. **Implementation and unit tests** — complete
   - Add award funding and random-selection support.
   - Update RandoBot and add ParameterMaximizerStrategy.
   - Register both strategies and preserve any per-game strategy state.
   - Add focused Mocha tests.
3. **Verification and delivery** — complete
   - Run focused tests, type checking, and lint.
   - Review the diff, update plan records, commit, and create a PR.
4. **Milestone-first priority and stricter awards** — complete
   - Claim an affordable qualifying milestone before evaluating awards.
   - Fund an award only when the bot's score exceeds half its cost and leads the runner-up by 20%.
   - Add focused regression tests, verify, commit, and update the PR.

## Key Decisions

- Strategy-specific mutable state must belong to the player, not singleton strategy instances.
- Random choices use the game's seeded RNG.
- Award funding requires affordability, a score greater than half the current award cost, and a score at least 20% higher than the next closest player.
- Milestones take priority over awards and are claimed immediately when the bot qualifies and can pay.

## Errors Encountered

| Error | Attempt | Resolution |
| --- | --- | --- |
| None | — | — |
| TypeScript did not narrow a mutable parameter inside callbacks | 1 | Moved project lookup into a typed helper. |
| Parameter project test compared a Set with an Array | 1 | Expanded the Set before asserting its contents. |
| `npm run build:server` could not find generated `genfiles/settings.json` | 1 | Ran `npm run make:json`, then the server build succeeded. |
