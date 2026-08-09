import {CardResource} from '@/common/CardResource';

export const cardResourceCSS = {
  [CardResource.ANIMAL]: 'card-resource-animal',
  [CardResource.MICROBE]: 'card-resource-microbe',
  [CardResource.FIGHTER]: 'card-resource-fighter',
  [CardResource.SCIENCE]: 'card-resource-science',
} satisfies Record<CardResource, string>;
