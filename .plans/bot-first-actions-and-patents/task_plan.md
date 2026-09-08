# Bot first actions and patent sales

## Goal

Ensure bots take corporation-specific first actions and sell otherwise-unused cards from their hands.

## Phases

1. **Research** (complete): Locate bot turn/input logic, corporation first-action handling, and existing tests.
2. **Implement and test** (complete): Add focused behavior and Mocha coverage for both scenarios.
3. **Verify and deliver** (complete): Run required lint, test, and build commands; review, commit, and open a pull request.

## Key questions

- How are mandatory corporation first actions represented in the bot's player inputs?
- Does patent selling require one action per card or support selling the full hand at once?
- Which existing bot tests provide the best regression-test structure?

## Errors encountered

| Error | Attempt | Resolution |
| --- | --- | --- |
| Patent-sale regression left the hand unchanged because the setup game had already marked the bot as passed. | 1 | Adjust the test to exercise the strategy directly, isolating patent-sale behavior from turn-state setup. |
| `npm run build` found that `SelectCard.process` accepts one argument on the concrete class, not the two arguments allowed by the interface. | 1 | Removed the unnecessary player argument from the concrete call. |
| `npm run test` client compilation could not find generated JSON files after the earlier parallel build/test commands raced over generated assets. | 1 | Run the full build first to restore generated assets, then rerun the test suite sequentially. |
