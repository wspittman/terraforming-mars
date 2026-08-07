import { expect } from 'chai';
import { Algae } from '../../../src/server/cards/base/Algae';
import { Birds } from '../../../src/server/cards/base/Birds';
import { Decomposers } from '../../../src/server/cards/base/Decomposers';
import { IGame } from '../../../src/server/IGame';
import { testGame } from '../../TestGame';
import { setOxygenLevel } from '../../TestingUtils';
import { TestPlayer } from '../../TestPlayer';

describe('Decomposers', () => {
  let card: Decomposers;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Decomposers();
    [game, player] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    setOxygenLevel(game, 3);
    expect(card.canPlay(player)).is.true;
    card.play(player);

    card.onCardPlayed(player, new Birds());
    expect(card.resourceCount).to.eq(1);
    card.onCardPlayed(player, card);
    expect(card.resourceCount).to.eq(2);
    card.onCardPlayed(player, new Algae());

    expect(card.resourceCount).to.eq(3);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
