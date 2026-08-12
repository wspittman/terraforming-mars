import { expect } from 'chai';
import { WaterSplittingPlant } from '../../../src/server/cards/base/WaterSplittingPlant';
import { IGame } from '../../../src/server/IGame';
import { testGame } from '../../TestGame';
import { maxOutOceans, setOxygenLevel } from '../../TestingUtils';
import {MAX_OXYGEN_LEVEL} from '../../../src/common/constants';
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

  it('Cannot act when oxygen is maximized', () => {
    player.energy = 3;
    setOxygenLevel(game, MAX_OXYGEN_LEVEL);

    expect(card.canAct(player)).is.false;
  });
});
