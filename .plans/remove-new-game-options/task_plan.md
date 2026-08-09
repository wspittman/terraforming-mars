# Remove unused new-game options

## Goal

Remove Escape Velocity, randomized board tiles, random milestones/awards, Fast Mode, TR Boost, and the Game Version selector from `/new-game`, while preserving the fork's fixed Base + Corporate Era setup.

## Phases

1. **Discover form implementation and coverage** — complete
2. **Remove controls and obsolete form-only code** — complete
3. **Verify behavior, update documentation if needed, and commit** — complete
4. **Remove obsolete create-form state and settings compatibility code** — complete
5. **Assess shared engine removal separately** — pending

## Key questions

- Which template controls and script properties exist solely for the removed UI?
- Does removing the Game Version selector require explicitly fixing `corporateEra` to `true`?
- Which focused client tests cover the create-game form?

## Decisions

- Limit visible UI removal to `CreateGameForm.vue`; similarly named game-summary and help sections are not part of `/new-game`.
- Normalize restored settings for removed controls so an old local settings payload cannot silently enable options that no longer have controls.
- Keep the shared configuration types and server support intact; this change removes fork-specific choices from game creation rather than performing a broad engine deletion.
- Follow-up feedback requests removal of code made unnecessary by the deleted controls. Phase 4 will remove create-form state, parsing, and helper code while continuing to send the fixed values required by the existing server contract.

## Phase 4 outcome

- Removed deleted-option properties from the create-game model and defaults.
- Removed legacy Corporate Era and Escape Velocity parsing, the solo Corporate Era confirmation, and form-level normalization assignments.
- The form now sends fixed values directly for the existing API contract; settings loading ignores those fixed API fields and clears player handicaps.
- Removed now-unreferenced wiki links and Escape Velocity form defaults.
- Per the repository workflow, phase 5 remains pending for feedback before considering broader shared engine deletion.

## Errors Encountered

| Error | Attempt | Resolution |
| --- | --- | --- |
| None | — | — |
| A combined cleanup patch did not match template whitespace | 1 | Applied the functional test edit separately and used a whitespace-specific cleanup. |
| Focused client test could not compile because generated JSON files were absent | 1 | Generate the required static/card JSON before rerunning the test. |
| Phase 4 Vue type check again lacked generated settings JSON | 1 | Regenerate static JSON before rerunning type checking and focused tests. |

## Outcome

- Removed all requested controls and the Game Version area from `/new-game`.
- Old saved/uploaded settings are normalized to Base + Corporate Era with the removed variants disabled and player TR boosts cleared.
- No README or AGENTS update was needed because the documented fork scope already states Base + optional Corporate Era engine support, while this change only fixes the new-game UI configuration.
