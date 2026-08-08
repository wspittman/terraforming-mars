import {expect} from 'chai';
import {ConvertPlants} from '../../../../src/server/cards/base/standardActions/ConvertPlants';
import {setOxygenLevel} from '../../../TestingUtils';
import {TestPlayer} from '../../../TestPlayer';
import {Game} from '../../../../src/server/Game';
import {MAX_OXYGEN_LEVEL} from '../../../../src/common/constants';

describe('ConvertPlants', () => {
  let card: ConvertPlants;
  let player: TestPlayer;

  beforeEach(() => {
    card = new ConvertPlants();
    player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player, 'spectatorid');
  });

  it('Can not act without plants', () => {
    expect(card.canAct(player)).eq(false);
    player.plants = 7;
    expect(card.canAct(player)).eq(false);
  });


  it('Should play', () => {
    player.plants = 8;

    expect(card.canAct(player)).eq(true);
    const action = card.action(player);
    expect(action).not.eq(undefined);
    action.cb(action.spaces[0]);

    expect(player.game.getOxygenLevel()).eq(1);
  });

  it('Can act when maximized', () => {
    player.plants = 8;
    expect(card.canAct(player)).eq(true);
    setOxygenLevel(player.game, MAX_OXYGEN_LEVEL);
    expect(card.canAct(player)).eq(true);
  });
});
