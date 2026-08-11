# Findings

## Discovery

- Drafting is implemented by `Draft` in `src/server/Draft.ts`. The current optional initial variant runs two five-card draft iterations in opposite directions, then copies ten drafted cards into `dealtProjectCards` and starts the initial corporation/card purchase input.
- Standard between-generation drafting passes `after` in even generations and `before` in odd generations. The first standard draft is generation 2, so the requested initial direction is `before`.
- `Game.newInstance` currently deals ten project cards directly unless `initialDraftVariant` is true. `gotoInitialPhase` conditionally starts initial drafting, and `startGeneration` conditionally starts standard drafting.
- The two switches flow from `CreateGameForm` through `NewGameConfig` and `ApiCreateGame` into `GameOptions`, serialized game options, server/client game models, and setup-detail UI.
- Initial draft restore complexity (`initialDraftIteration`) exists only because the old variant had two iterations. A single ten-card draft can remove this state from `Game`, `IGame`, and serialization.
- Solo games currently force both draft options off. The create page only presents draft settings for multiplayer. Preserve non-drafting solo behavior while making both forms mandatory for multiplayer.
- Mandatory initial drafting makes the create-page beginner toggle unavailable under the former logic. The toggle is already effectively hidden by the default optional setting when enabled; remove the dead conditional UI/method while retaining the request model's fixed `beginner: false` value.
