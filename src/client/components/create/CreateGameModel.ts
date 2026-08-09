import {CardName} from '@/common/cards/CardName';
import {RandomMAOptionType} from '@/common/ma/RandomMAOptionType';
import {GameId} from '@/common/Types';
import {BoardNameType, NewPlayerModel} from '@/common/game/NewGameConfig';
import {Expansion} from '@/common/cards/GameModule';

export type CreateGameModel = {
  /* A checkbox when selected selects all official expansions */
  bannedCards: Array<CardName>;
  board: BoardNameType;
  clonedGameId: GameId | undefined;
  customCorporations: Array<CardName>;
  draftVariant: boolean;
  escapeVelocityBonusSeconds: number;
  escapeVelocityMode: boolean;
  escapeVelocityPenalty: number;
  escapeVelocityPeriod: number;
  escapeVelocityThreshold: number;
  expansions: Record<Expansion, boolean>,
  fastModeOption: boolean;
  firstIndex: number;
  includedCards: Array<CardName>;
  includeFanMA: boolean;
  initialDraft: boolean;
  modularMA: boolean;
  players: Array<NewPlayerModel>;
  playersCount: number;
  randomFirstPlayer: boolean;
  randomMA: RandomMAOptionType;
  removeNegativeGlobalEventsOption: boolean;
  seed: number;
  seededGame: boolean;
  showBannedCards: boolean;
  showCorporationList: boolean;
  showIncludedCards: boolean;
  showOtherPlayersVP: boolean;
  showTimers: boolean;
  shuffleMapOption: boolean;
  soloTR: boolean;
  startingCorporations: number;
  undoOption: boolean;
}
