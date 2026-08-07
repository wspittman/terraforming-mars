# Progress

## 2026-08-07 — Phase 1

- Created the persistent plan for removing expansion support.
- Next: inventory remaining references, then remove the game-creation expansion configuration slice.

- Removed all expansion selectors except Corporate Era from the create-game form.
- Added server-side sanitization so crafted/restored requests cannot enable removed expansions.
- Added focused client and route regression assertions.
- Generated static card/settings JSON and passed focused client coverage.
- Passed focused server coverage, server/test TypeScript builds, ESLint on all touched source/test files, and `git diff --check`.
- Full lint remains blocked by pre-existing references to already-deleted fan-board enum members.
- Screenshot not captured because this environment has no installed Chromium/Chrome browser or browser automation package.
- Phase 1 complete; stop here for feedback before phase 2.

## 2026-08-07 — Phase 2

- Restricted global card registration and new-game deck construction to Base and Corporate Era manifests.
- Removed expansion compatibility filtering and Prelude/CEO fallback deck construction from `GameCards`.
- Updated `GameCards` tests to prove legacy expansion flags cannot add cards or expansion decks.
- Passed server/test TypeScript builds and the complete 1,679-test server suite.
- Phase 2 complete; stop here for feedback before phase 3.

## 2026-08-07 — Phase 3

- Removed Turmoil, Moon, Pathfinders, Delta Project, Colonies, Underworld, Venus, Ares, Prelude, and CEO presentation from primary player and spectator views.
- Reduced setup details and help rulebooks to Base/Corporate Era information.
- Removed expansion global parameters, board spaces, sidebar shortcuts, hand/tableau handling, and stale deleted-board rendering branches.
- Added focused component assertions and passed all targeted client tests.
- Full lint and the production client build now pass; webpack reports only its existing bundle-size warnings.
- Screenshot not captured because the environment still has no Chromium/Chrome executable or browser automation package.
- Phase 3 complete; stop here for feedback before phase 4.

## 2026-08-07 — Phase 4a

- Deleted all Moon and Pathfinders client components and the Moon component test.
- Removed their remaining setup and end-game mounts, scoring columns, contribution data, and global chart datasets.
- Added regression assertions that setup and end-game views do not mount Moon or Pathfinders components.
- Next: phase 4b shared expansion models and player-input contracts.
