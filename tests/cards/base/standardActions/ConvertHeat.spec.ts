import { expect } from 'chai';
import { MAX_TEMPERATURE } from '../../../../src/common/constants';
import { cast } from '../../../../src/common/utils/utils';
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

  it('Spending heat when the global parameter is at its goal is a valid stall action', () => {
    player.heat = 8;

    expect(card.canAct(player)).eq(true);

    setTemperature(game, MAX_TEMPERATURE);

    expect(player.terraformRating).eq(20);
    expect(card.canAct(player)).eq(true);

    cast(card.action(player), undefined);

    expect(game.getTemperature()).eq(MAX_TEMPERATURE);
    expect(player.heat).eq(0);
    expect(player.terraformRating).eq(20);
  });

  it('canAct adds maxtemp warning at MAX_TEMPERATURE', () => {
    player.heat = 8;
    setTemperature(game, MAX_TEMPERATURE);

    expect(card.warnings.has('maxtemp')).is.false;
    expect(card.canAct(player)).eq(true);
    expect(card.warnings.has('maxtemp')).is.true;
  });
});
