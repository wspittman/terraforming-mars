# Findings

- Option availability is driven by `canAct`: `Player` builds standard action options from `ConvertPlants`/`ConvertHeat`, standard projects expose enabled states, bot utilities filter projects through `canAct`, and played card actions are filtered through `card.canAct`.
- Current temperature/ocean-only standard choices add warnings but return true when otherwise affordable (`ConvertHeat`, `AsteroidStandardProject`, `AquiferStandardProject`). Greenery/Convert Plants intentionally remain usable at max oxygen because they place greenery.
- Declarative card actions are evaluated by the behavior executor, which currently adds global-maximum warnings while allowing execution. This is the likely shared location for distinguishing pure no-ops from mixed-effect actions.
- Execution-time guards in `Game` cap global increases and should remain for mixed effects, races/stale inputs, and direct calls.
- The retained imperative pure-global card actions are Aquifer Pumping and Water Import From Europa (oceans); the remaining temperature/oxygen actions use declarative `ActionCard` behavior.
- A declarative action is omitted only when its effect consists of a spent cost plus exhausted positive global/ocean effects. Any stock, production, tile, resource, or other effect keeps it available, as do negative global changes and unmaximized parameters.
