import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import GameBoardView from '@/client/components/GameBoardView.vue';
import {fakeGameModel} from './testHelpers';

describe('GameBoardView', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(GameBoardView, {
      ...globalConfig,
      props: {
        game: fakeGameModel(),
        tileView: 'show',
        players: [],
      },
    });
    expect(wrapper.exists()).to.be.true;
    expect(wrapper.findComponent({name: 'Turmoil'}).exists()).to.be.false;
    expect(wrapper.findComponent({name: 'MoonBoard'}).exists()).to.be.false;
    expect(wrapper.findComponent({name: 'PlanetaryTracks'}).exists()).to.be.false;
    expect(wrapper.findComponent({name: 'DeltaProjectBoard'}).exists()).to.be.false;
  });
});
