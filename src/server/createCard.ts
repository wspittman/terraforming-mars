import {ICard} from './cards/ICard';
import {IProjectCard} from './cards/IProjectCard';
import {CardManifest, ModuleManifest} from './cards/ModuleManifest';
import {CardName} from '../common/cards/CardName';
import {ICorporationCard} from './cards/corporation/ICorporationCard';
import {ALL_MODULE_MANIFESTS} from './cards/AllManifests';
import {resolveCardName} from '../common/cards/CardRenames';

function _createCard<T extends ICard>(cardName: CardName, cardManifestNames: Array<keyof ModuleManifest>): T | undefined {
  const standardizedCardName = resolveCardName(cardName);

  for (const moduleManifest of ALL_MODULE_MANIFESTS) {
    for (const manifestName of cardManifestNames) {
      const cardManifest = <CardManifest<T>> moduleManifest[manifestName];
      const factory = cardManifest[standardizedCardName];
      if (factory !== undefined) {
        return new factory.Factory();
      }
    }
  }
  return undefined;
}

export function newCard(cardName: CardName): ICard {
  const card = _createCard(cardName, ['corporationCards', 'projectCards']);
  if (card === undefined) {
    throw new Error(`Card [${cardName}] not found`);
  }
  return card;
}

export function newCorporationCard(cardName: CardName): ICorporationCard | undefined {
  return _createCard(cardName, ['corporationCards']);
}

// Function to return a card object by its name
// NOTE(kberg): This replaces a larger function which searched for both Prelude cards amidst project cards
// TODO(kberg+dl): Find the use cases where this is used to find Prelude+CEO cards and filter them out to
//              another function, perhaps?
export function newProjectCard(cardName: CardName): IProjectCard | undefined {
  return _createCard(cardName, ['projectCards']);
}

function cfj<T extends ICard>(cards: ReadonlyArray<CardName>, resolver: (c: CardName) => T | undefined): Array<T> {
  if (cards === undefined) {
    console.warn('parameter of array of cards is undefined when calling cardsFromJSON');
    return [];
  }
  const result: Array<T> = [];
  cards.forEach((element: CardName) => {
    const card = resolver(element);
    if (card !== undefined) {
      result.push(card);
    } else {
      console.warn(`card ${element} not found while loading game.`);
    }
  });
  return result;
}

export function cardsFromJSON(cards: ReadonlyArray<CardName>): Array<IProjectCard> {
  return cfj(cards, newProjectCard);
}

export function corporationCardsFromJSON(cards: ReadonlyArray<CardName>): Array<ICorporationCard> {
  return cfj(cards, newCorporationCard);
}

