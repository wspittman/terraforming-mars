# Hide Exhausted Global Parameter Actions

## Goal

Omit standard projects, basic actions, and card actions whose only effect is increasing an already-maximized global parameter, for human and bot players, while preserving actions with additional effects.

## Phases

1. **Research** — Identify option construction, bot selection, global-parameter warnings, and action effect representations. `complete`
2. **Design and tests** — Choose a shared eligibility rule and add focused regression tests. `complete`
3. **Implementation** — Apply filtering to standard/basic actions and card actions. `complete`
4. **Cleanup and verification** — Remove obsolete warning/no-op plumbing where safe, run relevant and broad checks, and review the diff. `complete`
5. **Delivery** — Update plan records, commit the changes, and create a pull request. `in_progress`

## Key Questions

- Is there already a common way to determine whether an action has effects beyond a global increase?
- Are human and bot options generated from the same `PlayerInput` path?
- Which warnings become unreachable once unavailable actions are omitted?
- Do maximized parameters still need execution-time guards for cards with mixed effects or direct calls?

## Errors Encountered

| Error | Attempt | Resolution |
| --- | --- | --- |
| Focused regression suite failed in six expected cases against the old behavior. | 1 | Implemented availability checks; mixed-effect Ore Processor remained green as the control case. |
| Full server suite could not load `tests/routes/ServeAsset.spec.ts` because `build/styles.css` was absent. | 1 | Build the required CSS asset before retrying the suite. |
