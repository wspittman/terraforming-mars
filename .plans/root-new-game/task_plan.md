# Root New Game Plan

## Goal

Make `/` show the new-game page, retain an easy path to the card encyclopedia from that page, and remove obsolete title-page code where safe.

## Phases

1. **Research** (complete): Locate client routing, title/new-game components, relevant tests, and dead-code candidates.
2. **Implementation** (complete): Route `/` to new-game, add the cards link, and clean up obsolete title-page code.
3. **Verification** (complete): Run focused tests, type/lint checks, inspect the UI, and review the diff.
4. **Delivery** (complete): Update planning records, commit the changes, and create a pull request.

## Key Questions

- Is routing handled client-side, server-side, or both?
- Can the old title component and its styling/tests be deleted completely?
- What existing link/button pattern should the encyclopedia link follow?

## Errors Encountered

| Error | Attempt | Resolution |
| --- | --- | --- |
| Focused mochapack compilation could not resolve generated JSON files | 1 | Generate the repository's static artifacts before rerunning the tests. |

