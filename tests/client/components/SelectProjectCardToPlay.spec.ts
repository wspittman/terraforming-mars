import SelectProjectCardToPlay from '@/client/components/SelectProjectCardToPlay.vue';
import { PreferencesManager } from '@/client/utils/PreferencesManager';
import { CardName } from '@/common/cards/CardName';
import { SelectProjectCardToPlayResponse } from '@/common/inputs/InputResponse';
import { Payment } from '@/common/inputs/Payment';
import { CardModel } from '@/common/models/CardModel';
import { SelectProjectCardToPlayModel } from '@/common/models/PlayerInputModel';
import {
  PlayerViewModel,
  PublicPlayerModel,
} from '@/common/models/PlayerModel';
import { Units } from '@/common/Units';
import { mount } from '@vue/test-utils';
import { expect } from 'chai';
import { FakeLocalStorage } from './FakeLocalStorage';
import { globalConfig } from './getLocalVue';
import { PaymentTester } from './PaymentTester';

describe('SelectProjectCardToPlay', () => {
  let localStorage: FakeLocalStorage;
  let saveResponse: SelectProjectCardToPlayResponse;

  beforeEach(() => {
    localStorage = new FakeLocalStorage();
    FakeLocalStorage.register(localStorage);
    PreferencesManager.INSTANCE.set('show_alerts', false);
  });
  afterEach(() => {
    FakeLocalStorage.deregister(localStorage);
  });

  it('using sort order for cards', async () => {
    localStorage.setItem(
      'cardOrderp-foo',
      JSON.stringify({
        [CardName.ANTS]: 2,
        [CardName.BIRDS]: 1,
      }),
    );
    const sortable = mount(SelectProjectCardToPlay, {
      ...globalConfig,
      props: {
        playerView: {
          cardsInHand: [
            {
              calculatedCost: 4,
              name: CardName.ANTS,
            },
            {
              calculatedCost: 3,
              name: CardName.BIRDS,
            },
          ],
          id: 'p-foo',
          selfReplicatingRobotCards: [],
          thisPlayer: {
            steel: 0,
            tableau: [],
          },
        },
        playerinput: {
          type: 'projectCard',
          title: 'foo',
          cards: [
            {
              name: CardName.ANTS,
              reserveUnits: Units.EMPTY,
            },
            {
              name: CardName.BIRDS,
              reserveUnits: Units.EMPTY,
            },
          ],
          paymentOptions: {},
          buttonLabel: 'Save',
        },
        onsave: () => {},
        showsave: true,
        showtitle: true,
      },
    });
    const cards = sortable.findAllComponents({
      name: 'Card',
    });
    expect(cards).has.length(2);
    expect(cards[0].props().card.name).to.eq(CardName.BIRDS);
    expect(cards[1].props().card.name).to.eq(CardName.ANTS);
  });

  it('using heat', async () => {
    // Birds will cost 10. Player has 7M€ and will use 3 of the 4 available heat units.
    const wrapper = setupCardForPurchase(
      CardName.BIRDS,
      10,
      { heat: 4, megacredits: 7 },
      { paymentOptions: { heat: true } },
    );

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectIsAvailable('heat');
    tester.expectPayment({ heat: 3, megacredits: 7 });

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(
      Payment.of({ heat: 3, megacredits: 7 }),
    );
  });

  it('max heat', async () => {
    const wrapper = setupCardForPurchase(
      CardName.BIRDS,
      10,
      { heat: 4, megacredits: 10, titaniumValue: 1, steelValue: 1 },
      { paymentOptions: { heat: true } },
    );

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({ heat: 0, megacredits: 10 });

    await tester.clickMax('heat');
    tester.expectPayment({ heat: 4, megacredits: 6 });

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(
      Payment.of({ heat: 4, megacredits: 6 }),
    );
  });

  it('max heat, heat in reserve', async () => {
    const wrapper = setupCardForPurchase(
      CardName.BIRDS,
      10,
      { heat: 4, megacredits: 10, titaniumValue: 1, steelValue: 1 },
      { paymentOptions: { heat: true } },
      { reserveUnits: Units.of({ heat: 2 }) },
    );

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({ heat: 0, megacredits: 10 });

    await tester.clickMax('heat');
    // Only 2 heat available since two are in reserve.
    tester.expectPayment({ heat: 2, megacredits: 8 });

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(
      Payment.of({ heat: 2, megacredits: 8 }),
    );
  });

  it('using microbes', async () => {
    // Moss will cost 10. Player has 7M€ and 4 available microbes units.
    // Greedy: uses all 4 microbes (=8 MC), MC fills remaining 2.
    const wrapper = setupCardForPurchase(
      CardName.MOSS,
      10,
      { megacredits: 7 },
      { microbes: 4 },
    );

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({ microbes: 4, megacredits: 2 });

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(
      Payment.of({ microbes: 4, megacredits: 2 }),
    );
  });

  it('Paying for other card with Psychophriles uses all microbes', async () => {
    // Greedy: uses all 3 microbes (=6 MC), MC fills remaining 4.
    const wrapper = setupCardForPurchase(
      CardName.BUSHES,
      10,
      { megacredits: 8 },
      { microbes: 3 },
    );

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(
      Payment.of({ microbes: 3, megacredits: 4 }),
    );

    await tester.clickMax('microbes');

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(
      Payment.of({ microbes: 3, megacredits: 4 }),
    );
  });

  it('using steel', async () => {
    // NUCLEAR_POWER will cost 10. Player has 7M€ and 4 steels (rate 2).
    // Greedy: uses all 4 steel (=8 MC), MC fills remaining 2.
    const wrapper = setupCardForPurchase(
      CardName.NUCLEAR_POWER,
      10,
      { steel: 4, megacredits: 7, steelValue: 2 },
      { paymentOptions: { steel: true } },
    );

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({ megacredits: 2, steel: 4 });

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(
      Payment.of({ steel: 4, megacredits: 2 }),
    );
  });

  it('using titanium metal bonus', async () => {
    // Solar Wind Power will cost 11. Player has 2M€ and 4 Ti. The titanium is
    // artificially inflated to be worth 7M€ each.
    // The algorithm will try to spend 2 mc. Then spend as much Ti as possible.
    // This will come down to 2 M€ and 2 Ti (at value 7). So we are effectively spending 16.
    // That is overspending by 5 mc. The algorithm will try to spend 5 M€ less if possible.
    // It is not, so it will try to overspend as little mc as it can.
    // The final answer should be 0M€ and 2 Ti (at value 7).
    const wrapper = setupCardForPurchase(
      CardName.SOLAR_WIND_POWER,
      11,
      { megacredits: 2, titanium: 4, titaniumValue: 7 },
      { paymentOptions: { titanium: true } },
    );

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({ megacredits: 0, titanium: 2 });

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(
      Payment.of({ titanium: 2, megacredits: 0 }),
    );
  });

  it('using steel and titanium with metal bonus', async () => {
    // Space Elevator will cost 27. Player has 1MC, 4 steels (at value 3), and 6 Ti. The titanium is
    // artificially inflated to be worth 6M€ each.
    // The algorithm will try to spend 1 mc. Then spend as much steel as possible. Then spend as much Ti as possible.
    // This will come down to 1 MC, 4 steels (at value 3), and 3 Ti (at value 6). So we are effectively spending 31.
    // That is overspending by 4 mc.
    // It will try to save the resources. It will first save 1 steel and then 1 mc.
    // The final answer should be 0mc, 3 steels (at value 3) and 3 Ti (at value 6).
    const wrapper = setupCardForPurchase(
      CardName.SPACE_ELEVATOR,
      27,
      {
        megacredits: 1,
        steel: 4,
        steelValue: 3,
        titanium: 6,
        titaniumValue: 6,
      },
      { paymentOptions: { steel: true, titanium: true } },
    );

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({ megacredits: 0, steel: 3, titanium: 3 });

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(
      Payment.of({ steel: 3, titanium: 3, megacredits: 0 }),
    );
  });

  it('using steel and microbes', async () => {
    // Protected Valley will cost 23. Player has no MC, 5 microbes, and 10 steels (rate 4).
    // Greedy: steel (first in order) fills to 6 (=24 MC, just over cost). Post-pass cannot
    // reduce steel (24-4=20 < 23), so steel=6 and microbes=0. Overpays by 1.
    const wrapper = setupCardForPurchase(
      CardName.PROTECTED_VALLEY,
      23,
      { megacredits: 0, steel: 10, steelValue: 4 },
      { paymentOptions: { steel: true }, microbes: 5 },
    );

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectAvailablePaymentComponents('steel', 'microbes');
    tester.expectPayment({ steel: 6, microbes: 0 });

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({ steel: 6 }));
  });

  it('using titanium metal bonus without using steel', async () => {
    // Io Mining Industries costs 41 MC. Player has 10 MC, 2 steel (not usable — no building tag),
    // and 13 Ti (rate 5). Greedy: Ti fills to 8 (=40 MC), MC fills remaining 1.
    const wrapper = setupCardForPurchase(
      CardName.IO_MINING_INDUSTRIES,
      41,
      {
        megacredits: 10,
        titanium: 13,
        titaniumValue: 5,
        steel: 2,
        steelValue: 4,
      },
      { paymentOptions: { titanium: true } },
    );

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({ megacredits: 1, titanium: 8 });

    tester.expectIsNotAvailable('steel');

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(
      Payment.of({ titanium: 8, megacredits: 1 }),
    );
  });

  it('saveData() via PlayerInputFactory includes payment in response', async () => {
    // Reproduces: when OrOptions -> PlayerInputFactory calls saveData() with no arguments,
    // payment must still be included. Before the fix, payment was undefined in the response.
    const wrapper = setupCardForPurchase(
      CardName.BIRDS,
      10,
      { heat: 4, megacredits: 7 },
      { paymentOptions: { heat: true } },
    );

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    (wrapper.vm as any).saveData();

    expect(saveResponse.payment).deep.eq(
      Payment.of({ heat: 3, megacredits: 7 }),
    );
  });

  it('saveData() via PlayerInputFactory blocks save when payment cannot overspend', async () => {
    // Steel at rate 2, 6 available: greedy picks 5 steel (=10 MC, exact).
    // Clicking + once gives 6 steel (=12 MC). delta=2 >= rate=2, so handleSave()
    // must set a warning and NOT call onsave.
    const wrapper = setupCardForPurchase(
      CardName.NUCLEAR_POWER,
      10,
      { steel: 6, megacredits: 0, steelValue: 2 },
      { paymentOptions: { steel: true } },
    );

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({ steel: 5 });

    await tester.clickPlus('steel');
    tester.expectPayment({ steel: 6 });

    saveResponse = undefined as any;
    (wrapper.vm as any).saveData();

    expect(saveResponse).to.be.undefined;
  });

  it('switching cards updates payment defaults to match new card cost', async () => {
    // Regression: the cardName watch (flush:'pre') must update available units before
    // PaymentForm remounts via :key, so the new instance computes correct greedy defaults.
    const playerInput: SelectProjectCardToPlayModel = {
      type: 'projectCard',
      title: 'foo',
      buttonLabel: 'bar',
      cards: [
        { name: CardName.BIRDS, calculatedCost: 10 },
        { name: CardName.ANTS, calculatedCost: 3 },
      ],
      paymentOptions: {},
      floaters: 0,
      graphene: 0,
      kuiperAsteroids: 0,
      lunaArchivesScience: 0,
      microbes: 0,
      seeds: 0,
      auroraiData: 0,
      spireScience: 0,
    };
    const playerView: Partial<PlayerViewModel> = {
      id: 'playerid-foo',
      thisPlayer: {
        megacredits: 10,
        steel: 0,
        titanium: 0,
        steelValue: 2,
        titaniumValue: 3,
        tableau: [],
      } as unknown as PublicPlayerModel,
    };

    const wrapper = mount(SelectProjectCardToPlay, {
      ...globalConfig,
      props: {
        playerView: playerView as PlayerViewModel,
        playerinput: playerInput,
        onsave: (response: SelectProjectCardToPlayResponse) => {
          saveResponse = response;
        },
        showsave: true,
        showtitle: true,
      },
    });

    await wrapper.vm.$nextTick();

    const vm = wrapper.vm as any;
    const tester = new PaymentTester(wrapper);
    expect(vm.cardName).to.eq(CardName.BIRDS);
    tester.expectValue('megacredits', 10);

    // Setting cardName simulates what v-model does when the radio changes.
    // The watch fires (pre-flush) before PaymentForm remounts.
    vm.cardName = CardName.ANTS;
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(vm.cardName).to.eq(CardName.ANTS);
    tester.expectValue('megacredits', 3);
  });

  const setupCardForPurchase = function(
    cardName: CardName,
    cardCost: number,
    playerFields: Partial<PublicPlayerModel>,
    playerInputFields: Partial<SelectProjectCardToPlayModel>,
    options?: {
      reserveUnits?: Units;
      canPayWith?: CardModel['standardProjectCanPayWith'];
    },
  ) {
    const thisPlayer: Partial<PublicPlayerModel> = Object.assign(
      {
        cards: [{ name: cardName, calculatedCost: cardCost }],
        steel: 0,
        titanium: 0,
        steelValue: 2,
        titaniumValue: 3,
        tableau: [],
      },
      playerFields,
    );

    const playerView: Partial<PlayerViewModel> = {
      id: 'playerid-foo',
      thisPlayer: thisPlayer as PublicPlayerModel,
    };
    const playerInput: SelectProjectCardToPlayModel = {
      type: 'projectCard',
      title: 'foo',
      buttonLabel: 'bar',
      cards: [
        {
          name: cardName,
          resources: undefined,
          calculatedCost: cardCost,
        },
      ],
      paymentOptions: {},
      floaters: 0,
      graphene: 0,
      kuiperAsteroids: 0,
      lunaArchivesScience: 0,
      microbes: 0,
      seeds: 0,
      auroraiData: 0,
      spireScience: 0,
      ...playerInputFields,
    };
    if (options !== undefined) {
      playerInput.cards![0].reserveUnits = options.reserveUnits;
      playerInput.cards![0].standardProjectCanPayWith = options.canPayWith;
    }

    return mount(SelectProjectCardToPlay, {
      ...globalConfig,
      props: {
        playerView: playerView,
        playerinput: playerInput,
        onsave: (response: SelectProjectCardToPlayResponse) => {
          saveResponse = response;
        },
        showsave: true,
        showtitle: true,
      },
    });
  };
});
