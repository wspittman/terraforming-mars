import { expect } from 'chai';
import { MAX_TEMPERATURE } from '../../../../src/common/constants';
import { Payment } from '../../../../src/common/inputs/Payment';
import { AsteroidStandardProject } from '../../../../src/server/cards/base/standardProjects/AsteroidStandardProject';
import { IGame } from '../../../../src/server/IGame';
import { testGame } from '../../../TestGame';
import { runAllActions, setTemperature } from '../../../TestingUtils';
import { TestPlayer } from '../../../TestPlayer';
import {CardName} from '../../../../src/common/cards/CardName';

describe('AsteroidStandardProject', () => {
  let card: AsteroidStandardProject;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new AsteroidStandardProject();
    [game, player] = testGame(2);
  });

  it('Can act', () => {
    player.megaCredits = card.cost - 1;
    expect(card.canAct(player)).is.false;
    player.megaCredits = card.cost;
    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    player.megaCredits = card.cost;
    player.setTerraformRating(20);
    expect(game.getTemperature()).eq(-30);

    card.payAndExecute(player, Payment.of({megacredits: card.cost}));
    runAllActions(game);

    expect(player.megaCredits).eq(0);
    expect(player.terraformRating).eq(21);
    expect(game.getTemperature()).eq(-28);
  });

  it('Cannot act when temperature is maximized', () => {
    player.megaCredits = 14;
    setTemperature(game, MAX_TEMPERATURE);

    expect(card.canAct(player)).eq(false);
  });

  it('Is omitted from standard projects when temperature is maximized', () => {
    setTemperature(game, MAX_TEMPERATURE);

    expect(player.getStandardProjectOption().cards.map((card) => card.name)).not.to.include(CardName.ASTEROID_STANDARD_PROJECT);
  });
});
