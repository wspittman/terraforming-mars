# Findings

- Placeholder bots were already resolved centrally for initial research, drafting, and card purchase through `resolvePlaceholderBotInputs`.
- Bot action handling previously passed immediately at the start of `Player.takeAction`.
- Standard actions expose `canAct` and `action`; standard projects expose `canAct`, adjusted costs, and `payAndExecute`.
- Tile-producing actions return or defer `SelectSpace`, so a shared input resolver can make all tile placement random without duplicating placement rules.
- A bot strategy name must be stored on `Player` and `SerializedPlayer` so saves retain the strategy selected at game setup.
