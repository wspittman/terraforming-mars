import CreateGameForm from '@/client/components/create/CreateGameForm.vue';
import { CreateGameSettingsStorage } from '@/client/components/create/CreateGameSettingsStorage';
import { BoardName } from '@/common/boards/BoardName';
import { RandomMAOptionType } from '@/common/ma/RandomMAOptionType';
import { JSONObject } from '@/common/Types';
import { mount, shallowMount } from '@vue/test-utils';
import { expect } from 'chai';
import { defineComponent } from 'vue';
import { FakeLocalStorage } from '../FakeLocalStorage';
import { globalConfig } from '../getLocalVue';

// Minimal serialized Create Game payload used by settings restore tests.
function createGameSettings(overrides: JSONObject = {}): JSONObject {
  return {
    players: [
      {name: 'Alice', color: 'red', beginner: false, handicap: 0},
      {name: 'Bob', color: 'blue', beginner: false, handicap: 0},
    ],
    corporateEra: true,
    board: 'hellas',
    draftVariant: false,
    ...overrides,
  };
}

describe('CreateGameForm', () => {
  let localStorage: FakeLocalStorage;

  beforeEach(() => {
    localStorage = new FakeLocalStorage();
    FakeLocalStorage.register(localStorage);
  });

  afterEach(() => {
    FakeLocalStorage.deregister(localStorage);
  });

  it('mounts without errors', () => {
    const wrapper = shallowMount(CreateGameForm, {
      ...globalConfig,
    });
    expect(wrapper.exists()).to.be.true;
  });

  it('does not show unsupported game options', () => {
    const wrapper = shallowMount(CreateGameForm, {
      ...globalConfig,
    });

    expect(wrapper.text()).not.to.include('Game Version');
    expect(wrapper.find('#corporateEra-checkbox').exists()).to.be.false;
    expect(wrapper.find('#escapevelocity-checkbox').exists()).to.be.false;
    expect(wrapper.find('#shuffleMap-checkbox').exists()).to.be.false;
    expect(wrapper.find('#randomMA-checkbox').exists()).to.be.false;
    expect(wrapper.find('#fastMode-checkbox').exists()).to.be.false;
    expect(wrapper.find('.player-handicap').exists()).to.be.false;
  });

  it('restores the last saved game settings on load', async () => {
    new CreateGameSettingsStorage(localStorage).saveSettings(createGameSettings({
      corporateEra: false,
      escapeVelocity: {
        thresholdMinutes: 30,
        bonusSectionsPerAction: 2,
        penaltyPeriodMinutes: 2,
        penaltyVPPerPeriod: 1,
      },
      fastModeOption: true,
      randomMA: RandomMAOptionType.LIMITED,
      shuffleMapOption: true,
      players: [
        {name: 'Alice', color: 'red', beginner: false, handicap: 3},
        {name: 'Bob', color: 'blue', beginner: false, handicap: 2},
      ],
    }));

    const wrapper = shallowMount(CreateGameForm, {
      ...globalConfig,
    });
    await wrapper.vm.$nextTick();

    expect((wrapper.vm as any).playersCount).eq(2);
    expect((wrapper.vm as any).players[0].name).eq('Alice');
    expect((wrapper.vm as any).players[1].name).eq('Bob');
    expect((wrapper.vm as any).board).eq(BoardName.THARSIS);
    expect((wrapper.vm as any).draftVariant).eq(false);
    expect((wrapper.vm as any).expansions.corpera).eq(true);
    expect((wrapper.vm as any).escapeVelocityMode).eq(undefined);
    expect((wrapper.vm as any).fastModeOption).eq(undefined);
    expect((wrapper.vm as any).randomMA).eq(undefined);
    expect((wrapper.vm as any).shuffleMapOption).eq(undefined);
    expect((wrapper.vm as any).players.every((player: {handicap: number}) => player.handicap === 0)).eq(true);
  });

  it('shows warnings when restoring saved settings', async () => {
    const alerts: Array<{title: string, message: string}> = [];
    const Root = defineComponent({
      components: {
        CreateGameForm,
      },
      template: '<CreateGameForm ref="form" />',
    });
    const wrapper = mount(Root, {
      ...globalConfig,
    });
    const form = wrapper.findComponent(CreateGameForm);
    (form.vm.$root as any).showAlert = (title: string, message: string) => {
      alerts.push({title, message});
    };

    new CreateGameSettingsStorage(localStorage).saveSettings(createGameSettings({
      bannedCards: ['Bad Card Name'],
    }));

    (form.vm as any).restoreLastSettings();
    await form.vm.$nextTick();

    expect(alerts).deep.eq([{
      title: 'Restore settings',
      message: "Settings loaded with these warnings: \nUnknown card name 'Bad Card Name' in bannedCards",
    }]);
  });

  it('resets the form and clears saved settings', async () => {
    const settingsStorage = new CreateGameSettingsStorage(localStorage);
    settingsStorage.saveSettings(createGameSettings());

    const wrapper = shallowMount(CreateGameForm, {
      ...globalConfig,
    });
    await wrapper.vm.$nextTick();

    expect((wrapper.vm as any).board).eq(BoardName.THARSIS);

    (wrapper.vm as any).resetSettings();
    await wrapper.vm.$nextTick();

    expect((wrapper.vm as any).board).eq(BoardName.THARSIS);
    expect((wrapper.vm as any).draftVariant).eq(true);
    expect(settingsStorage.loadSettings()).eq(undefined);
    expect(wrapper.findAllComponents({name: 'AppButton'}).map((button) => button.props('title'))).includes('Reset');
  });

  it('clears uploading when applying settings throws', () => {
    const wrapper = shallowMount(CreateGameForm, {
      ...globalConfig,
    });

    expect(() => (wrapper.vm as any).applySettings(createGameSettings({
      players: [
        {name: 'Alice', color: 'red', beginner: false, handicap: 0},
        {name: 'Bob', color: 'red', beginner: false, handicap: 0},
      ],
    }))).throws('Colors are duplicated');
    expect((wrapper.vm as any).uploading).eq(false);
  });

  it('saves current settings before creating a game', async () => {
    const originalFetch = global.fetch;
    const originalAlert = global.alert;
    global.fetch = (() => Promise.reject(new Error('stop after saving'))) as typeof fetch;
    global.alert = (() => {}) as typeof alert;

    try {
      const wrapper = shallowMount(CreateGameForm, {
        ...globalConfig,
      });
      (wrapper.vm as any).playersCount = 2;
      (wrapper.vm as any).randomFirstPlayer = false;
      (wrapper.vm as any).players[0].name = 'Alice';
      (wrapper.vm as any).players[1].name = 'Bob';

      await (wrapper.vm as any).createGame();

      const savedSettings = new CreateGameSettingsStorage(localStorage).loadSettings();
      expect(savedSettings?.board).eq(BoardName.THARSIS);
      expect(savedSettings?.corporateEra).eq(true);
      expect(savedSettings?.expansions).eq(undefined);
      expect((savedSettings?.players as Array<{name: string}>).map((player) => player.name)).deep.eq(['Alice', 'Bob']);
    } finally {
      global.fetch = originalFetch;
      global.alert = originalAlert;
    }
  });
});
