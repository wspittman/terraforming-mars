import LogMessageComponent from '@/client/components/logpanel/LogMessageComponent.vue';
import { CardName } from '@/common/cards/CardName';
import { LogMessage } from '@/common/logs/LogMessage';
import { LogMessageDataType } from '@/common/logs/LogMessageDataType';
import { LogMessageType } from '@/common/logs/LogMessageType';
import { shallowMount } from '@vue/test-utils';
import { expect } from 'chai';
import { globalConfig } from '../getLocalVue';
import { fakeViewModel } from '../testHelpers';

describe('LogMessageComponent', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(LogMessageComponent, {
      ...globalConfig,
      props: {
        message: new LogMessage(LogMessageType.DEFAULT, 'Test message', []),
        viewModel: fakeViewModel(),
      },
    });
    expect(wrapper.exists()).to.be.true;
  });

  it('renders CARD type as a single card span', () => {
    const message = new LogMessage(LogMessageType.DEFAULT, '${0}', [
      { type: LogMessageDataType.CARD, value: CardName.ANTS },
    ]);
    const wrapper = shallowMount(LogMessageComponent, {
      ...globalConfig,
      props: {
        message,
        viewModel: fakeViewModel(),
      },
    });

    const cardContainer = wrapper.find('.log-card').element.parentElement!;
    expect(cardContainer.innerHTML).to.equal(
      '<span class="log-card background-color-active">Ants</span>',
    );
  });

  it('renders CARDS type as multiple card spans with English separators', () => {
    const message = new LogMessage(LogMessageType.DEFAULT, '${0}', [
      {
        type: LogMessageDataType.CARDS,
        value: [CardName.ALGAE, CardName.BIRDS, CardName.MINING_GUILD],
      },
    ]);

    const wrapper = shallowMount(LogMessageComponent, {
      ...globalConfig,
      props: { message, viewModel: fakeViewModel() },
    });

    const cardsContainer = wrapper.find('.log-card').element.parentElement!;
    expect(cardsContainer.innerHTML).to.equal(
      '<span class="log-card background-color-automated">Algae</span>' +
        ', ' +
        '<span class="log-card background-color-active">Birds</span>' +
        ', and ' +
        '<span class="log-card background-color-corporation">Mining Guild</span>',
    );
  });

  it('renders CARDS type as multiple card spans', () => {
    const message = new LogMessage(LogMessageType.DEFAULT, '${0}', [
      {
        type: LogMessageDataType.CARDS,
        value: [CardName.ANTS, CardName.ECOLINE, CardName.BIRDS],
      },
    ]);
    const wrapper = shallowMount(LogMessageComponent, {
      ...globalConfig,
      props: {
        message,
        viewModel: fakeViewModel(),
      },
    });

    const cardsContainer = wrapper.find('.log-card').element.parentElement!;
    expect(cardsContainer.innerHTML).to.equal(
      '<span class="log-card background-color-active">Ants</span>' +
        ', ' +
        '<span class="log-card background-color-corporation">Ecoline</span>' +
        ', and ' +
        '<span class="log-card background-color-active">Birds</span>',
    );
  });
});
