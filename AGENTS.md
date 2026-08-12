# AGENTS.md

A personal fork of [terraforming-mars/terraforming-mars](https://github.com/terraforming-mars/terraforming-mars) intended to emulate a multiplayer player game, in the style my group plays it, but with only a single player. It is intended to only be run locally.

We will be liberally removing functionality that is unnecessary to achieve this goal.

## Workflows

- Create or continue a plan: use the `planning-with-files` skill. When continuing, only implement changes in the **next phase** of the plan before stopping for feedback.
- Write unit tests: use the `write-unit-test` skill, but disregard the instruction to use `node:test`. This repo uses Mocha tests instead.

### Verifying Changes

- Take a step back and consider if the changes solve the right problem.
- If you are working with or from a plan, review to ensure that the plan files are structured correctly and up to date.
- Ensure error cases are handled gracefully, predictably, and provide enough information for future maintainers.
- Update `README.md` and any relevant `AGENTS.md` files as necessary when changes affect them.
- `npm run lint:fix`, `npm run test`, and `npm run build` must all succeed before a change is considered finished.

---

## Build & Development Commands

```bash
npm run build                # Full build: CSS + JSON static files, server (tsc), client (webpack)
npm run build:server         # TypeScript compile server only: tsc --build src/tsconfig.json
npm run build:client         # Webpack production bundle (runs make:cards first)
npm run build:test           # Compile tests: tsc --build tests/tsconfig.json
npm run lint                 # All lints: eslint + vue-tsc + stylelint
npm run lint:client          # Vue type checking: vue-tsc --noEmit
npm run lint:server          # ESLint on src and tests
npm run lint:fix             # ESLint autofix
```

### Running Tests

```bash
npm run test                 # All tests (server + client)
npm run test:server          # Mocha server tests (~6700 tests)
npm run test:client          # Mochapack client component tests
npm run test:integration     # Run the PostgreSQL tests
# Single server test file
npx mocha --import=tsx --require tests/testing/setup.ts "tests/cards/base/Algae.spec.ts"

# Single client test file
cross-env NODE_ENV=development mochapack --require tests/client/components/setup.ts "tests/client/components/Board.spec.ts"
```

### Dev Servers

```bash
npm run dev:server           # Server with hot reload (tsx watch)
npm run dev:client           # Webpack watch mode
npm run watch:less           # CSS rebuild on change
```

However `npm run dev` is much easier to run and a little more powerful / flexible.

## Architecture

### Three-Layer Structure

- **`src/server/`** - Game engine, card logic, routes, database. Runs on Node.js.
- **`src/client/`** - Vue 3 frontend (Options API, `defineComponent`). Bundled with Webpack.
- **`src/common/`** - Shared types, enums, and models used by both client and server. No runtime logic that depends on either side.

The `@/` import alias maps to `./src/` (configured in tsconfig paths and webpack).

### Card System

Cards are the core domain object. This fork retains only Base and Corporate Era cards. Each card involves:

1. **Card class** (`src/server/cards/<module>/CardName.ts`) - Extends `Card`, defines cost, tags, requirements, behavior, and metadata. Simple cards are purely declarative via the `behavior` property. Complex cards override `play()`, `action()`, `canAct()`, etc.
2. **CardName enum entry** (`src/common/cards/CardName.ts`) - Every card needs an enum value here.
3. **Module manifest** (`src/server/cards/<module>/<Module>CardManifest.ts`) - Registers the card's factory in a `ModuleManifest`. All manifests aggregate in `AllManifests.ts`.
4. **Card renderer** - Defined inline in the card's `metadata.renderData` using the `CardRenderer.builder()` DSL.
5. **Test** (`tests/cards/<module>/CardName.spec.ts`) - Uses `testGame()` and `TestPlayer` helpers.

Retained card types are `EVENT`, `ACTIVE` (has action), `AUTOMATED`, `CORPORATION`, `STANDARD_PROJECT`, and `STANDARD_ACTION`.

See the wiki's [Adding New Cards](https://github.com/terraforming-mars/terraforming-mars/wiki/Adding-New-Cards) page for practical advice (finding a similar existing card as a template, testing at `/cards` locally) and special-case mechanics (Robotic Workforce, Celestic, resource storage/VP interactions).

### Behavior System

The `Behavior` type (`src/server/behavior/Behavior.ts`) is a declarative DSL for card effects: production changes, resource gains, tile placement, TR changes, etc. Cards set `behavior` (on play) and/or `action` (repeatable) properties. The `BehaviorExecutor` (`src/server/behavior/Executor.ts`) interprets these at runtime. Prefer declarative `behavior` over imperative `play()` overrides when possible.

### Deferred Actions

Player choices and multi-step effects use `DeferredAction` (`src/server/deferredActions/`). Actions are queued via `game.defer(action)` with a `Priority` and resolved in order. The `.andThen()` callback chains follow-up logic after a deferred action resolves.

### Player Inputs

When a player needs to make a choice, the server returns a `PlayerInput` (e.g., `SelectSpace`, `SelectCard`, `OrOptions`). These live in `src/server/inputs/`. The client renders the appropriate UI based on the input type.

### Game Modules

This fork supports only the Base game and optional Corporate Era cards. Do not restore expansion flags, manifests, rules engines, UI, or assets. Base cards live in `src/server/cards/base/`; Corporate Era cards use `src/server/cards/corpera/`, and the retained corporation cards live in `src/server/cards/corporation/`.

### Board System

This fork supports only the default Tharsis board. Do not add or restore alternate, expansion, randomized, or fan-made boards.

### Client Components

Vue 3 with Options API. Components are in `src/client/components/`. The root `App.ts` routes between screens. `PlayerHome.vue` is the main game view. Card rendering components are in `src/client/components/card/`. Styles use Less (`src/styles/`).

- New Vue components can use the Vue 3 style.
- Every new Vue component must have a test class, even if it is minially a sanity test. However, ask the user if they want feature-rich tests when creating new components. Not every feature needs a test.

### Database

Pluggable backends in `src/server/database/`: `SQLite`, `PostgreSQL`, `LocalFilesystem`. Games are serialized/deserialized through `SerializedGame`/`SerializedPlayer` types. `GameLoader` handles caching and retrieval.

### Wiki

Good wiki pages:

- [Databases](https://github.com/terraforming-mars/terraforming-mars/wiki/Databases)
- [dot-env](https://github.com/terraforming-mars/terraforming-mars/wiki/dot-env) pages for local setup
- [Development tips](https://github.com/terraforming-mars/terraforming-mars/wiki/Development-tips)
- [Changing game data for local testing](https://github.com/terraforming-mars/terraforming-mars/wiki/Changing-game-data-for-local-testing)

### Testing Patterns

- **`testGame(n, options?)`** - Creates a game with n players, returns `[game, ...players]`. Skips initial card selection by default.
- **`TestPlayer`** - Extends `Player` with test utilities. Use static factories: `TestPlayer.BLUE`, `TestPlayer.RED`, etc.
- Server card tests: instantiate the card, call `canPlay()`/`play()`/`action()`, assert state changes.
- Client tests: use `@vue/test-utils` mount/shallowMount with JSDOM setup from `tests/client/components/setup.ts`.
- Test framework: Mocha + Chai (expect style). Client tests use mochapack.

### English text rendering

The client is English-only. The legacy-named `v-i18n` directive and `$t` helper remain responsible for interpolating dynamic log and UI message parameters; they do not load or select translations. Do not add locale selection or translation files.

## Style Guide

Read STYLE.md. Adhere to it as best as you can, calling out outliers.
