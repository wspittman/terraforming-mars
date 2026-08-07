import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import GameSetupDetail from '@/client/components/GameSetupDetail.vue';
import {fakeGameOptionsModel} from './testHelpers';

describe('GameSetupDetail', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(GameSetupDetail, {
      ...globalConfig,
      props: {
        playerNumber: 2,
        gameOptions: fakeGameOptionsModel(),
        lastSoloGeneration: 14,
      },
    });
    expect(wrapper.exists()).to.be.true;
    expect(wrapper.text()).to.include('Game Version:');
    expect(wrapper.text()).to.include('Corporate Era');
    expect(wrapper.text()).to.not.include('Venus');
    expect(wrapper.text()).to.not.include('Prelude');
    expect(wrapper.text()).to.not.include('Turmoil');
  });
});
