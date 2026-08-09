import { expect } from 'chai';
import { SpaceName } from '../../../src/common/boards/SpaceName';
import { Resource } from '../../../src/common/Resource';
import { TileType } from '../../../src/common/TileType';
import { NoctisCity } from '../../../src/server/cards/base/NoctisCity';
import { IGame } from '../../../src/server/IGame';
import { testGame } from '../../TestGame';
import { TestPlayer } from '../../TestPlayer';

describe('NoctisCity', () => {
  let card: NoctisCity;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new NoctisCity();
    [game, player] = testGame(2);
  });

  it('Cannot play without energy production', () => {
    expect(card.canPlay(player)).is.not.true;
  });


  it('Should play', () => {
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(3);

    const noctis = game.board.getSpaceOrThrow(SpaceName.NOCTIS_CITY);
    expect(noctis.tile?.tileType).to.eq(TileType.CITY);
  });
});
