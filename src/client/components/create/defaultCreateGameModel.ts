import {BoardName} from '@/common/boards/BoardName';
import {DEFAULT_EXPANSIONS} from '@/common/cards/GameModule';
import {CreateGameModel} from './CreateGameModel';

export function defaultCreateGameModel(): CreateGameModel {
  return {
    firstIndex: 1,
    playersCount: 1,
    players: [
      {name: '', color: 'red', beginner: false, handicap: 0, first: false},
      {name: '', color: 'green', beginner: false, handicap: 0, first: false},
      {name: '', color: 'yellow', beginner: false, handicap: 0, first: false},
      {name: '', color: 'blue', beginner: false, handicap: 0, first: false},
      {name: '', color: 'black', beginner: false, handicap: 0, first: false},
      {name: '', color: 'purple', beginner: false, handicap: 0, first: false},
      {name: '', color: 'orange', beginner: false, handicap: 0, first: false},
      {name: '', color: 'pink', beginner: false, handicap: 0, first: false},
    ],
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
