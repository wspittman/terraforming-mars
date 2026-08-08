import { expect } from 'chai';
import { CardName } from '../src/common/cards/CardName';
import { toName } from '../src/common/utils/utils';
import {
  DEFAULT_GAME_OPTIONS,
  GameOptions,
} from '../src/server/game/GameOptions';
import { GameCards } from '../src/server/GameCards';

describe('GameCards', () => {
  it('correctly separates 71 corporate era cards', () => {
    // include corporate era
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
    };
    expect(new GameCards(gameOptions).getProjectCards().length).to.eq(208);

    // exclude corporate era
    gameOptions.corporateEra = false;
    expect(new GameCards(gameOptions).getProjectCards().length).to.eq(137);
  });

  it('ignores legacy expansion options', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      preludeExtension: true,
      venusNextExtension: true,
      coloniesExtension: true,
      turmoilExtension: true,
      communityCardsOption: true,
      aresExtension: true,
    };

    const cards = new GameCards(gameOptions);
    expect(cards.getProjectCards()).to.have.length(208);
    expect(cards.getPreludeCards()).to.be.empty;
    expect(cards.getCeoCards()).to.be.empty;
  });

  it('correctly removes banned cards', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      bannedCards: [CardName.SOLAR_WIND_POWER],
    };
    const names = new GameCards(gameOptions).getProjectCards().map(toName);
    expect(names).to.not.contain(CardName.SOLAR_WIND_POWER);
  });

  it('should not include the included cards in the standard projects', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      includedCards: [CardName.VENUSIAN_INSECTS],
    };
    const names = new GameCards(gameOptions).getStandardProjects().map(toName);
    expect(names).to.not.contain(CardName.VENUSIAN_INSECTS);
  });

  it('should not include the included cards in the preludes', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      includedCards: [CardName.VENUSIAN_INSECTS],
    };
    const names = new GameCards(gameOptions).getPreludeCards().map(toName);
    expect(names).to.not.contain(CardName.VENUSIAN_INSECTS);
  });

  it('should not include the included cards in the corporation cards', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      includedCards: [CardName.VENUSIAN_INSECTS],
    };
    const names = new GameCards(gameOptions).getCorporationCards().map(toName);
    expect(names).to.not.contain(CardName.VENUSIAN_INSECTS);
  });

  it('should not include corporation cards in the included cards', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      includedCards: [CardName.ECOLINE],
    };
    const names = new GameCards(gameOptions).getProjectCards().map(toName);
    expect(names).to.not.contain(CardName.ECOLINE);
  });

  it('should not include standard projects in the included cards', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      includedCards: [CardName.GREENERY_STANDARD_PROJECT],
    };
    expect(() => new GameCards(gameOptions).getProjectCards()).to.throw(
      'Card [Greenery] not found',
    );
  });

  it('does not duplicate corporations when customCorporationsList mixes old and new card names', () => {
    // 'Thorgate' is the old name; CardName.THORGATE ('ThorGate') is canonical. Both are in base manifest.
    // 'EcoLine' is the old name; CardName.ECOLINE ('Ecoline') is canonical.
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      customCorporationsList: [
        'Thorgate' as CardName,
        CardName.THORGATE,
        'EcoLine' as CardName,
        CardName.ECOLINE,
      ],
    };
    const corps = new GameCards(gameOptions).getCorporationCards();
    const thorgates = corps.filter((c) => c.name === CardName.THORGATE);
    const ecolines = corps.filter((c) => c.name === CardName.ECOLINE);
    expect(thorgates).to.have.length(1);
    expect(ecolines).to.have.length(1);
  });
});
