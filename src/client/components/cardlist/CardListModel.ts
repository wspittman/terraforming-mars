import {Tag} from '@/common/cards/Tag';
import {CardType} from '@/common/cards/CardType';
import {GameModule, GAME_MODULES} from '@/common/cards/GameModule';
import {SearchIndex} from '@/client/components/cardlist/SearchIndex';
import {CardResource} from '@/common/CardResource';

export type TypeOption = CardType | 'milestones' | 'awards';
export type TagOption = Tag | 'none';
export type ResourceOption = CardResource | 'none';

export type CardListModel = {
  filterText: string,
  expansions: Record<GameModule, boolean>,
  types: Record<TypeOption, boolean>,
  tags: Record<TagOption, boolean>,
  resources: Record<ResourceOption, boolean>,
  searchIndex: SearchIndex,
  namesOnly: boolean,
  showAdvanced: boolean;
  sortOrder: 'a' | '1';
  showMetadata: boolean;
  tallCards: boolean;
  vps: number; // 0: all, 1: VPs, 2: no vps
}

const MODULE_ABBREVIATIONS = {
  base: 'b',
  corpera: 'c',
} satisfies Record<GameModule, string>;

const TYPE_ABBREVIATIONS = {
  [CardType.EVENT]: 'r',
  [CardType.ACTIVE]: 'b',
  [CardType.AUTOMATED]: 'g',
  [CardType.CORPORATION]: 'c',
  [CardType.STANDARD_PROJECT]: 's',
  [CardType.STANDARD_ACTION]: 'S',
  [CardType.PROXY]: '*',
  milestones: 'm',
  awards: 'a',
} satisfies Record<TypeOption, string>;

const TAG_ABBREVIATIONS = {
  [Tag.BUILDING]: '0',
  [Tag.SPACE]: '1',
  [Tag.SCIENCE]: '2',
  [Tag.POWER]: '3',
  [Tag.EARTH]: '4',
  [Tag.JOVIAN]: '5',
  [Tag.PLANT]: '7',
  [Tag.MICROBE]: '8',
  [Tag.ANIMAL]: '9',
  [Tag.CITY]: 'a',
  [Tag.EVENT]: 'e',
  none: 'g',
} satisfies Record<TagOption, string>;

export function hashToModel(windowLocationHash: string): CardListModel {
  const model: CardListModel = {
    filterText: '',
    expansions: {
      base: true,
      corpera: true,
    },
    types: {
      event: true,
      active: true,
      automated: true,
      corporation: true,
      standard_project: true,
      standard_action: false,
      proxy: false,
      milestones: true,
      awards: true,
    },
    tags: {
      building: true,
      space: true,
      science: true,
      power: true,
      earth: true,
      jovian: true,
      plant: true,
      microbe: true,
      animal: true,
      city: true,
      event: true,
      none: true,
    },
    resources: {
      none: true,
      [CardResource.ANIMAL]: true,
      [CardResource.MICROBE]: true,
      [CardResource.FIGHTER]: true,
      [CardResource.SCIENCE]: true,
    },
    searchIndex: SearchIndex.create(),
    namesOnly: true,
    showAdvanced: false,
    vps: 0,
    sortOrder: 'a',
    showMetadata: true,
    tallCards: false,
  };
  if (windowLocationHash.length > 1) {
    const hash = decodeURIComponent(windowLocationHash).slice(1);
    let remainder: Array<string> = [];
    [model.filterText, ...remainder] = hash.split('~');

    for (const e of remainder) {
      // modules
      if (e.startsWith('m')) {
        const modules = e.slice(1);
        for (const module of GAME_MODULES) {
          const abbrev = MODULE_ABBREVIATIONS[module];
          model.expansions[module] = modules.includes(abbrev);
        }
      }
      // types
      if (e.startsWith('t')) {
        const types = e.slice(1);
        for (const type of <Array<TypeOption>>Object.keys(model.types)) {
          const abbrev = TYPE_ABBREVIATIONS[type];
          model.types[type] = types.includes(abbrev);
        }
      }
      // tags
      if (e.startsWith('g')) {
        const tags = e.slice(1);
        for (const type of <Array<TagOption>>Object.keys(model.tags)) {
          const abbrev = TAG_ABBREVIATIONS[type];
          model.tags[type] = tags.includes(abbrev);
        }
      }
      // metadata
      if (e.startsWith('d')) {
        const metadata = e.slice(1);
        if (metadata.includes('f')) {
          model.namesOnly = false;
        }
        if (metadata.includes('!')) {
          model.showAdvanced = true;
        }
        if (metadata.includes('1')) {
          model.sortOrder = '1';
        }
        if (metadata.includes('d')) {
          model.showMetadata = false;
        }
      }
    }
  }

  return model;
}

function encode<T extends string>(vals: Record<T, boolean>, abbreviations: Record<T, string>) {
  const arry: Array<T> = <Array<T>> Object.keys(vals);
  const text = arry.filter((e) => vals[e]).map((e) => abbreviations[e]).join('');
  return (text.length !== arry.length) ? text : undefined;
}

function encodeMetadata(model: CardListModel) {
  let text = '';
  if (model.namesOnly === false) {
    text += 'f';
  }
  if (model.showAdvanced === true) {
    text += '!';
  }
  if (model.sortOrder === '1') {
    text += '1';
  }
  if (model.showMetadata === false) {
    text += 'd';
  }
  return text;
}

export function modelToHash(model: CardListModel) {
  const parts: any = {};

  parts.m = encode(model.expansions, MODULE_ABBREVIATIONS);
  parts.t = encode(model.types, TYPE_ABBREVIATIONS);
  parts.g = encode(model.tags, TAG_ABBREVIATIONS);
  parts.d = encodeMetadata(model);

  function tostring(key: string): string {
    const content = parts[key] ?? '';
    return content === '' ? '' : `~${key}${content}`;
  }
  const text = model.filterText + tostring('m') + tostring('t') + tostring('g') + tostring('d');
  return '#' + encodeURIComponent(text);
}
