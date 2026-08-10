import {InputResponse} from '@/common/inputs/InputResponse';
import {IPlayer} from '@/server/IPlayer';
import {PlayerInput} from '@/server/PlayerInput';
import {SelectInitialCards} from '@/server/inputs/SelectInitialCards';
import {SelectCard} from '@/server/inputs/SelectCard';

/** Resolves the setup, draft, and research inputs used by placeholder bots. */
export function resolvePlaceholderBotInputs(players: ReadonlyArray<IPlayer>): void {
  for (const player of players) {
    if (!player.isBot) {
      continue;
    }
    const input = player.getWaitingFor();
    if (input !== undefined) {
      player.process(responseFor(input));
    }
  }
}

function responseFor(input: PlayerInput): InputResponse {
  if (input instanceof SelectInitialCards) {
    const corporation = input.player.dealtCorporationCards[0];
    if (corporation === undefined) {
      throw new Error(`Placeholder bot ${input.player.id} has no corporation to select`);
    }
    return {
      type: 'initialCards',
      responses: [
        {type: 'card', cards: [corporation.name]},
        {type: 'card', cards: []},
      ],
    };
  }
  if (input instanceof SelectCard) {
    const card = input.cards.find((_, index) => input.config.enabled?.[index] !== false);
    const cards = input.config.min === 0 ? [] : card === undefined ? [] : [card.name];
    return {type: 'card', cards};
  }
  throw new Error(`Placeholder bot cannot resolve ${input.type} input`);
}
