# Findings

- `BotStrategy` implementations are singleton objects, so a chosen parameter cannot safely be stored on `ParameterMaximizerStrategy` itself.
- `Player.setup` already assigns a strategy through the seeded game RNG, and bot strategy names are serialized.
- Existing bot utilities directly execute heat, greenery, and random standard-project actions.
- Current RandoBot behavior incorrectly chooses the wealthiest corporation, the first draft card, and uses a 15 M€ threshold.
- Player action menus already contain award funding logic, but bots need a direct helper to identify leaders and fund an award.
- `Player.claimableMilestones()` already combines capacity, affordability, unclaimed status, and milestone qualification.
- Deferring the normal milestone payment chooser would create an unsupported bot input, so bot milestone claims should pay and record the claim directly.
