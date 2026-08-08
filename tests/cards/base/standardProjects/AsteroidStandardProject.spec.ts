import { expect } from 'chai';
import { MAX_TEMPERATURE } from '../../../../src/common/constants';
import { Payment } from '../../../../src/common/inputs/Payment';
import { AsteroidStandardProject } from '../../../../src/server/cards/base/standardProjects/AsteroidStandardProject';
import { IGame } from '../../../../src/server/IGame';
import { testGame } from '../../../TestGame';
import { runAllActions, setTemperature } from '../../../TestingUtils';
import { TestPlayer } from '../../../TestPlayer';

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

  it('Paying when the global parameter is at its goal is a valid stall action', () => {
    player.megaCredits = 14;
    expect(card.canAct(player)).eq(true);

    setTemperature(game, MAX_TEMPERATURE);

    expect(player.terraformRating).eq(20);
    expect(card.canAct(player)).eq(true);

    card.payAndExecute(player, Payment.of({megacredits: card.cost}));
    runAllActions(game);

    expect(game.getTemperature()).eq(MAX_TEMPERATURE);
    expect(player.terraformRating).eq(20);
    expect(player.megaCredits).eq(0);
  });
});
