import { SmallAnimals } from '@/server/cards/base/SmallAnimals';
import { expect } from 'chai';
import { AdvancedEcosystems } from '../../../src/server/cards/base/AdvancedEcosystems';
import { Tardigrades } from '../../../src/server/cards/base/Tardigrades';
import { TundraFarming } from '../../../src/server/cards/base/TundraFarming';
import { TestPlayer } from '../../TestPlayer';

describe('AdvancedEcosystems', () => {
  let card: AdvancedEcosystems;
  let player: TestPlayer;

  beforeEach(() => {
    card = new AdvancedEcosystems();
    player = TestPlayer.BLUE.newPlayer();
    player.playedCards.push(new TundraFarming(), new SmallAnimals());
  });

  it('Can not play if tag requirements is unmet', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    expect(card.canPlay(player)).is.not.true;

    player.playedCards.push(new Tardigrades());
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(card.getVictoryPoints(player)).to.eq(3);
  });
});
