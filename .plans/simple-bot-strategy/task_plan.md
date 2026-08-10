# Simple Bot Strategy Plan

## Goal

Implement reusable bot-strategy infrastructure and a first strategy that chooses the richest corporation, drafts the first card, buys no cards, places tiles randomly, and prioritizes heat, plants, affordable standard projects, then passing.

## Phases

1. **Research existing bot/game flow** — complete
2. **Design reusable strategy boundaries and tests** — complete
3. **Implement strategy and integration** — complete
4. **Verify, document, commit, and open PR** — complete

## Key Questions

- Where do placeholder bots currently select corporations, cards, and actions?
- Which existing APIs expose valid tile spaces and available standard projects?
- How should random strategy assignment be persisted through game serialization?

## Errors Encountered

| Error | Attempt | Resolution |
| --- | --- | --- |
| Server build initially failed on generic `SelectCard` types and a missing generated settings file | 1 | Added the card generic/type annotations and generated static JSON before rebuilding. |
| Multi-file patch included a nonexistent Player import context | 1 | Split the patch and inspect exact import locations before editing. |
