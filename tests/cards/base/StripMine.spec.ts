import { expect } from 'chai';
import { Resource } from '../../../src/common/Resource';
import { StripMine } from '../../../src/server/cards/base/StripMine';
import { IGame } from '../../../src/server/IGame';
import { testGame } from '../../TestingUtils';
import { TestPlayer } from '../../TestPlayer';

describe('StripMine', () => {
  let card: StripMine;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new StripMine();
    [game, player] = testGame(2);
  });

  it('Can not play', () => {
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    player.production.add(Resource.ENERGY, 2);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.energy).to.eq(0);
    expect(player.production.steel).to.eq(2);
    expect(player.production.titanium).to.eq(1);
    expect(game.getOxygenLevel()).to.eq(2);
  });
});
