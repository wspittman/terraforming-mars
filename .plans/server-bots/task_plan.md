# Task Plan: Server-Controlled Placeholder Players

## Goal

Convert the local game flow incrementally so one human can play a multiplayer game whose other players are simple server-controlled bots, then remove human-to-human network coordination that is no longer needed.

## Current Phase

Complete

## Phases

### Phase 1: Bot Foundation and Automatic Turns

- [x] Map player setup, input resolution, drafting, and turn advancement.
- [x] Add a server-side bot marker and deterministic placeholder decision policy.
- [x] Automatically resolve bot setup choices, drafts, card purchases, and turns.
- [x] Add focused Mocha tests and document the local bot behavior.
- **Status:** complete

### Phase 2: Single-Human Game Creation

- [x] Replace multiplayer player-entry setup with one human plus a requested number of bots.
- [x] Update client/server creation contracts and tests.
- [x] Ensure only the human player receives a usable game route or credential.
- **Status:** complete

### Phase 3: Remove Multi-Human Coordination

- [x] Identify and remove waiting-room, readiness, and cross-human communication paths made obsolete by server bots.
- [x] Simplify related API payloads, persistence, client views, and tests.
- **Status:** complete

### Phase 4: End-to-End Verification and Documentation

- [x] Exercise a complete representative game through termination.
- [x] Run relevant builds, lints, and test suites.
- [x] Update README documentation for the final local-only workflow.
- **Status:** complete

## Key Questions

1. Where is a player input submitted and where can bot inputs be resolved without HTTP?
2. Which input shapes can occur during setup, drafting, buying, and passing?
3. How are player identities serialized so bot state survives reloads?
4. Which multiplayer network paths are genuinely obsolete only after creation becomes single-human?

## Decisions Made

| Decision | Rationale |
| -------- | --------- |
| Make bots deterministic placeholders rather than strategic agents. | The requested first corporation/first draft/no purchase/pass policy should be predictable and only needs to let games progress. |
| Defer broad network-code deletion until the bot loop and single-human creation flow exist. | Removing coordination prematurely risks breaking the existing route used to enter and exercise games. |

## Errors Encountered

| Error | Attempt | Resolution |
| ----- | ------- | ---------- |
| `build:server` could not resolve `PlaceholderBot`, rejected the literal override, and lacked generated settings. | 1 | Avoid the subclass/import cycle by putting the persisted bot marker and simple turn behavior on `Player`; generate static files before rebuilding. |
| Initial Phase 2 build lacked generated settings/cards; full test compilation also reported pre-existing errors in unrelated removed automa/tag tests. | 1 | Ran the static JSON generator before the server build, ran the card generator before focused client tests, and used focused suites plus client/server type checks for this phase. |
| Server build rejected `PLAYER_COLORS.includes` because the request color type also contains neutral colors. | 1 | Validate with `some` so TypeScript permits comparison while runtime still restricts human players to standard colors. |
| Player-only waiting route lost the narrowed player-ID type across a ternary expression. | 1 | Return early for non-player IDs so subsequent loader and tracker calls retain the branded `PlayerId` type. |
| Test compilation found one manually constructed `SerializedPlayer` missing the now-required bot marker, alongside known unrelated failures. | 1 | Marked that current-format fixture as human; no compatibility default remains in production deserialization. |
| Load-page screenshot rendered the route's existing authentication guard instead of the form. | 1 | Retained programmatic component coverage; the page cannot be captured without creating an authenticated browser session. |
| Initial lifecycle test stopped in production with deferred actions still queued. | 1 | Resolve the real production deferred-action queue before asserting the final phase. |
| Full lint found a blank line left behind when removing a stale wild-tag assertion. | 1 | Removed the padded line and reran the complete lint suite. |
