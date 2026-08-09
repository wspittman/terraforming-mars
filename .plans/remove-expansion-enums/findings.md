# Findings

- The requested scope is Base game plus Corporate Era only; expansion and fan-made features must not be restored.
- Primary targets are nine common enum/type files named by the user, plus their obsolete dependents.
- Base/Corporate Era tags are building, space, science, power, Earth, Jovian, plant, microbe, animal, city, and event.
- The first 17 numeric tile types (0-16) are the retained Base/Corporate Era tile types. Numeric ordering must remain stable because tile types are serialized by number.
- `CardType.PROXY` is not an expansion card type; it supports internal card-like operations and must remain.
- Current server build initially fails because generated `genfiles/settings.json` is absent, before reaching source type checking.
- Removing obsolete enum values exposed dead renderer helpers, client presentation maps, special tile handling, tag substitution rules, and expansion-only tests; these were removed rather than left as unreachable branches.
- The retained internal proxy card type is still required by serialization and card-like operations, while Prelude and CEO card types and phases have no retained cards.
