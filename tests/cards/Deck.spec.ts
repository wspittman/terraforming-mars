import { expect } from 'chai';
import { ProjectDeck } from '../../src/server/cards/Deck';
import { IProjectCard } from '../../src/server/cards/IProjectCard';
import { IGame } from '../../src/server/IGame';
import { testGame } from '../TestGame';
import { fakeCard } from '../TestingUtils';

describe('draw()', () => {
  let deck: ProjectDeck;
  let game: IGame;
  let drawnCard: IProjectCard | undefined;
  let originalLength: number;
  let topCard: IProjectCard | undefined;
  let bottomCard: IProjectCard | undefined;

  describe('with more than enough cards in the draw pile', () => {
    beforeEach(() => {
      [game] = testGame(2);
      deck = game.projectDeck;
      originalLength = game.projectDeck.drawPile.length;
    });

    describe('drawing from the top', () => {
      beforeEach(() => {
        topCard = deck.drawPile[originalLength - 1];
        drawnCard = deck.draw(game);
      });

      it('should draw the top card', () => {
        expect(drawnCard).to.equal(topCard);
      });

      it('should remove the card from the draw pile', () => {
        expect(deck.drawPile).has.length(originalLength - 1);
      });
    });

    describe('drawing from the bottom', () => {
      beforeEach(() => {
        bottomCard = deck.drawPile[0];
        drawnCard = deck.draw(game, 'bottom');
      });

      it('should draw the bottom card', () => {
        expect(drawnCard).to.equal(bottomCard);
      });

      it('should remove the card from the draw pile', () => {
        expect(deck.drawPile).has.length(originalLength - 1);
      });
    });
  });

  describe('draw from the top with only 1 card left in the draw pile', () => {
    beforeEach(() => {
      [game] = testGame(2);
      deck = game.projectDeck;
      originalLength = game.projectDeck.drawPile.length;
      bottomCard = deck.drawPile[0];

      // move all cards in the draw pile except 1 into discard pile
      const allExceptLast = deck.drawPile.splice(1);
      deck.discardPile.push(...allExceptLast);

      drawnCard = deck.draw(game);
    });

    it('should draw the top card', () => {
      expect(drawnCard).to.equal(bottomCard);
    });

    it('should shuffle the discard pile back into the draw pile', () => {
      expect(deck.drawPile).has.length(originalLength - 1);
      expect(deck.discardPile).has.length(0);
    });
  });

  describe('draw from the top with no cards left in the draw pile', () => {
    let removedCards: IProjectCard[];

    beforeEach(() => {
      [game] = testGame(2);
      deck = game.projectDeck;
      originalLength = game.projectDeck.drawPile.length;
      bottomCard = deck.drawPile[0];

      // remove all draw pile cards
      removedCards = deck.drawPile.splice(0);

      drawnCard = deck.draw(game);
    });

    it('should have an empty discard pile', () => {
      expect(deck.discardPile).has.length(0);
    });

    it('the drawn card should be undefined', () => {
      expect(drawnCard).to.equal(undefined);
    });

    describe('some cards are discarded before drawing from the top again', () => {
      beforeEach(() => {
        deck.discardPile = [...removedCards.splice(0, 11)];

        drawnCard = deck.draw(game);
      });

      it('should draw the new top card', () => {
        expect(drawnCard).to.not.equal(undefined);
      });

      it('should empty the discard pile', () => {
        expect(deck.discardPile).has.length(0);
      });

      it('should have the correct number of remaining cards in the draw pile', () => {
        expect(deck.drawPile).has.length(10);
      });
    });
  });

  it('drawN', () => {
    const [game] = testGame(2);
    expect(game.projectDeck.drawN(game, 3)).to.have.length(3);
    game.projectDeck.drawPile.length = 2;
    expect(game.projectDeck.drawN(game, 3)).to.have.length(2);
    expect(game.projectDeck.drawN(game, 3)).to.have.length(0);
  });

  it('drawNOrThrow', () => {
    const [game] = testGame(2);
    expect(game.projectDeck.drawNOrThrow(game, 3)).to.have.length(3);
    game.projectDeck.drawPile.length = 2;
    expect(() => game.projectDeck.drawNOrThrow(game, 3)).to.throw();
  });

  it('size', () => {
    const [game] = testGame(2);
    game.projectDeck.drawPile.length = 2;
    expect(game.projectDeck.size()).eq(2);
    game.projectDeck.discardPile.push(fakeCard());
    expect(game.projectDeck.size()).eq(3);
  });

  it('canDraw', () => {
    const [game] = testGame(2);
    expect(game.projectDeck.canDraw(3)).is.true;
    game.projectDeck.drawPile.length = 2;
    expect(game.projectDeck.canDraw(3)).is.false;
    game.projectDeck.discardPile.push(fakeCard());
    expect(game.projectDeck.canDraw(3)).is.true;
  });
});
