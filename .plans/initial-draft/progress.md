# Progress

## 2026-08-11

- Created the task plan and began discovery.
- Traced the draft engine, game lifecycle, request/config model, serialization, setup UI, and existing draft tests.
- Decided to keep solo games non-drafting, run one ten-card initial draft toward `before`, and delete both variant flags plus the obsolete initial iteration state.
- Implemented the mandatory draft lifecycle and removed draft settings/state across server and client. Initial compilation exposed a missing generated settings file in the environment.
- Replaced the former two-player/two-batch initial draft test with a three-player test proving ten-card dealing, the opposite pass direction, and delayed buying.
- Updated the help text and removed obsolete setup-detail, settings, model, serialization, restore, and wiki-link code.
- Focused server and client tests pass, TypeScript builds pass after generating ignored prerequisites, and the full lint suite passes.
- Completed final diff checks and verification; ready to commit and open the pull request.
