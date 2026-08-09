import { expect } from 'chai';
import { TileType } from '../../../src/common/TileType';
import { cast } from '../../../src/common/utils/utils';
import { EcologicalZone } from '../../../src/server/cards/base/EcologicalZone';
import { IGame } from '../../../src/server/IGame';
import { SelectSpace } from '../../../src/server/inputs/SelectSpace';
import { testGame } from '../../TestGame';
import { runAllActions } from '../../TestingUtils';
import { TestPlayer } from '../../TestPlayer';

describe('EcologicalZone', () => {
  let card: EcologicalZone;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new EcologicalZone();
    [game, player] = testGame(2);
  });

  it('Cannot play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    expect(card.canPlay(player)).is.false;

    const landSpace = game.board.getAvailableSpacesOnLand(player)[0];
    game.addGreenery(player, landSpace);

    expect(card.canPlay(player)).is.true;

    cast(card.play(player), undefined);
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);

    const adjacentSpace = selectSpace.spaces[0];
    selectSpace.cb(adjacentSpace);
    expect(adjacentSpace.tile?.tileType).to.eq(TileType.ECOLOGICAL_ZONE);

    card.onCardPlayed(player, card);
    expect(card.resourceCount).to.eq(2);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
