# Findings

## Initial constraints

- Only the default Tharsis board may remain.
- Expansion and fan-made boards must not remain available or registered.
- The repository is a local-only personal fork, so compatibility layers for unsupported boards are unnecessary unless persisted-game loading requires a deliberate error path.


## Inventory

- Eight boards were registered: Tharsis, Hellas, Elysium, Utopia Planitia, Vastitas Borealis Nova, Arabia Terra, Vastitas Borealis, and Hollandia.
- Amazonis and two Terra Cimmeria implementations also remained on disk despite not being registered.
- Multiple-board support also included random-board request values, a board picker, map-specific SVG labels, special placement bonuses/costs, board-specific milestone/award sets, and legacy board-name normalization.
- The safest local-fork behavior is to make new-game creation unconditionally select Tharsis; a client-supplied or stale saved setting must not reactivate an unsupported map.
