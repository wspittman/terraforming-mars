import {shallowMount, VueWrapper, DOMWrapper} from '@vue/test-utils';
import {globalConfig} from '../getLocalVue';
import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import PlayerTags from '@/client/components/overview/PlayerTags.vue';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {RecursivePartial} from '@/common/utils/utils';
import {Tag} from '@/common/cards/Tag';
import {SpecialTags} from '@/client/cards/SpecialTags';

describe('PlayerTags', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    const player: RecursivePartial<PublicPlayerModel> = {
      color: 'blue',
      tableau: [
        {
          name: CardName.ACQUIRED_COMPANY,
          discount: [{tag: Tag.MICROBE, amount: 1}],
        },
        {
          name: CardName.COMMERCIAL_DISTRICT,
        },
      ],
      tags: {
        [Tag.BUILDING]: 0,
        [Tag.SPACE]: 0,
        [Tag.SCIENCE]: 0,
        [Tag.POWER]: 0,
        [Tag.EARTH]: 0,
        [Tag.JOVIAN]: 0,
        [Tag.PLANT]: 0,
        [Tag.MICROBE]: 0,
        [Tag.ANIMAL]: 0,
        [Tag.CITY]: 0,
        [Tag.EVENT]: 0,
      },
      victoryPointsBreakdown: {
        total: 1,
      },
      terraformRating: 100,
    };
    const playerView: RecursivePartial<PlayerViewModel> = {
      thisPlayer: player,
      id: 'playerid-foo',
      game: {
        gameOptions: {
          corporateEra: true,
          showTimers: false,
        },
      },
      players: [player],
    };
    wrapper = shallowMount(PlayerTags, {
      ...globalConfig,
      parentComponent: {
        methods: {
          getVisibilityState: () => {},
        },
      },
      props: {
        player: player,
        playerView: playerView,
        hideZeroTags: false,
        conciseTagsViewDefaultValue: false,
      },
    });
    // For tests.
    wrapper.vm.$data.conciseView = false;
  });

  function elem(tag: Tag | 'all'): DOMWrapper<Element> {
    return wrapper.find(`[data-test="discount-${tag}"]`);
  }

  function amount(e: DOMWrapper<Element>): string {
    return e.attributes()['amount'];
  }

  it('tag discounts - microbe', () => {
    expect(amount(elem(Tag.MICROBE))).to.eq('1');
  });


  it('tag discounts - all', () => {
    expect(elem('all').exists()).to.eq(false);
  });

  it('tag discounts - earth', () => {
    expect(elem(Tag.EARTH).exists()).to.eq(false);
  });

  it('nextToThis card sets asterisk on city-count tag', () => {
    const cityCount = wrapper.vm.tagsInOrder.find((t: any) => t.name === SpecialTags.CITY_COUNT);
    expect(cityCount.points).to.eq(0);
    expect(cityCount.asterisk).to.eq(true);
  });
});
