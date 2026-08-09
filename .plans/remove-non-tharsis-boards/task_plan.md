# Remove non-Tharsis boards

## Goal

Make the default Tharsis board the only board supported by this local-only fork, removing expansion and fan-made board implementations, registrations, UI choices, assets, and tests.

## Phases

1. **Remove non-Tharsis board support** (`complete`): Inventory board-related code, remove every non-Tharsis board and its references, update documentation and tests, run focused and broad verification, then commit and open a pull request.

## Key questions

- Which board implementations and board-name values remain in this stripped-down fork?
- Which server, client, serialization, and test code assumes multiple boards?
- Are any non-board features coupled to map-specific awards, milestones, legends, or assets?

## Errors encountered

| Error | Attempt | Resolution |
| --- | --- | --- |

| Server build failed after initial removal: stale `normalizeBoardName`/Hollandia references, unused imports, and missing generated settings JSON | 1 | Remove the stale board branches/imports, then generate required static JSON before rebuilding. |
| Server rebuild found two imports made unused by removing Hollandia's deflection-zone branch | 2 | Remove only the now-unused `partition` and `SpaceType` imports, then rerun compilation. |
| Test build found BoardBuilder coverage tied to deleted fan maps, unused Noctis test imports, and a strict invalid-card test cast | 3 | Remove only fan-board cases, clean imports, and make the intentionally invalid fixture cast explicit through `unknown`. |
| A broad regex intended to remove one MarsBoard method also removed adjacent core placement methods | 4 | Restore `MarsBoard.ts` from HEAD and use exact string boundaries around `canAffordPlacementBonuses` before continuing. |
| Exact cleanup script encountered already-partially-edited Game code; rebuild also showed retained base-card city logic depends on `ENERGY_PRODUCTION` | 5 | Preserve non-map bonus values used by retained mechanics, remove only bonuses exclusive to deleted maps, and restore the core `PlaceOceanTile` import. |
| A comment-spanning regex for the Hollandia player field crossed unrelated JSDoc and removed the `IPlayer` declaration | 6 | Restore `IPlayer.ts`, then remove the exact three-line Hollandia comment and field literal only. |
| Lint found five whitespace-only formatting issues left by deletions | 7 | Run the repository formatter (`npm run lint:fix`) and rerun lint. |
| Focused client tests could not compile because generated `src/genfiles/cards.json` was absent | 8 | Run `npm run make:cards` before rerunning the client tests; the production build already does this automatically for its client phase. |
