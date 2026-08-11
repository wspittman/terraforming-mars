import { Message } from '@/common/logs/Message';
import { expect } from 'chai';
import { CardName } from '../src/common/cards/CardName';
import { cast, toName } from '../src/common/utils/utils';
import { IProjectCard } from '../src/server/cards/IProjectCard';
import { cardsFromJSON } from '../src/server/createCard';
import { SelectCard } from '../src/server/inputs/SelectCard';
import { SelectInitialCards } from '../src/server/inputs/SelectInitialCards';
import { IPlayer } from '../src/server/IPlayer';
import { testGame } from './TestGame';
import { finishGeneration } from './TestingUtils';
import { TestPlayer } from './TestPlayer';

// Tests for drafting
describe('drafting', () => {
  it('2 player - project draft', () => {
    const [game, player, otherPlayer] = testGame(2, {
      skipInitialShuffling: true,
    });
    const drawPile = game.projectDeck.drawPile;

    unshiftCards(drawPile, [
      CardName.ACQUIRED_COMPANY,
      CardName.BLACK_POLAR_DUST,
      CardName.CAPITAL,
      CardName.DECOMPOSERS,
      CardName.EARTH_OFFICE,
      CardName.FISH,
      CardName.GENE_REPAIR,
      CardName.HACKERS,
    ]);

    game.generation = 1;
    // This moves into draft phase
    finishGeneration(game);

    // First round

    expect(draftSelection(player)).deep.eq([
      CardName.ACQUIRED_COMPANY,
      CardName.BLACK_POLAR_DUST,
      CardName.CAPITAL,
      CardName.DECOMPOSERS,
    ]);

    expect(draftSelection(otherPlayer)).deep.eq([
      CardName.EARTH_OFFICE,
      CardName.FISH,
      CardName.GENE_REPAIR,
      CardName.HACKERS,
    ]);

    selectCard(player, CardName.BLACK_POLAR_DUST);
    expectReselect(player);
    selectCard(otherPlayer, CardName.GENE_REPAIR);

    expect(player.draftedCards.map(toName)).deep.eq([
      CardName.BLACK_POLAR_DUST,
    ]);
    expect(otherPlayer.draftedCards.map(toName)).deep.eq([
      CardName.GENE_REPAIR,
    ]);

    // Second card

    expect(draftSelection(player)).deep.eq([
      CardName.EARTH_OFFICE,
      CardName.FISH,
      CardName.HACKERS,
    ]);

    expect(draftSelection(otherPlayer)).deep.eq([
      CardName.ACQUIRED_COMPANY,
      CardName.CAPITAL,
      CardName.DECOMPOSERS,
    ]);

    selectCard(player, CardName.FISH);
    expectReselect(player);
    selectCard(otherPlayer, CardName.ACQUIRED_COMPANY);

    expect(player.draftedCards.map(toName)).deep.eq([
      CardName.BLACK_POLAR_DUST,
      CardName.FISH,
    ]);
    expect(otherPlayer.draftedCards.map(toName)).deep.eq([
      CardName.GENE_REPAIR,
      CardName.ACQUIRED_COMPANY,
    ]);

    // Third round

    expect(draftSelection(player)).deep.eq([
      CardName.CAPITAL,
      CardName.DECOMPOSERS,
    ]);

    expect(draftSelection(otherPlayer)).deep.eq([
      CardName.EARTH_OFFICE,
      CardName.HACKERS,
    ]);

    selectCard(player, CardName.DECOMPOSERS);
    expectReselect(player);
    selectCard(otherPlayer, CardName.EARTH_OFFICE);

    // No longer drafted cards, they're just cards to buy.
    expect(player.draftedCards).is.empty;
    expect(otherPlayer.draftedCards).is.empty;

    expect(draftSelection(player)).deep.eq([
      CardName.BLACK_POLAR_DUST,
      CardName.FISH,
      CardName.DECOMPOSERS,
      CardName.HACKERS,
    ]);
    expect(draftSelection(otherPlayer)).deep.eq([
      CardName.GENE_REPAIR,
      CardName.ACQUIRED_COMPANY,
      CardName.EARTH_OFFICE,
      CardName.CAPITAL,
    ]);

    // A nice next step would be to show that those cards above are for purchase, and acquiring them puts them in cardsInHand
    // and that the rest of them are discarded.
  });

  it('2 player - project draft - reselect card', () => {
    const [game, player, otherPlayer] = testGame(2, {
      skipInitialShuffling: true,
    });
    const drawPile = game.projectDeck.drawPile;

    unshiftCards(drawPile, [
      CardName.ACQUIRED_COMPANY,
      CardName.BLACK_POLAR_DUST,
      CardName.CAPITAL,
      CardName.DECOMPOSERS,
      CardName.EARTH_OFFICE,
      CardName.FISH,
      CardName.GENE_REPAIR,
      CardName.HACKERS,
    ]);

    game.generation = 1;
    // This moves into draft phase
    finishGeneration(game);

    // First round

    expect(draftSelection(player)).deep.eq([
      CardName.ACQUIRED_COMPANY,
      CardName.BLACK_POLAR_DUST,
      CardName.CAPITAL,
      CardName.DECOMPOSERS,
    ]);

    expect(draftSelection(otherPlayer)).deep.eq([
      CardName.EARTH_OFFICE,
      CardName.FISH,
      CardName.GENE_REPAIR,
      CardName.HACKERS,
    ]);

    selectCard(player, CardName.BLACK_POLAR_DUST);

    // The first player has drafted a card. The other player has not drafted yet.
    // Verify that the other player's draft selection is unchanged when the first player reselects.
    expect(draftSelection(otherPlayer)).deep.eq([
      CardName.EARTH_OFFICE,
      CardName.FISH,
      CardName.GENE_REPAIR,
      CardName.HACKERS,
    ]);

    // First player should now have a reselect choice.
    // The previously drafted card should be present but disabled.
    expectReselect(player);
    const selectCardInput = cast(player.getWaitingFor(), SelectCard);
    expect(selectCardInput.cards.map(toName)).deep.eq([
      CardName.ACQUIRED_COMPANY,
      CardName.CAPITAL,
      CardName.DECOMPOSERS,
      CardName.BLACK_POLAR_DUST,
    ]);
    expect(selectCardInput.config.enabled).deep.eq([true, true, true, false]);

    // Reselect: player chooses CAPITAL instead
    selectCard(player, CardName.CAPITAL);

    // Verify other player's draft selection is STILL unchanged after player reselects.
    expect(draftSelection(otherPlayer)).deep.eq([
      CardName.EARTH_OFFICE,
      CardName.FISH,
      CardName.GENE_REPAIR,
      CardName.HACKERS,
    ]);

    // First player should now be able to reselect again, with CAPITAL disabled
    // and BLACK_POLAR_DUST re-enabled.
    expectReselect(player);
    const selectCardInput2 = cast(player.getWaitingFor(), SelectCard);
    expect(selectCardInput2.cards.map(toName)).deep.eq([
      CardName.ACQUIRED_COMPANY,
      CardName.DECOMPOSERS,
      CardName.BLACK_POLAR_DUST,
      CardName.CAPITAL,
    ]);
    expect(selectCardInput2.config.enabled).deep.eq([true, true, true, false]);

    // Other player makes their choice
    selectCard(otherPlayer, CardName.GENE_REPAIR);

    // Both players have now made their selections.
    // Verify that player drafted CAPITAL and otherPlayer drafted GENE_REPAIR.
    expect(player.draftedCards.map(toName)).deep.eq([CardName.CAPITAL]);
    expect(otherPlayer.draftedCards.map(toName)).deep.eq([
      CardName.GENE_REPAIR,
    ]);

    // Second card round should start, passing hands
    expect(draftSelection(player)).deep.eq([
      CardName.EARTH_OFFICE,
      CardName.FISH,
      CardName.HACKERS,
    ]);

    expect(draftSelection(otherPlayer)).deep.eq([
      CardName.ACQUIRED_COMPANY,
      CardName.DECOMPOSERS,
      CardName.BLACK_POLAR_DUST,
    ]);
  });

  it('3 player - project draft - even generation', () => {
    const [game, player1, player2, player3] = testGame(3, {
    });
    const drawPile = game.projectDeck.drawPile;

    unshiftCards(drawPile, [
      CardName.ACQUIRED_COMPANY,
      CardName.BLACK_POLAR_DUST,
      CardName.CAPITAL,
      CardName.DECOMPOSERS,
      CardName.EARTH_OFFICE,
      CardName.FISH,
      CardName.GENE_REPAIR,
      CardName.HACKERS,
      CardName.IMPORTED_GHG,
      CardName.ADAPTED_LICHEN,
      CardName.KELP_FARMING,
      CardName.LAND_CLAIM,
    ]);

    game.generation = 1;
    // This moves into draft phase
    finishGeneration(game);

    // First round

    expect(draftSelection(player1)).deep.eq([
      CardName.ACQUIRED_COMPANY,
      CardName.BLACK_POLAR_DUST,
      CardName.CAPITAL,
      CardName.DECOMPOSERS,
    ]);

    expect(draftSelection(player2)).deep.eq([
      CardName.EARTH_OFFICE,
      CardName.FISH,
      CardName.GENE_REPAIR,
      CardName.HACKERS,
    ]);

    expect(draftSelection(player3)).deep.eq([
      CardName.IMPORTED_GHG,
      CardName.ADAPTED_LICHEN,
      CardName.KELP_FARMING,
      CardName.LAND_CLAIM,
    ]);

    selectCard(player1, CardName.ACQUIRED_COMPANY);
    selectCard(player2, CardName.EARTH_OFFICE);
    selectCard(player3, CardName.IMPORTED_GHG);

    expect(player1.draftedCards.map(toName)).deep.eq([
      CardName.ACQUIRED_COMPANY,
    ]);
    expect(player2.draftedCards.map(toName)).deep.eq([CardName.EARTH_OFFICE]);
    expect(player3.draftedCards.map(toName)).deep.eq([CardName.IMPORTED_GHG]);

    // Second card

    expect(draftSelection(player1)).deep.eq([
      CardName.ADAPTED_LICHEN,
      CardName.KELP_FARMING,
      CardName.LAND_CLAIM,
    ]);

    expect(draftSelection(player2)).deep.eq([
      CardName.BLACK_POLAR_DUST,
      CardName.CAPITAL,
      CardName.DECOMPOSERS,
    ]);

    expect(draftSelection(player3)).deep.eq([
      CardName.FISH,
      CardName.GENE_REPAIR,
      CardName.HACKERS,
    ]);

    selectCard(player1, CardName.ADAPTED_LICHEN);
    selectCard(player2, CardName.BLACK_POLAR_DUST);
    selectCard(player3, CardName.FISH);

    expect(player1.draftedCards.map(toName)).deep.eq([
      CardName.ACQUIRED_COMPANY,
      CardName.ADAPTED_LICHEN,
    ]);
    expect(player2.draftedCards.map(toName)).deep.eq([
      CardName.EARTH_OFFICE,
      CardName.BLACK_POLAR_DUST,
    ]);
    expect(player3.draftedCards.map(toName)).deep.eq([
      CardName.IMPORTED_GHG,
      CardName.FISH,
    ]);

    // Third round

    expect(draftSelection(player1)).deep.eq([
      CardName.GENE_REPAIR,
      CardName.HACKERS,
    ]);

    expect(draftSelection(player2)).deep.eq([
      CardName.KELP_FARMING,
      CardName.LAND_CLAIM,
    ]);

    expect(draftSelection(player3)).deep.eq([
      CardName.CAPITAL,
      CardName.DECOMPOSERS,
    ]);

    selectCard(player1, CardName.GENE_REPAIR);
    selectCard(player2, CardName.KELP_FARMING);
    selectCard(player3, CardName.CAPITAL);

    // No longer drafted cards, they're just cards to buy.
    expect(player1.draftedCards).is.empty;
    expect(player2.draftedCards).is.empty;
    expect(player3.draftedCards).is.empty;

    expect(draftSelection(player1)).deep.eq([
      CardName.ACQUIRED_COMPANY,
      CardName.ADAPTED_LICHEN,
      CardName.GENE_REPAIR,
      CardName.DECOMPOSERS,
    ]);
    expect(draftSelection(player2)).deep.eq([
      CardName.EARTH_OFFICE,
      CardName.BLACK_POLAR_DUST,
      CardName.KELP_FARMING,
      CardName.HACKERS,
    ]);
    expect(draftSelection(player3)).deep.eq([
      CardName.IMPORTED_GHG,
      CardName.FISH,
      CardName.CAPITAL,
      CardName.LAND_CLAIM,
    ]);
  });

  it('3 player - project draft - odd generation', () => {
    const [game, player1, player2, player3] = testGame(3, {
    });
    const drawPile = game.projectDeck.drawPile;

    unshiftCards(drawPile, [
      CardName.ACQUIRED_COMPANY,
      CardName.BLACK_POLAR_DUST,
      CardName.CAPITAL,
      CardName.DECOMPOSERS,
      CardName.EARTH_OFFICE,
      CardName.FISH,
      CardName.GENE_REPAIR,
      CardName.HACKERS,
      CardName.IMPORTED_GHG,
      CardName.ADAPTED_LICHEN,
      CardName.KELP_FARMING,
      CardName.LAND_CLAIM,
    ]);

    game.generation = 2;
    // This moves into draft phase
    finishGeneration(game);

    // First round

    expect(draftSelection(player1)).deep.eq([
      CardName.ACQUIRED_COMPANY,
      CardName.BLACK_POLAR_DUST,
      CardName.CAPITAL,
      CardName.DECOMPOSERS,
    ]);

    expect(draftSelection(player2)).deep.eq([
      CardName.EARTH_OFFICE,
      CardName.FISH,
      CardName.GENE_REPAIR,
      CardName.HACKERS,
    ]);

    expect(draftSelection(player3)).deep.eq([
      CardName.IMPORTED_GHG,
      CardName.ADAPTED_LICHEN,
      CardName.KELP_FARMING,
      CardName.LAND_CLAIM,
    ]);

    selectCard(player1, CardName.ACQUIRED_COMPANY);
    selectCard(player2, CardName.EARTH_OFFICE);
    selectCard(player3, CardName.IMPORTED_GHG);

    expect(player1.draftedCards.map(toName)).deep.eq([
      CardName.ACQUIRED_COMPANY,
    ]);
    expect(player2.draftedCards.map(toName)).deep.eq([CardName.EARTH_OFFICE]);
    expect(player3.draftedCards.map(toName)).deep.eq([CardName.IMPORTED_GHG]);

    // Second card

    expect(draftSelection(player1)).deep.eq([
      CardName.FISH,
      CardName.GENE_REPAIR,
      CardName.HACKERS,
    ]);

    expect(draftSelection(player2)).deep.eq([
      CardName.ADAPTED_LICHEN,
      CardName.KELP_FARMING,
      CardName.LAND_CLAIM,
    ]);

    expect(draftSelection(player3)).deep.eq([
      CardName.BLACK_POLAR_DUST,
      CardName.CAPITAL,
      CardName.DECOMPOSERS,
    ]);

    selectCard(player1, CardName.FISH);
    selectCard(player2, CardName.ADAPTED_LICHEN);
    selectCard(player3, CardName.BLACK_POLAR_DUST);

    expect(player1.draftedCards.map(toName)).deep.eq([
      CardName.ACQUIRED_COMPANY,
      CardName.FISH,
    ]);
    expect(player2.draftedCards.map(toName)).deep.eq([
      CardName.EARTH_OFFICE,
      CardName.ADAPTED_LICHEN,
    ]);
    expect(player3.draftedCards.map(toName)).deep.eq([
      CardName.IMPORTED_GHG,
      CardName.BLACK_POLAR_DUST,
    ]);

    // Third round

    expect(draftSelection(player1)).deep.eq([
      CardName.KELP_FARMING,
      CardName.LAND_CLAIM,
    ]);

    expect(draftSelection(player2)).deep.eq([
      CardName.CAPITAL,
      CardName.DECOMPOSERS,
    ]);

    expect(draftSelection(player3)).deep.eq([
      CardName.GENE_REPAIR,
      CardName.HACKERS,
    ]);

    selectCard(player1, CardName.KELP_FARMING);
    selectCard(player2, CardName.CAPITAL);
    selectCard(player3, CardName.GENE_REPAIR);

    // No longer drafted cards, they're just cards to buy.
    expect(player1.draftedCards).is.empty;
    expect(player2.draftedCards).is.empty;
    expect(player3.draftedCards).is.empty;

    expect(draftSelection(player1)).deep.eq([
      CardName.ACQUIRED_COMPANY,
      CardName.FISH,
      CardName.KELP_FARMING,
      CardName.DECOMPOSERS,
    ]);
    expect(draftSelection(player2)).deep.eq([
      CardName.EARTH_OFFICE,
      CardName.ADAPTED_LICHEN,
      CardName.CAPITAL,
      CardName.HACKERS,
    ]);
    expect(draftSelection(player3)).deep.eq([
      CardName.IMPORTED_GHG,
      CardName.BLACK_POLAR_DUST,
      CardName.GENE_REPAIR,
      CardName.LAND_CLAIM,
    ]);
  });

  it('initially drafts ten cards opposite the first standard draft direction before buying', () => {
    const [, player1, player2, player3] = testGame(3, {
      skipInitialShuffling: true,
      skipInitialCardSelection: false,
    });

    const player2InitialCards = draftSelection(player2);
    expect(draftSelection(player1)).has.length(10);
    expect(player2InitialCards).has.length(10);
    expect(draftSelection(player3)).has.length(10);

    selectCard(player1, draftSelection(player1)[0]);
    selectCard(player2, player2InitialCards[0]);
    selectCard(player3, draftSelection(player3)[0]);

    // Generation 2 passes to the next player; the initial draft passes to the previous player.
    expect(draftSelection(player1)).deep.eq(player2InitialCards.slice(1));
    expect(() => initialCardSelection(player1)).to.throw();

    for (let round = 2; round <= 9; round++) {
      for (const player of [player1, player2, player3]) {
        selectCard(player, draftSelection(player)[0]);
      }
    }

    expect(initialCardSelection(player1).projectCards).has.length(10);
    expect(initialCardSelection(player2).projectCards).has.length(10);
    expect(initialCardSelection(player3).projectCards).has.length(10);
    expect(player1.draftedCards).is.empty;
    expect(player2.draftedCards).is.empty;
    expect(player3.draftedCards).is.empty;
  });
});

// Asserts that the player is offered to reselect their draft card
// while waiting for others to draft.
function expectReselect(player: IPlayer) {
  const waitingFor = player.getWaitingFor();
  if (waitingFor === undefined) {
    throw new Error('Player is not waiting for anything');
  }

  expect(waitingFor.optional).is.true;
  expect((waitingFor.title as Message).message).to.include(
    'You can change your selection',
  );
}

function getWaitingFor(player: IPlayer): SelectCard<IProjectCard> {
  return cast(player.getWaitingFor(), SelectCard<IProjectCard>);
}

function unshiftCards(deck: Array<IProjectCard>, cards: Array<CardName>) {
  deck.unshift(...cardsFromJSON(cards));
}

function initialCardSelection(player: IPlayer) {
  function map(input: any) {
    if (input === undefined) {
      return [];
    }
    return cast(input, SelectCard).cards.map(toName);
  }
  const selectInitialCards = cast(player.getWaitingFor(), SelectInitialCards);
  return {
    corporationCards: map(selectInitialCards.inputs.corp),
    projectCards: map(selectInitialCards.inputs.project),
  };
}

function draftSelection(player: IPlayer) {
  return getWaitingFor(player).cards.map(toName);
}

function selectCard(player: TestPlayer, cardName: CardName) {
  const selectCard = cast(player.popWaitingFor(), SelectCard);
  const cards = selectCard.cards;
  const card = cards.find((c) => c.name === cardName);
  if (card === undefined) {
    throw new Error(`${cardName} isn't in list`);
  }
  selectCard.process({ type: 'card', cards: [card.name] });

  // await validateState(player);
}

// // This is a helper function to validate the state of the game after each action.
// // In ensures that after serializing and deserializing the game,
// // the state is the same, including the deferred actions.
// async function validateState(player: TestPlayer) {
//   const game = player.game;

//   const serialized = await Database.getInstance().getGameVersion(game.id, game.lastSaveId);
//   const restored = Game.deserialize(serialized);

//   expect(game.deferredActions).has.length(0);
//   expect(restored.deferredActions).has.length(0);

//   for (const id of game.players.map(toID)) {
//     const livePlayer = game.getPlayerById(id);
//     const restoredPlayer = restored.getPlayerById(id);

//     expect(livePlayer.needsToDraft).eq(restoredPlayer.needsToDraft);
//     expect(livePlayer.getWaitingFor()?.type).eq(restoredPlayer.getWaitingFor()?.type);

//     if (livePlayer.getWaitingFor() instanceof SelectCard) {
//       const liveCards = cast(livePlayer.getWaitingFor(), SelectCard).cards;
//       const restoredCards = cast(restoredPlayer.getWaitingFor(), SelectCard).cards;
//       expect(liveCards.map(toName)).deep.eq(restoredCards.map(toName);
//     }
//   }
// }
