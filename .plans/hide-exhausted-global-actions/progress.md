# Progress

## 2026-08-11

- Created the implementation plan.
- Began tracing standard choices, bot filtering, and declarative action validation.
- Added focused regression coverage and confirmed six tests fail under the old availability behavior.
- Implemented pure-global availability checks for standard projects, Convert Heat, declarative action cards, and imperative ocean action cards.
- Removed now-unreachable Convert Heat warning/default-selection plumbing and kept unaffordable standard projects disabled while omitting only exhausted pure-global projects.
- Focused tests, test TypeScript build, server lint, and diff whitespace checks pass.
- Initial full server test attempt stopped during test loading because the generated CSS asset was missing.
- Generated the required CSS and reran the full server suite successfully (1,403 passing).
- Completed cleanup and final diff review; no README or AGENTS updates are needed because behavior and development workflows remain accurately documented.
