import {RecursivePartial} from '@/common/utils/utils';
import {PublicPlayerModel, PlayerViewModel, ViewModel} from '@/common/models/PlayerModel';
import {GameModel} from '@/common/models/GameModel';
import {GameOptionsModel} from '@/common/models/GameOptionsModel';
import {TimerModel} from '@/common/models/TimerModel';
import {Phase} from '@/common/Phase';
import {RandomMAOptionType} from '@/common/ma/RandomMAOptionType';
import {BoardName} from '@/common/boards/BoardName';
import {Color} from '@/common/Color';
import {Resource} from '@/common/Resource';
import {Tag} from '@/common/cards/Tag';
import {Protection} from '@/common/models/PlayerModel';
import {SpectatorModel} from '@/common/models/SpectatorModel';

function emptyProtection(): Record<Resource, Protection> {
  return {
    megacredits: 'off',
    steel: 'off',
    titanium: 'off',
    plants: 'off',
    energy: 'off',
    heat: 'off',
  } satisfies Record<Resource, Protection>;
}

export function emptyTags(): Record<Tag, number> {
  const tags: Partial<Record<Tag, number>> = {};
  for (const tag of Object.values(Tag)) {
    tags[tag] = 0;
  }
  return tags as Record<Tag, number>;
}

export function fakeTimerModel(): TimerModel {
  return {
    sumElapsed: 0,
    startedAt: 0,
    running: false,
    afterFirstAction: false,
    lastStoppedAt: 0,
  };
}

export function fakeGameOptionsModel(overrides?: RecursivePartial<GameOptionsModel>): GameOptionsModel {
  return {
    boardName: BoardName.THARSIS,
    corporateEra: true,
    bannedCards: [],
    draftVariant: false,
    fastModeOption: false,
    includedCards: [],
    initialDraftVariant: false,
    showOtherPlayersVP: false,
    showTimers: false,
    shuffleMapOption: false,
    soloTR: false,
    randomMA: RandomMAOptionType.NONE,
    twoCorpsVariant: false,
    undoOption: false,
    ...overrides,
  } as GameOptionsModel;
}

export function fakeGameModel(overrides?: RecursivePartial<GameModel>): GameModel {
  return {
    awards: [],
    deckSize: 0,
    discardPileSize: 0,
    expectedPurgeTimeMs: 0,
    gameAge: 0,
    gameOptions: fakeGameOptionsModel(),
    generation: 1,
    globalsPerGeneration: [],
    isSoloModeWin: false,
    lastSoloGeneration: 14,
    milestones: [],
    oceans: 0,
    oxygenLevel: 0,
    passedPlayers: [],
    phase: Phase.ACTION,
    spaces: [],
    step: 0,
    temperature: -30,
    isTerraformed: false,
    undoCount: 0,
    ...overrides,
  } as GameModel;
}

export function fakePublicPlayerModel(overrides?: RecursivePartial<PublicPlayerModel>): PublicPlayerModel {
  return {
    actionsTakenThisRound: 0,
    actionsThisGeneration: [],
    actionsTakenThisGame: 0,
    availableBlueCardActionCount: 0,
    cardCost: 0,
    cardsInHandNbr: 0,
    citiesCount: 0,
    color: 'blue' as Color,
    energy: 0,
    energyProduction: 0,
    handicap: undefined,
    heat: 0,
    heatProduction: 0,
    id: 'p-blue-id' as any,
    isActive: false,
    megacredits: 0,
    megacreditProduction: 0,
    name: 'blue',
    needsToDraft: undefined,
    needsToResearch: undefined,
    noTagsCount: 0,
    plants: 0,
    plantProduction: 0,
    protectedResources: emptyProtection(),
    protectedProduction: emptyProtection(),
    tableau: [],
    selfReplicatingRobotsCards: [],
    steel: 0,
    steelProduction: 0,
    steelValue: 2,
    terraformRating: 20,
    timer: fakeTimerModel(),
    titanium: 0,
    titaniumProduction: 0,
    titaniumValue: 3,
    victoryPointsBreakdown: {
      terraformRating: 20,
      milestones: 0,
      awards: 0,
      greenery: 0,
      city: 0,
      escapeVelocity: 0,
      moonHabitats: 0,
      moonMines: 0,
      moonRoads: 0,
      planetaryTracks: 0,
      victoryPoints: 0,
      total: 20,
      detailsCards: [],
      detailsMilestones: [],
      detailsAwards: [],
    },
    victoryPointsByGeneration: [],
    globalParameterSteps: {},
    ...overrides,
  } as PublicPlayerModel;
}

export function fakePlayerViewModel(overrides?: RecursivePartial<PlayerViewModel>): PlayerViewModel {
  const thisPlayer = fakePublicPlayerModel();
  return {
    autopass: false,
    cardsInHand: [],
    dealtCorporationCards: [],
    dealtProjectCards: [],
    draftedCards: [],
    id: 'p-blue-id' as any,
    pickedCorporationCard: [],
    thisPlayer,
    waitingFor: undefined,
    game: fakeGameModel(),
    players: [thisPlayer],
    runId: 'run-id',
    ...overrides,
  } as PlayerViewModel;
}

export function fakeSpectatorModel(): SpectatorModel {
  return {
    ...fakeViewModel(),
    id: 'spectator-id',
    color: 'neutral',
  };
}

export function fakeViewModel(overrides?: RecursivePartial<ViewModel>): ViewModel {
  const thisPlayer = fakePublicPlayerModel();
  return {
    game: fakeGameModel(),
    players: [thisPlayer],
    id: 'p-blue-id',
    thisPlayer,
    runId: 'run-id',
    ...overrides,
  } as ViewModel;
}
