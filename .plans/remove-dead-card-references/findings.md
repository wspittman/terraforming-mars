# Findings

## Scope

- Only Base game and optional Corporate Era cards/corporations should remain.
- Only the default Tharsis milestones, awards, board rules, UI, and assets are relevant.
- Expansion names must not be restored merely to make TypeScript compile.

## Discoveries

- The initial server/test builds contained hundreds of references to removed expansion, promo, CEO, Moon, Pathfinders, Underworld, Ares, and fan cards.
- Six unresolved names belonged to numbered Base cards whose implementations and tests remained: Industrial Center (#123), Zeppelins (#129), Worms (#130), Wave Power (#139), Windmills (#168), and Water Splitting Plant (#177). Their enum values needed restoration.
- The server still contained expansion-only hooks in drafting, payment, protection, tags, global requirements, tile placement, victory scoring, board placement, and corporation/card interactions.
- Client type checking exposed additional dead corporation logos, help text, standard-project lists, initial-card bonuses, payment types, and active-card sorting entries that webpack alone did not report.
- The awards registry still exposed non-Tharsis and modular awards even though alternate boards had already been removed.
- Full static generation is required before the standalone server TypeScript build can import `genfiles/settings.json`.

## Decisions

- Payment resources now cover only retained resource mechanisms; removed corporation-specific currencies no longer travel through payment validation or UI selection.
- Corporation logo rendering uses retained CSS/image class dispatch with a simple title fallback; hundreds of dead bespoke fan-logo template lines were removed.
- Legacy serialized tile enum values remain representable, but labels no longer depend on deleted card enum values.
- Planning files are retained with the implementation to document this broad cleanup.
