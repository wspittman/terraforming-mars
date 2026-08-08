import { expect } from 'chai';
import { cast } from '../../../src/common/utils/utils';
import { AquiferPumping, OCEAN_COST } from '../../../src/server/cards/base/AquiferPumping';
import { IGame } from '../../../src/server/IGame';
import { testGame } from '../../TestGame';
import { maxOutOceans } from '../../TestingUtils';
import { TestPlayer } from '../../TestPlayer';

describe('AquiferPumping', () => {
  let card: AquiferPumping;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new AquiferPumping();
    [game, player] = testGame(2);
  });

  it('Should play', () => {
    cast(card.play(player), undefined);
  });

  it('Should act', () => {
    player.megaCredits = OCEAN_COST;
    const action = card.action(player);
    cast(action, undefined);
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(0);
  });

  it('Cannot act if not enough to pay', () => {
    expect(card.canAct(player)).is.not.true;
  });

  it('Can use steel to pay', () => {
    player.megaCredits = OCEAN_COST - 2;
    expect(card.canAct(player)).is.not.true;
    player.steel = 1;
    expect(card.canAct(player)).is.true;
  });


  it('Can act if can pay even after oceans are maxed', () => {
    maxOutOceans(player);
    player.megaCredits = 8;

    expect(card.canAct(player)).is.true;
  });
});
