import { expect } from 'chai';
import { cast } from '../../../src/common/utils/utils';
import { LakeMarineris } from '../../../src/server/cards/base/LakeMarineris';
import { IGame } from '../../../src/server/IGame';
import { SelectSpace } from '../../../src/server/inputs/SelectSpace';
import { testGame } from '../../TestGame';
import { setTemperature } from '../../TestingUtils';
import { TestPlayer } from '../../TestPlayer';

describe('LakeMarineris', () => {
  let card: LakeMarineris;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new LakeMarineris();
    [game, player] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    setTemperature(game, 0);
    expect(card.canPlay(player)).is.true;
    card.play(player);

    expect(game.deferredActions).has.lengthOf(2);
    const firstOcean = cast(game.deferredActions.pop()!.execute(), SelectSpace);
    firstOcean.cb(firstOcean.spaces[0]);
    const secondOcean = cast(game.deferredActions.pop()!.execute(), SelectSpace);
    secondOcean.cb(secondOcean.spaces[1]);
    expect(player.terraformRating).to.eq(22);

    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
