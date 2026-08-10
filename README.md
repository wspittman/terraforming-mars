# Terraforming Mars - Solo Multiplayer Edition

This is a personal fork of [terraforming-mars/terraforming-mars](https://github.com/terraforming-mars/terraforming-mars) intended to emulate a four-player game, in the style my group plays it, but with only a single player. It is intended to only be run locally.

Other functionality from the upstream repo has been liberally removed. Only the **Base game** and optional **Corporate Era** cards are supported.

## Server bots

New multiplayer games contain one human and between one and five server-controlled placeholder bots. The create-game page configures the human and the total player count; bot names, colors, and credentials are managed entirely by the server. The original one-player solo mode remains available.

Each bot selects its first dealt corporation, keeps the first available card while drafting, buys no project cards, and passes every action round. Bot identity is stored with the game so this behavior survives a server restart. See `.plans/server-bots/task_plan.md` for the phased migration and the later removal of obsolete multi-human coordination.

Creating or loading a game opens the human player directly. The former player-link lobby and cross-player waiting indicators have been removed; bot credentials and pending inputs are not exposed to the browser.

To play, open **Create New Game**, choose **Solo** or a total of two to six players, configure the human player, and create the game. In multiplayer games, the server fills every remaining seat with a bot. The browser then opens the human player's board.

## Local setup

The project requires Node.js 22.

```bash
npm install
npm run build
npm start
```

Validation

```bash
npm run build:test
npm run lint
npm run test
```

---

# Upstream project

Rules, development documentation, and project history are available from the [upstream repository](https://github.com/terraforming-mars/terraforming-mars) and its [wiki](https://github.com/terraforming-mars/terraforming-mars/wiki).

This is an open-source online implementation of the great board game Terraforming mars. **It is not affiliated
with FryxGames, Asmodee Digital or Steam in any way.**

**Buy The Board Game**

The board game is great and this repository highly recommends [purchasing it](https://www.amazon.com/Stronghold-Games-6005SG-Terraforming-Board/dp/B01GSYA4K2) for personal use.

## License

GPLv3. See [LICENSE](LICENSE).

Board Game Icons: http://www.kenney.nl/ (Creative Commons Zero, CC0)
