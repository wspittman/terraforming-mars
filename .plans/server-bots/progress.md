# Progress Log

## Session: 2026-08-09

### Phase 1: Bot Foundation and Automatic Turns

- **Status:** complete
- **Started:** 2026-08-09
- **Completed:** 2026-08-09
- **Actions taken:** Mapped the input lifecycle; added persisted bot identity, deterministic input resolution, automatic passing and final-greenery decline behavior; integrated bot resolution after setup/draft/research batches; added documentation and focused tests.
- **Files created/modified:** `.plans/server-bots/*`, `README.md`, `src/server/{Draft,Game,IPlayer,Player,SerializedPlayer}.ts`, `src/server/bots/PlaceholderBotInput.ts`, `src/server/inputs/SelectInitialCards.ts`, `tests/bots/PlaceholderBot.spec.ts`

### Phase 2: Single-Human Game Creation

- **Status:** complete
- **Started:** 2026-08-09
- **Completed:** 2026-08-09
- **Actions taken:** Replaced the multi-human request with one human plus a total player count; generated bots and their credentials on the server; returned only the human player ID; simplified the form and redirect; retained legacy settings import; added route and component coverage; captured `/tmp/server-bot-create-game.png`.
- **Files created/modified:** `README.md`, `src/common/game/NewGameConfig.ts`, `src/server/routes/ApiCreateGame.ts`, `src/client/components/create/{CreateGameForm.vue,CreateGameModel.ts,JSONProcessor.ts,defaultCreateGameModel.ts}`, and focused route/client tests.

### Phase 3: Remove Multi-Human Coordination

- **Status:** complete
- **Started:** 2026-08-09
- **Completed:** 2026-08-09
- **Actions taken:** Removed the game link-sharing lobby and routes; made loading return and open the sole human credential; made waiting polls player-only and removed participant readiness data; removed the player-facing spectator link; collapsed create settings to one player; removed settings and serialized-game compatibility fallbacks.
- **Files created/modified:** `README.md`, create/load/waiting client components and models, `App.vue`, player serialization, load/waiting routes, request routing, styles, and obsolete lobby files/tests.

### Phase 4: End-to-End Verification and Documentation

- **Status:** complete
- **Started:** 2026-08-09
- **Completed:** 2026-08-09
- **Actions taken:** Added a real four-seat lifecycle test that maximizes Mars, lets the human and all bots pass, resolves production, and reaches the end phase; removed stale expansion-era assertions/imports that prevented test compilation; ran the complete server/client test, lint, type-check, and build commands; finalized README usage and validation documentation.
- **Files created/modified:** `tests/bots/PlaceholderBot.spec.ts`, stale test cleanup in `tests/{automa,behavior,boards,cards}`, `README.md`, and `.plans/server-bots/*`.

### Phase 5: Preserve Original Solo Play

- **Status:** complete
- **Started:** 2026-08-09
- **Completed:** 2026-08-09
- **Actions taken:** Restored the Solo player-count choice and TR63 option, hid multiplayer-only settings for solo, accepted one-player API requests without creating bots, verified engine solo normalization, documented both play modes, and captured `/tmp/create-game-with-solo.png`.
- **Files created/modified:** `src/client/components/create/CreateGameForm.vue`, `src/server/routes/ApiCreateGame.ts`, focused route/client tests, `README.md`, and `.plans/server-bots/*`.

### Phase 6: Stable Page Title

- **Status:** complete
- **Started:** 2026-08-09
- **Completed:** 2026-08-09
- **Actions taken:** Removed the document-title animation path, renamed the remaining timer around its favicon-only responsibility, limited it to the experimental UI, and added a regression test asserting the page title remains stable.
- **Files created/modified:** `src/client/components/WaitingFor.vue`, `tests/client/components/WaitingFor.spec.ts`, and `.plans/server-bots/*`.

## Test Results

| Test | Input | Expected | Actual | Status |
| ---- | ----- | -------- | ------ | ------ |
| Placeholder bot Mocha spec | `npx mocha --import=tsx --require tests/testing/setup.ts "tests/bots/PlaceholderBot.spec.ts"` | Four focused bot behaviors pass. | 4 passing. | pass |
| Server build | `npm run build:server` | Server TypeScript compiles. | Completed successfully. | pass |
| Focused lint | `npx eslint ...` | Modified TypeScript files have no lint errors. | Completed successfully. | pass |
| Patch whitespace | `git diff --check` | No whitespace errors. | Completed successfully. | pass |
| Full build | `npm run build` | Generate assets and compile server/client. | Completed successfully. | pass |
| Create-game route spec | `npx mocha --import=tsx --require tests/testing/setup.ts "tests/routes/ApiCreateGame.spec.ts"` | Route creates one human plus bots and exposes only the human credential. | 9 passing. | pass |
| Create-game client specs | `npx cross-env NODE_ENV=development mochapack --reporter dot --require tests/client/components/setup.ts "tests/client/components/create/CreateGameForm.spec.ts" "tests/client/components/create/JSONProcessor.spec.ts"` | Form and settings migration behavior pass. | 12 passing. | pass |
| Client type check | `npm run lint:client` | Vue and client TypeScript compile. | Completed successfully. | pass |
| Focused lint | `npx eslint ...` | Phase 2 TypeScript and Vue files have no lint errors. | Completed successfully. | pass |
| Create-game screenshot | `npx -y playwright@1.55.0 screenshot --viewport-size=1440,1000 http://127.0.0.1:8080/new-game /tmp/server-bot-create-game.png` | Updated single-human form renders. | Screenshot captured. | pass |
| Phase 3 server specs | `npx mocha --import=tsx --require tests/testing/setup.ts "tests/routes/ApiWaitingFor.spec.ts" "tests/routes/ApiCreateGame.spec.ts" "tests/bots/PlaceholderBot.spec.ts"` | Player-only polling and bot game creation remain correct. | 17 passing. | pass |
| Phase 3 client specs | `npx cross-env NODE_ENV=development mochapack --reporter dot --require tests/client/components/setup.ts ...` | Create settings, load form, and waiting component compile and pass. | 14 passing. | pass |
| Full build | `npm run build` | Server and client build after lobby removal. | Completed successfully. | pass |
| Test type-check | `npm run build:test` | Test TypeScript compiles. | Phase changes compile; warning due to five pre-existing errors in removed automa/tag test code. | warning |
| Load screenshot | `npx -y playwright@1.55.0 screenshot --viewport-size=1200,800 http://127.0.0.1:8080/load /tmp/single-human-load-game.png` | Load form renders. | Authentication guard rendered instead of the form. | warning |
| Lifecycle bot spec | `npx mocha --import=tsx --require tests/testing/setup.ts "tests/bots/PlaceholderBot.spec.ts"` | A four-seat human-plus-bots game reaches `Phase.END`. | 5 passing. | pass |
| Test type-check | `npm run build:test` | All test TypeScript compiles. | Completed successfully. | pass |
| Complete tests | `npm test` | All server and client tests pass. | Completed successfully; client reported 287 passing. | pass |
| Complete lint | `npm run lint` | Server, Vue, and stylesheet lint pass. | Completed successfully. | pass |
| Full build | `npm run build` | Static assets, server, and production client compile. | Completed successfully. | pass |
| Solo create route | `npx mocha --import=tsx --require tests/testing/setup.ts "tests/routes/ApiCreateGame.spec.ts"` | One-player requests create an original solo game without bots. | 10 passing. | pass |
| Solo create form | `npx cross-env NODE_ENV=development mochapack --reporter dot --require tests/client/components/setup.ts "tests/client/components/create/CreateGameForm.spec.ts"` | Solo and multiplayer controls render in their correct modes. | 9 passing. | pass |
| Complete verification | `npm run build:test && npm run lint && npm run build && npm test` | Types, lint, production build, and all tests pass. | Completed successfully; client reported 288 passing. | pass |
| Solo UI screenshot | `npx -y playwright@1.55.0 screenshot --viewport-size=1440,1000 http://127.0.0.1:8080/new-game /tmp/create-game-with-solo.png` | Solo choice is visible alongside bot multiplayer counts. | Screenshot captured. | pass |
| Stable title component spec | `npx cross-env NODE_ENV=development mochapack --reporter dot --require tests/client/components/setup.ts "tests/client/components/WaitingFor.spec.ts"` | Turn indication never prefixes the page title with spinner characters. | 3 passing. | pass |
| Complete verification | `npm run build:test && npm run lint && npm run build && npm test` | Types, lint, production build, and all tests pass. | Completed successfully. | pass |
