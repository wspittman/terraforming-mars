# Base milestone cleanup

## Goal
Retain only the five base-game milestones (Terraformer, Mayor, Gardener, Builder, Planner), remove expansion milestone implementations and now-dead supporting code, and update tests/documentation as needed without backwards compatibility.

## Phases
1. **Inventory and design** — complete
   - Inspect milestone implementations, registries, consumers, tests, and repository style.
   - Identify expansion-only abstractions and references that can be removed.
2. **Implementation** — complete
   - Delete unused milestone files and simplify retained milestone selection/typing code.
   - Update affected tests and documentation where necessary.
3. **Verification and delivery** — complete
   - Run focused tests, TypeScript builds/lint as appropriate.
   - Review the diff, commit changes, and create a pull request.

## Key decisions
- No compatibility aliases or migration logic for prior saved games/settings.
- Do not restore or retain expansion milestone functionality.

## Errors Encountered
| Error | Attempt | Resolution |
| --- | --- | --- |
| Combined patch did not match escaped Unicode text | 1 | Switched to targeted file rewrites and substitutions. |
| `npm run build:server` missing generated `genfiles/settings.json` | 1 | Ran the repository JSON generation step before retrying builds. |
| `npm run build:test` found client fixture `Forester` | 1 | Replaced the removed milestone fixture with a base milestone. |
| Focused selector test returned no milestones with `modularMA` | 1 | Made the five valid base milestones unconditional candidates while retaining award filters. |
