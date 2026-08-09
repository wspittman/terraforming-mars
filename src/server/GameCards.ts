import {BASE_CARD_MANIFEST, CORP_ERA_CARD_MANIFEST} from './cards/StandardCardManifests';
import {CardManifest, ModuleManifest} from './cards/ModuleManifest';
import {CardName} from '../common/cards/CardName';
import {ICard} from './cards/ICard';
import {GameOptions} from './game/GameOptions';
import {ICorporationCard} from './cards/corporation/ICorporationCard';
import {isIProjectCard, IProjectCard} from './cards/IProjectCard';
import {IStandardProjectCard} from './cards/IStandardProjectCard';
import {newCard} from './createCard';
import {resolveCardName} from '../common/cards/CardRenames';

/**
 * Returns the cards available to a game based on its `GameOptions`.
 *
 * It only includes manifests appropriate to the modules for the game,
 * and considers the banned cards, and extra-module compatibility
 * (e.g. cards in one module that can't be played without another one.)
 *
 * Therefore, this is only used when constructing a brand new instance.
 *
 * ... and one other place. When trying to determine the available standard
 * projects for a game. This is just done on the fly all the time, rather
 * that store them. (We should fix that.)
 */
export class GameCards {
  private readonly gameOptions: GameOptions;
  private readonly moduleManifests: Array<ModuleManifest>;

  public constructor(gameOptions: GameOptions) {
    this.gameOptions = gameOptions;

    this.moduleManifests = [BASE_CARD_MANIFEST];
    if (gameOptions.corporateEra) {
      this.moduleManifests.push(CORP_ERA_CARD_MANIFEST);
    }
  }

  private instantiate<T extends ICard>(manifest: CardManifest<T>): Array<T> {
    return CardManifest.values(manifest)
      .filter((factory) => factory.instantiate !== false)
      .map((factory) => new factory.Factory());
  }

  public getProjectCards() {
    const cards = this.getCards<IProjectCard>('projectCards');
    this.addCustomCards(cards, this.gameOptions.includedCards);
    return cards.filter(isIProjectCard);
  }
  public getStandardProjects() {
    return this.getCards<IStandardProjectCard>('standardProjects');
  }
  public getCorporationCards(): Array<ICorporationCard> {
    const cards = this.getCards<ICorporationCard>('corporationCards')
      .filter((card) => card.name !== CardName.BEGINNER_CORPORATION);
    this.addCustomCards(cards, this.gameOptions.customCorporationsList);
    return cards;
  }
  /**
   * Instantiate every card in `customList` and add them to `cards` (except those that already exist in `cards`),
   */
  private addCustomCards<T extends ICard>(cards: Array<T>, customList: ReadonlyArray<CardName> = []): void {
    for (const cardName of customList) {
      const canonicalName = resolveCardName(cardName);
      if (cards.findIndex((c) => c.name === canonicalName) > -1) {
        continue;
      }
      const card = newCard(cardName);
      cards.push(<T> card);
    }
  }

  private getCards<T extends ICard>(cardManifestName: keyof ModuleManifest) : Array<T> {
    let cards: Array<T> = [];
    for (const moduleManifest of this.moduleManifests) {
      // a bit of a hack, but since this is a private API, this is reasonable.
      const cardManifest: CardManifest<T> = moduleManifest[cardManifestName] as CardManifest<T>;
      cards.push(...this.instantiate(cardManifest));
    }

    cards = this.filterBannedCards(cards);
    cards = this.filterReplacedCards(cards);
    return cards;
  }

  /* Remove cards excluded by choice in game options */
  private filterBannedCards<T extends ICard>(cards: Array<T>): Array<T> {
    return cards.filter((card) => {
      return this.gameOptions.bannedCards.includes(card.name) !== true;
    });
  }

  /* Remove cards that are replaced by new versions in other manifests */
  private filterReplacedCards<T extends ICard>(cards: Array<T>): Array<T> {
    return cards.filter((card) => {
      for (const manifest of this.moduleManifests) {
        if (manifest.cardsToRemove.has(card.name)) {
          return false;
        }
      }
      return true;
    });
  }
}
