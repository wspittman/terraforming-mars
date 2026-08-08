import { expect } from 'chai';
import { cast } from '../../../src/common/utils/utils';
import { GiantIceAsteroid } from '../../../src/server/cards/base/GiantIceAsteroid';
import { IGame } from '../../../src/server/IGame';
import { OrOptions } from '../../../src/server/inputs/OrOptions';
import { SelectSpace } from '../../../src/server/inputs/SelectSpace';
import { testGame } from '../../TestGame';
import { runAllActions } from '../../TestingUtils';
import { TestPlayer } from '../../TestPlayer';

describe('GiantIceAsteroid', () => {
  let card: GiantIceAsteroid;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new GiantIceAsteroid();
    [game, player, player2, player3] = testGame(3);
  });

  it('Should play', () => {
    player2.plants = 4;
    player3.plants = 6;
    card.play(player);
    runAllActions(game);

    const firstOcean = cast(player.popWaitingFor(), SelectSpace);
    firstOcean.cb(firstOcean.spaces[0]);

    runAllActions(game);

    const secondOcean = cast(player.popWaitingFor(), SelectSpace);
    secondOcean.cb(secondOcean.spaces[1]);

    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    expect(orOptions.options).has.lengthOf(3);

    orOptions.options[0].cb();
    expect(player2.plants).to.eq(0);

    orOptions.options[1].cb();
    expect(player3.plants).to.eq(0);

    expect(game.getTemperature()).to.eq(-26);
    expect(player.terraformRating).to.eq(24);
  });
});
