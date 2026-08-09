# Terraforming Mars — Solo Multiplayer Edition

This is a personal fork of [terraforming-mars/terraforming-mars](https://github.com/terraforming-mars/terraforming-mars). It emulates a multiplayer game in the style of one local play group, but is operated by a single player and is intended to run only on a local machine.

Only the **Base game** and optional **Corporate Era** cards are supported. Prelude, Prelude 2, Venus Next, Colonies, Turmoil, Promos, Ares, Community, The Moon, Pathfinders, CEOs, Star Wars, Underworld, and the Delta Project are intentionally not included.

## Local setup

The project requires Node.js 22. Install dependencies and start the development environment:

```bash
npm install
npm run dev
```

The server and client can also be started separately with `npm run dev:server` and `npm run dev:client`.

## Verification

```bash
npm run build
npm run lint
npm run test
```

## Upstream project

Rules, development documentation, and project history are available from the [upstream repository](https://github.com/terraforming-mars/terraforming-mars) and its [wiki](https://github.com/terraforming-mars/terraforming-mars/wiki).

This implementation is not affiliated with FryxGames, Asmodee Digital, or Steam. Please support the designers and publishers by purchasing the board game.

## License

GPLv3. See [LICENSE](LICENSE).
