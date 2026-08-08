import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import GameEnd from '@/client/components/GameEnd.vue';
import {fakePlayerViewModel, fakeSpectatorModel} from './testHelpers';

describe('GameEnd', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(GameEnd, {
      ...globalConfig,
      props: {
        playerView: fakePlayerViewModel(),
        spectator: fakeSpectatorModel(),
      },
    });
    expect(wrapper.exists()).to.be.true;
    expect(wrapper.findComponent({name: 'MoonBoard'}).exists()).to.be.false;
    expect(wrapper.findComponent({name: 'PlanetaryTracks'}).exists()).to.be.false;
  });
});
