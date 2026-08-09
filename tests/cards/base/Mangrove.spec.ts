import { expect } from 'chai';
import { TileType } from '../../../src/common/TileType';
import { cast } from '../../../src/common/utils/utils';
import { Mangrove } from '../../../src/server/cards/base/Mangrove';
import { IGame } from '../../../src/server/IGame';
import { assertPlaceTile } from '../../assertions';
import { testGame } from '../../TestGame';
import { runAllActions, setTemperature } from '../../TestingUtils';
import { TestPlayer } from '../../TestPlayer';

describe('Mangrove', () => {
  let card: Mangrove;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Mangrove();
    [game, player] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
    setTemperature(game, 2);
    expect(card.canPlay(player)).is.not.true;
    setTemperature(game, 4);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    cast(card.play(player), undefined);
    runAllActions(game);

    assertPlaceTile(player, player.popWaitingFor(), TileType.GREENERY);

    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
