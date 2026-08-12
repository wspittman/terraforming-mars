import { expect } from 'chai';
import { MAX_TEMPERATURE } from '../../../../src/common/constants';
import { ConvertHeat } from '../../../../src/server/cards/base/standardActions/ConvertHeat';
import { IGame } from '../../../../src/server/IGame';
import { testGame } from '../../../TestGame';
import { churn, setTemperature } from '../../../TestingUtils';
import { TestPlayer } from '../../../TestPlayer';

describe('ConvertHeat', () => {
  let card: ConvertHeat;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new ConvertHeat();
    [game, player] = testGame(2, {});
  });

  it('Can not act without heat', () => {
    expect(card.canAct(player)).eq(false);
    player.heat = 7;
    expect(card.canAct(player)).eq(false);
  });


  it('Should play', () => {
    player.heat = 8;
    expect(card.canAct(player)).eq(true);
    expect(churn(card.action(player), player)).eq(undefined);
    expect(game.getTemperature()).eq(-28);
  });

  it('Cannot act when temperature is maximized', () => {
    player.heat = 8;
    setTemperature(game, MAX_TEMPERATURE);

    expect(card.canAct(player)).eq(false);
  });
});
