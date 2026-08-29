import * as constants from '../../common/constants';
import {BoardName} from '../../common/boards/BoardName';
import {CardName} from '../../common/cards/CardName';
import {GameId} from '../../common/Types';
import {EscapeVelocityOptions} from '../../common/game/NewGameConfig';

export type GameOptions = {
  boardName: BoardName;
  clonedGamedId: GameId | undefined;

  // Configuration
  undoOption: boolean;
  showTimers: boolean;
  fastModeOption: boolean;
  showOtherPlayersVP: boolean;

  corporateEra: boolean;

  // Variants
  // corporationsDraft: boolean;
  startingCorporations: number;
  shuffleMapOption: boolean;
  /** Solo victory by getting TR 63 by game end */
  soloTR: boolean;
  customCorporationsList: ReadonlyArray<CardName>;
  bannedCards: ReadonlyArray<CardName>;
  includedCards: ReadonlyArray<CardName>;
  escapeVelocity?: EscapeVelocityOptions;
  twoCorpsVariant: boolean;
}

export const DEFAULT_GAME_OPTIONS: GameOptions = {
  boardName: BoardName.THARSIS,
  bannedCards: [],
  includedCards: [],
  clonedGamedId: undefined,
  corporateEra: true,
  customCorporationsList: [],
  escapeVelocity: undefined,
  fastModeOption: false,
  showOtherPlayersVP: false,
  showTimers: true,
  shuffleMapOption: false,
  soloTR: false,
  startingCorporations: constants.CORPORATION_CARDS_DEALT_PER_PLAYER,
  undoOption: false,
  twoCorpsVariant: false,
};
