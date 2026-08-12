import {expect} from 'chai';
import {OreProcessor} from '../../../src/server/cards/base/OreProcessor';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {MAX_OXYGEN_LEVEL} from '../../../src/common/constants';
import {setOxygenLevel} from '../../TestingUtils';

describe('OreProcessor', () => {
  let card: OreProcessor;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new OreProcessor();
    [game, player] = testGame(2);
  });

  it('Can not act', () => {
    player.energy = 3;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', () => {
    player.energy = 4;
    expect(card.canAct(player)).is.true;
    card.action(player);

    expect(player.energy).to.eq(0);
    expect(player.titanium).to.eq(1);
    expect(game.getOxygenLevel()).to.eq(1);
  });

  it('Can still act for titanium when oxygen is maximized', () => {
    player.energy = 4;
    setOxygenLevel(game, MAX_OXYGEN_LEVEL);

    expect(card.canAct(player)).is.true;
  });
});
