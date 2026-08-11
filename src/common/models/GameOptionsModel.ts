import {BoardName} from '../boards/BoardName';
import {RandomMAOptionType} from '../ma/RandomMAOptionType';
import {CardName} from '../cards/CardName';
import {EscapeVelocityOptions} from '../game/NewGameConfig';

export type GameOptionsModel = {
  boardName: BoardName,
  bannedCards: ReadonlyArray<CardName>;
  corporateEra: boolean,
  escapeVelocity?: EscapeVelocityOptions,
  fastModeOption: boolean,
  includedCards: ReadonlyArray<CardName>;
  showOtherPlayersVP: boolean,
  showTimers: boolean,
  shuffleMapOption: boolean,
  soloTR: boolean,
  randomMA: RandomMAOptionType,
  twoCorpsVariant: boolean,
  undoOption: boolean,
}
