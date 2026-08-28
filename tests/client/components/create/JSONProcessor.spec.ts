import { CreateGameModel } from '@/client/components/create/CreateGameModel';
import { defaultCreateGameModel } from '@/client/components/create/defaultCreateGameModel';
import { JSONProcessor } from '@/client/components/create/JSONProcessor';
import { BoardName } from '@/common/boards/BoardName';
import { CardName } from '@/common/cards/CardName';
import { JSONObject } from '@/common/Types';
import { expect } from 'chai';

type Case = {
  description: string,
  input: JSONObject,
  expected: CreateGameModel,
  expectedWarnings?: Array<string>,
}

const TEMPLATE_INPUT = {
  player: {
    name: 'You',
    color: 'red',
    beginner: false,
    handicap: 4,
  },
  playerCount: 4,
  corporateEra: false,

  showOtherPlayersVP: false,
  customCorporations: [],
  bannedCards: [],
  includedCards: [],
  board: 'tharsis',
  seed: 0.40189423667985547,
  undoOption: false,
  showTimers: true,
  fastModeOption: false,
  removeNegativeGlobalEventsOption: false,
  startingCorporations: 2,
  soloTR: false,
  shuffleMapOption: false,
  randomFirstPlayer: true,
  escapeVelocity: {
    thresholdMinutes: 35,
    bonusSectionsPerAction: 2,
    penaltyPeriodMinutes: 2,
    penaltyVPPerPeriod: 1,
  },
};

const TEMPLATE_EXPECTED: CreateGameModel = {
  playersCount: 4,
  player: {name: 'You', color: 'red', beginner: false, handicap: 0},
  expansions: {corpera: true},
  randomFirstPlayer: true,
  showOtherPlayersVP: false,
  showCorporationList: false,
  showBannedCards: false,
  clonedGameId: undefined,
  showIncludedCards: false,
  customCorporations: [],
  bannedCards: [],
  includedCards: [],
  board: 'tharsis' as BoardName,
  seed: 0.40189423667985547,
  seededGame: false,
  undoOption: false,
  showTimers: true,
  removeNegativeGlobalEventsOption: false,
  startingCorporations: 2,
  soloTR: false,
};

const cases: Array<Case> = [
  {
    description: 'sanity',
    input: TEMPLATE_INPUT,
    expected: TEMPLATE_EXPECTED,
  },
  {
    description: 'custom corporation list',
    input: {
      ...TEMPLATE_INPUT,
      customCorporations: [CardName.ECOLINE],
    }, expected: {
      ...TEMPLATE_EXPECTED,
      customCorporations: [CardName.ECOLINE],
    },
  },
  {
    description: 'warns on unrecognized card names in custom lists',
    input: {
      ...TEMPLATE_INPUT,
      customCorporations: ['Thorgate', 'EcoLine', CardName.ECOLINE],
      bannedCards: ['Bad Card Name'],
    },
    expected: {
      ...TEMPLATE_EXPECTED,
      customCorporations: ['Thorgate', 'EcoLine', CardName.ECOLINE] as Array<CardName>,
      bannedCards: ['Bad Card Name'] as unknown as Array<CardName>,
      showBannedCards: true,
    },
    expectedWarnings: [
      "Unknown card name 'Thorgate' in customCorporations",
      "Unknown card name 'EcoLine' in customCorporations",
      "Unknown card name 'Bad Card Name' in bannedCards",
    ],
  },
];


describe('JSONProcessor', () => {
  for (const testCase of cases) {
    it(testCase.description, () => {
      const model = defaultCreateGameModel();
      const processor = new JSONProcessor(model);
      processor.applyJSON(testCase.input);

      expect(processor.warnings).deep.eq(testCase.expectedWarnings ?? []);
      expect(model).deep.eq(testCase.expected);
    });
  }
});
