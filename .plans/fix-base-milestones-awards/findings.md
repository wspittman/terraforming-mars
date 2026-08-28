# Findings

- `src/server/ma/MilestoneAwardSelector.ts` implements random selection, fan/modular candidate filtering, and synergy constraints. Its only production caller is game creation; the rest are tests and two obsolete analysis tools.
- `src/server/ma/MilestoneAwardSynergies.ts` exists only for random selection, so it can be removed with the selector.
- `src/server/ma/MAManifest.ts` carries board/random/deprecation metadata that is unnecessary with one board and five fixed entries. The milestone and award registries still need name-to-instance creation for deserialization and tooling, but can use simple fixed factory records.
- All supported milestone and award names are already restricted to the five base entries in `src/common/ma/MilestoneName.ts` and `AwardName.ts`.
- The removed selection options (`randomMA`, `includeFanMA`, and `modularMA`) remain in server/common configuration, route mapping, JSON processing, and tests even though the create-game UI no longer exposes random selection.
- Serialized games currently store both selected names and the obsolete selection options. Name arrays should remain for safe reconstruction of claimed/funded records, while obsolete option fields can be tolerated structurally when spreading older serialized options without remaining part of `GameOptions`.
- `src/server/tools/analyze_ma.ts` and `src/server/tools/ma_synergies.ts` exclusively analyze removed random-selection behavior and should be deleted.
