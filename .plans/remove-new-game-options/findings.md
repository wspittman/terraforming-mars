# Findings

- The requested controls are rendered in `src/client/components/create/CreateGameForm.vue`.
- Existing game-detail and help displays also use the phrase “Game Version,” but the request specifically identifies the area on `/new-game`; discovery will determine whether they are in scope.
- `CreateGameForm.vue` restores locally saved/uploaded settings, so merely deleting markup could leave removed options active without any visible way to disable them.
- Corporate Era defaults to enabled, but the settings processor can restore `corporateEra: false`; fixed Base + Corporate Era behavior therefore needs normalization after applying settings.
- The closest test is `tests/client/components/create/CreateGameForm.spec.ts`, using Mocha, Chai, and Vue Test Utils.
- The server request contract still requires the removed option fields, so the create form must send fixed values until a separate engine/API cleanup phase changes that contract.
- Escape Velocity constants and the five related wiki links became unreferenced after create-form state was removed.
