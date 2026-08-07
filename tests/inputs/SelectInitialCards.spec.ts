import { expect } from 'chai';
import { CardName } from '../../src/common/cards/CardName';
import { toName } from '../../src/common/utils/utils';
import { ICorporationCard } from '../../src/server/cards/corporation/ICorporationCard';
import {
  cardsFromJSON,
  corporationCardsFromJSON,
} from '../../src/server/createCard';
import { SelectInitialCards } from '../../src/server/inputs/SelectInitialCards';
import { testGame } from '../TestGame';
import { TestPlayer } from '../TestPlayer';

describe('SelectInitialCards', () => {
  let player: TestPlayer;
  let corp: ICorporationCard | undefined = undefined;
  let selectInitialCards: SelectInitialCards;

  function cb(corporation: ICorporationCard) {
    corp = corporation;
    return undefined;
  }

  beforeEach(() => {
    [, /* game */ player] = testGame(1);
    player.dealtCorporationCards = corporationCardsFromJSON([
      CardName.INVENTRIX,
      CardName.HELION,
    ]);
    player.dealtProjectCards = cardsFromJSON([
      CardName.ANTS,
      CardName.BACTOVIRAL_RESEARCH,
      CardName.COMET_AIMING,
    ]);
    selectInitialCards = new SelectInitialCards(player, cb);
  });

  it('fail, no corporations', () => {
    expect(() =>
      selectInitialCards.process(
        {
          type: 'initialCards',
          responses: [
            { type: 'card', cards: [] },
            { type: 'card', cards: [] },
          ],
        },
        player,
      ),
    ).to.throw(/Not enough cards selected/);
  });

  it('fail, invalid corporation', () => {
    expect(() =>
      selectInitialCards.process(
        {
          type: 'initialCards',
          responses: [
            { type: 'card', cards: [CardName.THARSIS_REPUBLIC] },
            { type: 'card', cards: [] },
          ],
        },
        player,
      ),
    ).to.throw(/Card Tharsis Republic not found/);
  });

  it('fail, too many corporations', () => {
    expect(() =>
      selectInitialCards.process(
        {
          type: 'initialCards',
          responses: [
            { type: 'card', cards: [CardName.INVENTRIX, CardName.HELION] },
            { type: 'card', cards: [] },
          ],
        },
        player,
      ),
    ).to.throw(/Too many cards selected/);
  });

  it('Simple', () => {
    player.game.projectDeck.discardPile.length = 0; // Emptying the discard pile, which has 4 cards setting up the solo opponent.
    // player.game.corporationDeck.discardPile.length = 0;

    selectInitialCards.process(
      {
        type: 'initialCards',
        responses: [
          { type: 'card', cards: [CardName.INVENTRIX] },
          { type: 'card', cards: [CardName.ANTS] },
        ],
      },
      player,
    );

    expect(player.playedCards.corporations()).is.empty; // This input object doesn't set the player's corporation card
    expect(corp!.name).eq(CardName.INVENTRIX);
    expect(player.cardsInHand.map(toName)).to.have.members([CardName.ANTS]); // But it does set their cards in hand.

    expect(player.game.projectDeck.discardPile.map(toName)).to.have.members([
      CardName.BACTOVIRAL_RESEARCH,
      CardName.COMET_AIMING,
    ]);
    expect(player.game.corporationDeck.discardPile.map(toName)).to.have.members(
      [CardName.HELION],
    );
  });

  it('Full', () => {
    const [, /* game */ player] = testGame(1, {});
    player.game.projectDeck.discardPile.length = 0; // Emptying the discard pile, which has 4 cards setting up the solo opponent.
    player.game.corporationDeck.discardPile.length = 0;
    player.dealtCorporationCards = corporationCardsFromJSON([
      CardName.INVENTRIX,
      CardName.HELION,
    ]);
    player.dealtProjectCards = cardsFromJSON([
      CardName.ANTS,
      CardName.BACTOVIRAL_RESEARCH,
      CardName.COMET_AIMING,
    ]);
    selectInitialCards = new SelectInitialCards(player, cb);

    selectInitialCards.process(
      {
        type: 'initialCards',
        responses: [
          { type: 'card', cards: [CardName.INVENTRIX] },
          { type: 'card', cards: [CardName.ANTS] },
        ],
      },
      player,
    );

    expect(player.playedCards.corporations()).is.empty; // This input object doesn't set the player's corporation card
    expect(corp!.name).eq(CardName.INVENTRIX);
    expect(player.cardsInHand.map(toName)).to.have.members([CardName.ANTS]); // But it does set their cards in hand.

    expect(player.game.projectDeck.discardPile.map(toName)).to.have.members([
      CardName.BACTOVIRAL_RESEARCH,
      CardName.COMET_AIMING,
    ]);
    expect(player.game.corporationDeck.discardPile.map(toName)).to.have.members(
      [CardName.HELION],
    );
  });
});
