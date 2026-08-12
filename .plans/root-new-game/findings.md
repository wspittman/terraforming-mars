# Findings

- `App.vue` selects screens from the last URL path segment. `/new-game` selects `create-game-form`, while `/` and every unrecognized route fall through to `start-screen`.
- `StartScreen.vue` is only imported by `App.vue` and has one mount-only component test. Removing its route permits deleting both files.
- `start_screen.less` contains only title-page styles except for the global `.notice` rule used by `App.vue`. That rule should move to a retained stylesheet before deleting the title-page stylesheet.
- The title-page planet sprite is referenced only by `start_screen.less`, so it becomes dead after that stylesheet is removed. The stars background is still used by `player_home.less` and must remain.
- `CreateGameForm.vue` already has a focused Mocha/Chai component test suite. The cards encyclopedia link belongs near the page heading and should be covered there.
- Both `/new-game` and `/` can render the same `CreateGameForm` without a browser redirect or compatibility migration. Existing saved settings are irrelevant to this routing/UI-only change.
