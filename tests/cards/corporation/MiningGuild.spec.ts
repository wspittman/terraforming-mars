import { expect } from 'chai';
import { SpaceBonus } from '../../../src/common/boards/SpaceBonus';
import { SpaceType } from '../../../src/common/boards/SpaceType';
import { Phase } from '../../../src/common/Phase';
import { BoardType } from '../../../src/server/boards/BoardType';
import { MiningGuild } from '../../../src/server/cards/corporation/MiningGuild';
import { IGame } from '../../../src/server/IGame';
import { testGame } from '../../TestGame';
import { maxOutOceans, runAllActions } from '../../TestingUtils';
import { TestPlayer } from '../../TestPlayer';

describe('MiningGuild', () => {
  let card: MiningGuild;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new MiningGuild();
    [game, player, player2] = testGame(2, {
    });

    player.playedCards.push(card);
  });

  it('Should play', () => {
    card.play(player);
    expect(player.steel).to.eq(5);
    expect(player.production.steel).to.eq(1);
  });

  it('Gives steel production bonus when placing tiles', () => {
    const space = game.board.getAvailableSpacesOnLand(player)[0];
    card.onTilePlaced(
      player,
      player,
      {
        player,
        spaceType: SpaceType.LAND,
        x: 0,
        y: 0,
        id: space.id,
        bonus: [],
      },
      BoardType.MARS,
    );
    runAllActions(game);
    expect(player.production.steel).to.eq(0);

    card.onTilePlaced(
      player,
      player,
      {
        player,
        spaceType: SpaceType.LAND,
        x: 0,
        y: 0,
        id: space.id,
        bonus: [SpaceBonus.STEEL, SpaceBonus.TITANIUM],
      },
      BoardType.MARS,
    );
    runAllActions(game);
    expect(player.production.steel).to.eq(1);

    card.onTilePlaced(
      player,
      player,
      {
        player,
        spaceType: SpaceType.LAND,
        x: 0,
        y: 0,
        id: space.id,
        bonus: [SpaceBonus.STEEL],
      },
      BoardType.MARS,
    );
    runAllActions(game);
    expect(player.production.steel).to.eq(2);

    card.onTilePlaced(
      player,
      player,
      {
        player,
        spaceType: SpaceType.LAND,
        x: 0,
        y: 0,
        id: space.id,
        bonus: [SpaceBonus.TITANIUM],
      },
      BoardType.MARS,
    );
    runAllActions(game);
    expect(player.production.steel).to.eq(3);
  });

  it('Gives steel production bonus when placing ocean tile', () => {
    game.board.getSpaces(SpaceType.OCEAN).forEach((space) => {
      if (
        space.bonus.includes(SpaceBonus.TITANIUM) ||
        space.bonus.includes(SpaceBonus.STEEL)
      ) {
        game.addOcean(player, space);
      }
    });
    // There are two spaces on the main board that grant titanium or steel.
    runAllActions(game);
    expect(player.production.steel).to.eq(2);
  });

  it('Does not give bonus when other players place tiles', () => {
    card.onTilePlaced(
      player,
      player2,
      {
        player,
        spaceType: SpaceType.LAND,
        x: 0,
        y: 0,
        id: '00',
        bonus: [SpaceBonus.TITANIUM],
      },
      BoardType.MARS,
    );
    runAllActions(game);
    expect(player.production.steel).to.eq(0);
  });

  it('Does not give bonus when other players place ocean tiles', () => {
    maxOutOceans(player2); // 1 ocean with titanium and 1 with steel
    runAllActions(game);
    expect(player.production.steel).to.eq(0);
  });

  it('Does not give bonus for WGT', () => {
    game.phase = Phase.SOLAR;
    maxOutOceans(player); // 1 ocean with titanium and 1 with steel
    runAllActions(game);
    expect(player.production.steel).to.eq(0);
  });
});
