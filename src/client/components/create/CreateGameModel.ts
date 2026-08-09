import {CardName} from '@/common/cards/CardName';
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
  expansions: Record<Expansion, boolean>,
  firstIndex: number;
  includedCards: Array<CardName>;
  initialDraft: boolean;
  players: Array<NewPlayerModel>;
  playersCount: number;
  randomFirstPlayer: boolean;
  removeNegativeGlobalEventsOption: boolean;
  seed: number;
  seededGame: boolean;
  showBannedCards: boolean;
  showCorporationList: boolean;
  showIncludedCards: boolean;
  showOtherPlayersVP: boolean;
  showTimers: boolean;
  soloTR: boolean;
  startingCorporations: number;
  undoOption: boolean;
}
