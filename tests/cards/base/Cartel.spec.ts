import { expect } from 'chai';
import { Cartel } from '../../../src/server/cards/base/Cartel';
import { LunarBeam } from '../../../src/server/cards/base/LunarBeam';
import { testGame } from '../../TestGame';
import { TestPlayer } from '../../TestPlayer';

describe('Cartel', () => {
  let card: Cartel;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Cartel();
    [/* game */, player] = testGame(2);
  });

  it('Should play', () => {
    card.play(player);
    expect(player.production.megacredits).to.eq(1);

    player.playedCards.push(new LunarBeam()); // green card with an earth tag.

    card.play(player);
    expect(player.production.megacredits).to.eq(3);
  });
});
