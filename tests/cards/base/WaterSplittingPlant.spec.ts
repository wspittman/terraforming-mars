import { expect } from 'chai';
import { WaterSplittingPlant } from '../../../src/server/cards/base/WaterSplittingPlant';
import { IGame } from '../../../src/server/IGame';
import { testGame } from '../../TestGame';
import { maxOutOceans } from '../../TestingUtils';
import { TestPlayer } from '../../TestPlayer';

describe('WaterSplittingPlant', () => {
  let card: WaterSplittingPlant;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new WaterSplittingPlant();
    [game, player] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play', () => {
    maxOutOceans(player, 2);
    expect(card.canPlay(player)).is.true;
  });

  it('Can not act', () => {
    player.energy = 2;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', () => {
    player.energy = 3;
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.energy).to.eq(0);
    expect(game.getOxygenLevel()).to.eq(1);
  });


  // canAct needs bespoke behavior, or better behavior in the execu
});
