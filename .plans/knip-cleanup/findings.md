# Findings

- Knip's default discovery did not recognize the quoted Mocha/Mochapack globs or the Less build entry point, causing all client tests and styles to appear unused.
- The build and tests directly use `@vue/test-utils`, `jsdom`, and `spectre.css`; their initial dependency warnings were false positives caused by missing entry points.
- `chokidar` is directly imported by both watch scripts but was only available transitively, so it needs to be declared.
- `@types/uuid` is redundant because `uuid` ships its own types.
- The npm `zlib` package is unnecessary because all imports target Node's built-in `zlib` module.
- Knip should be a declared development tool with explicit application, generated-data, style, watch-script, and test entry points.
- Eighteen source/test files had no inbound references after accurate entry-point configuration; these were obsolete helpers, old Automa models, unused deferred actions, one unused component helper, and unregistered command-line tools.
- Knip's export analysis is intentionally excluded from the repeatable check: many public exports are API surface within broad model/DSL modules, and blindly converting every unreferenced export into a local declaration conflicts with TypeScript's `noUnusedLocals`. File and dependency findings are safer actionable boundaries for this cleanup.
- The root TypeScript configuration referenced an undeclared `transformer-module` plugin; TypeScript builds successfully without this obsolete configuration.
