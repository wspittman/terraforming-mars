import {IPlayer} from '@/server/IPlayer';
import {getBotStrategy} from './BotStrategy';

/** Resolves the setup, draft, and research inputs used by placeholder bots. */
export function resolvePlaceholderBotInputs(players: ReadonlyArray<IPlayer>): void {
  for (const player of players) {
    if (!player.isBot) {
      continue;
    }
    const input = player.getWaitingFor();
    if (input !== undefined) {
      player.process(getBotStrategy(player.botStrategy).selectInput(input, player.game.rng));
    }
  }
}
