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
  players: [
    {
      name: 'You',
      color: 'red',
      beginner: false,
      handicap: 4,
      first: false,
    },
  ],
  corporateEra: false,

  draftVariant: true,
  showOtherPlayersVP: false,
  customCorporationsList: [],
  bannedCards: [],
  includedCards: [],
  board: 'tharsis',
  seed: 0.40189423667985547,
  undoOption: false,
  showTimers: true,
  fastModeOption: false,
  removeNegativeGlobalEventsOption: false,
  includeFanMA: false,
  modularMA: false,
  startingCorporations: 2,
  soloTR: false,
  initialDraft: false,
  randomMA: 'No randomization',
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
  firstIndex: 1,
  playersCount: 1,
  players: [
    {name: 'You', color: 'red', beginner: false, handicap: 0, first: false},
    {name: '', color: 'green', beginner: false, handicap: 0, first: false},
    {name: '', color: 'yellow', beginner: false, handicap: 0, first: false},
    {name: '', color: 'blue', beginner: false, handicap: 0, first: false},
    {name: '', color: 'black', beginner: false, handicap: 0, first: false},
    {name: '', color: 'purple', beginner: false, handicap: 0, first: false},
    {name: '', color: 'orange', beginner: false, handicap: 0, first: false},
    {name: '', color: 'pink', beginner: false, handicap: 0, first: false},
  ],
  expansions: {corpera: true},
  draftVariant: true,
  initialDraft: false,
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
    description: 'outdated custom corporation list',
    input: {
      ...TEMPLATE_INPUT,
      customCorporationsList: [CardName.ECOLINE],
    }, expected: {
      ...TEMPLATE_EXPECTED,
      customCorporations: [CardName.ECOLINE],
    },
  },
  {
    description: 'warns on unrecognized card names in custom lists',
    input: {
      ...TEMPLATE_INPUT,
      // 'Thorgate' and 'EcoLine' are old names; CardName.ECOLINE is canonical and should not warn
      customCorporationsList: ['Thorgate', 'EcoLine', CardName.ECOLINE],
      bannedCards: ['Bad Card Name'],
    },
    expected: {
      ...TEMPLATE_EXPECTED,
      customCorporations: ['Thorgate', 'EcoLine', CardName.ECOLINE] as Array<CardName>,
      bannedCards: ['Bad Card Name'] as unknown as Array<CardName>,
      showBannedCards: true,
    },
    expectedWarnings: [
      "Old card name 'Thorgate' in customCorporations; use 'ThorGate'",
      "Old card name 'EcoLine' in customCorporations; use 'Ecoline'",
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
