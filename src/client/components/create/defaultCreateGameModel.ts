import {BoardName} from '@/common/boards/BoardName';
import {DEFAULT_EXPANSIONS} from '@/common/cards/GameModule';
import {CreateGameModel} from './CreateGameModel';

export function defaultCreateGameModel(): CreateGameModel {
  return {
    playersCount: 4,
    player: {name: '', color: 'red', beginner: false, handicap: 0},
    expansions: {...DEFAULT_EXPANSIONS},
    draftVariant: true,
    initialDraft: false,
    randomFirstPlayer: true,
    showOtherPlayersVP: false,
    // beginnerOption: false,
    showCorporationList: false,
    showBannedCards: false,
    showIncludedCards: false,
    customCorporations: [],
    bannedCards: [],
    includedCards: [],
    board: BoardName.THARSIS,
    seed: Math.random(),
    seededGame: false,
    undoOption: false,
    showTimers: true,
    removeNegativeGlobalEventsOption: false,
    startingCorporations: 2,
    soloTR: false,
    clonedGameId: undefined,
  };
}
