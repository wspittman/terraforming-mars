import {CardName} from '../../common/cards/CardName';
import {message} from '../logs/MessageBuilder';

export const TITLES = {
  action: 'Select how to pay for action',
  payForCardAction: (cardName: CardName) => message('Select how to pay for ${0} action', (b) => b.cardName(cardName)),
} as const;
