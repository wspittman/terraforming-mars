import {CardName} from '../../common/cards/CardName';
import {GameModule} from '../../common/cards/GameModule';
import {ICorporationCard} from './corporation/ICorporationCard';
import {CardFactorySpec} from './CardFactorySpec';
import {IProjectCard} from './IProjectCard';
import {ICard} from './ICard';
import {IStandardProjectCard} from './IStandardProjectCard';
import {IStandardActionCard} from './IStandardActionCard';

export type CardManifest<T extends ICard> = Partial<Record<CardName, CardFactorySpec<T>>>;
export namespace CardManifest {
  export function keys<T extends ICard>(manifest: CardManifest<T>): Array<CardName> {
    return Object.keys(manifest) as Array<CardName>;
  }
  export function values<T extends ICard>(manifest: CardManifest<T>): Array<CardFactorySpec<T>> {
    return Object.values(manifest) as Array<CardFactorySpec<T>>;
  }
  export function entries<T extends ICard>(manifest: CardManifest<T>): Array<[CardName, CardFactorySpec<T>]> {
    return keys(manifest).map((key) => {
      const value = manifest[key];
      if (value === undefined) {
        throw new Error(`Manifest has key ${key} but no entry.`);
      }
      return [key, value];
    });
  }
}

export class ModuleManifest {
  module: GameModule;
  projectCards : CardManifest<IProjectCard>;
  cardsToRemove: ReadonlySet<CardName>;
  corporationCards : CardManifest<ICorporationCard>;
  standardProjects : CardManifest<IStandardProjectCard>;
  standardActions : CardManifest<IStandardActionCard>;
  constructor(arg: {
    module: GameModule,
    projectCards?: CardManifest<IProjectCard>,
    cardsToRemove?: Array<CardName>,
    corporationCards?: CardManifest<ICorporationCard>,
    standardProjects?: CardManifest<IStandardProjectCard>,
    standardActions?: CardManifest<IStandardActionCard>,
  }) {
    this.module = arg.module;
    this.projectCards = arg.projectCards || {};
    this.cardsToRemove = new Set(arg.cardsToRemove || []);
    this.corporationCards = arg.corporationCards || {};
    this.standardProjects = arg.standardProjects || {};
    this.standardActions = arg.standardActions || {};
  }
}
