import { expect } from 'chai';
import { cast } from '../../../src/common/utils/utils';
import { Plantation } from '../../../src/server/cards/base/Plantation';
import { IGame } from '../../../src/server/IGame';
import { SelectSpace } from '../../../src/server/inputs/SelectSpace';
import { testGame } from '../../TestGame';
import { runAllActions } from '../../TestingUtils';
import { TestPlayer } from '../../TestPlayer';

describe('Plantation', () => {
  let card: Plantation;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Plantation();
    [game, player] = testGame(2);
  });

  it('canPlay', () => {
    player.tagsForTest = {science: 1};
    expect(card.canPlay(player)).is.not.true;
    player.tagsForTest = {science: 2};
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    cast(card.play(player), undefined);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    action.cb(action.spaces[0]);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
