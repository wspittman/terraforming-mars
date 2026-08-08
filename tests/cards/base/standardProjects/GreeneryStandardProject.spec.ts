import { expect } from 'chai';
import { TileType } from '../../../../src/common/TileType';
import { MAX_OXYGEN_LEVEL } from '../../../../src/common/constants';
import { Payment } from '../../../../src/common/inputs/Payment';
import { IGame } from '../../../../src/server/IGame';
import { GreeneryStandardProject } from '../../../../src/server/cards/base/standardProjects/GreeneryStandardProject';
import { testGame } from '../../../TestGame';
import { TestPlayer } from '../../../TestPlayer';
import { runAllActions, setOxygenLevel } from '../../../TestingUtils';
import { assertPlaceTile } from '../../../assertions';

describe('GreeneryStandardProject', () => {
  let card: GreeneryStandardProject;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new GreeneryStandardProject();
    [game, player] = testGame(1);
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
    expect(game.getOxygenLevel()).eq(0);

    card.payAndExecute(player, Payment.of({megacredits: card.cost}));
    runAllActions(game);
    assertPlaceTile(player, player.popWaitingFor(), TileType.GREENERY);

    expect(player.megaCredits).eq(0);
    expect(player.terraformRating).eq(21);
    expect(game.getOxygenLevel()).eq(1);
  });

  it('can act when maximized', () => {
    player.megaCredits = card.cost;
    expect(card.canAct(player)).is.true;
    setOxygenLevel(game, MAX_OXYGEN_LEVEL);
    // Players can still place greeneries even if the oxygen level is maximized
    expect(card.canAct(player)).is.true;
  });
});
