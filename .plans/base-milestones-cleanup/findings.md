# Findings

## Inventory
- Pending.

## Phase 1 discoveries
- `src/server/milestones` contains 51 expansion/modular implementation files plus the five base classes and shared serialization/interface/manifest files.
- `Milestones.ts` registers every removed class through a generic `MAManifest`, although the only supported board mapping is already the five Tharsis milestones.
- `MilestoneName.ts` still exposes all expansion names and an empty legacy rename mechanism; backwards compatibility is explicitly unnecessary.
- `Player.claimMilestone` has special payment behavior only for removed `Briber` and `Merchant` milestones.
- Expansion milestone tests directly import implementations that will be deleted; selector tests exercise random expansion milestone pools and must be simplified to assert the fixed base milestone set.
- `Game.deserialize` currently tolerates unknown/renamed milestones; saved-game compatibility is not required, so it can instantiate the serialized names directly and fail predictably on invalid names.

## Implementation decisions
- Retained the existing milestone manifest shape because the shared milestone/award selector and rendering tools consume it, but reduced it to five factories and replaced exception-based lookup with an explicit missing-name check.
- Random milestone options now always draw from the same five base milestones; award randomization remains unchanged.
- Removed the empty milestone rename path and permissive deserialization so invalid removed names fail clearly rather than being silently omitted.
