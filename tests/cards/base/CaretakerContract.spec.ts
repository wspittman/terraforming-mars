import { expect } from 'chai';
import { CaretakerContract } from '../../../src/server/cards/base/CaretakerContract';
import { IGame } from '../../../src/server/IGame';
import { testGame } from '../../TestGame';
import { setTemperature } from '../../TestingUtils';
import { TestPlayer } from '../../TestPlayer';

describe('CaretakerContract', () => {
  let card: CaretakerContract;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new CaretakerContract();
    [game, player] = testGame(2);
  });

  it('Cannot play or act', () => {
    expect(card.canPlay(player)).is.not.true;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should play', () => {
    setTemperature(game, 0);
    expect(card.canPlay(player)).is.true;
  });

  it('Cannot act', () => {
    player.heat = 7;
    expect(card.canAct(player)).is.false;
    player.heat = 8;
    expect(card.canAct(player)).is.true;
  });
  it('Should act', () => {
    player.heat = 8;
    card.action(player);
    expect(player.heat).to.eq(0);
    expect(player.terraformRating).to.eq(21);
  });
});
