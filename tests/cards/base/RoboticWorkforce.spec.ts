import { MiningGuild } from '@/server/cards/corporation/MiningGuild';
import { fail } from 'assert';
import { expect } from 'chai';
import { ALL_RESOURCES, Resource } from '../../../src/common/Resource';
import { Units } from '../../../src/common/Units';
import { Tag } from '../../../src/common/cards/Tag';
import { cast } from '../../../src/common/utils/utils';
import { IGame } from '../../../src/server/IGame';
import { ALL_MODULE_MANIFESTS } from '../../../src/server/cards/AllManifests';
import { ICard } from '../../../src/server/cards/ICard';
import { isIProjectCard } from '../../../src/server/cards/IProjectCard';
import { CardManifest } from '../../../src/server/cards/ModuleManifest';
import { BiomassCombustors } from '../../../src/server/cards/base/BiomassCombustors';
import { Capital } from '../../../src/server/cards/base/Capital';
import { FoodFactory } from '../../../src/server/cards/base/FoodFactory';
import { HeatTrappers } from '../../../src/server/cards/base/HeatTrappers';
import { MarsUniversity } from '../../../src/server/cards/base/MarsUniversity';
import { NoctisFarming } from '../../../src/server/cards/base/NoctisFarming';
import { RoboticWorkforce } from '../../../src/server/cards/base/RoboticWorkforce';
import { SolarWindPower } from '../../../src/server/cards/base/SolarWindPower';
import { isICorporationCard } from '../../../src/server/cards/corporation/ICorporationCard';
import { SelectCard } from '../../../src/server/inputs/SelectCard';
import { SelectSpace } from '../../../src/server/inputs/SelectSpace';
import { testGame } from '../../TestGame';
import { TestPlayer } from '../../TestPlayer';
import {
  addCity,
  addOcean,
  fakeCard,
  runAllActions,
  runNextAction,
} from '../../TestingUtils';

describe('RoboticWorkforce', () => {
  let card: RoboticWorkforce;
  let player: TestPlayer;
  let game: IGame;
  let player2: TestPlayer;

  beforeEach(() => {
    card = new RoboticWorkforce();
    [game, player, player2] = testGame(2, {});
  });

  it('Cannot play if no building cards to copy', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Cannot play when production must go down', () => {
    // Food factory needs one unit of plant production
    player.playedCards.push(new FoodFactory());
    expect(card.canPlay(player)).is.not.true;

    player.production.override({ plants: 1 });
    expect(card.canPlay(player)).is.true;
  });

  it('Cannot play when any production must go down', () => {
    // Biomass Combustors needs any player to have plant production
    player.playedCards.push(new BiomassCombustors());
    expect(card.canPlay(player)).is.not.true;

    player2.production.override({ plants: 1 });
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    const noctisFarming = new NoctisFarming();
    player.playedCards.push(noctisFarming);

    cast(card.play(player), undefined);
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard);
    selectCard.cb([noctisFarming]);
    expect(player.production.megacredits).to.eq(1);
  });

  it('Should work with capital', () => {
    const capital = new Capital();
    player.playedCards.push(capital);

    cast(card.play(player), undefined);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined); // Not enough energy production

    player.production.add(Resource.ENERGY, 2);

    cast(card.play(player), undefined);
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard);

    selectCard.cb([capital]);
    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(5);
  });

  it('Should play with corporation cards', () => {
    const corporationCard = new MiningGuild();
    player.playedCards.push(corporationCard);

    cast(card.play(player), undefined);
    runAllActions(game);

    expect(player.production.steel).to.eq(0);
    expect(player.production.titanium).to.eq(0);

    cast(player.popWaitingFor(), SelectCard).cb([corporationCard]);

    expect(player.production.steel).to.eq(1);
    expect(player.production.titanium).to.eq(0);
  });

  it('Should not work with Solar Wind Power (no building tag, but has production)', () => {
    player.playedCards.push(new SolarWindPower());

    expect(card.canPlay(player)).is.false;
    cast(card.play(player), undefined);
  });

  it('Should not work with Mars University (building tag, no production)', () => {
    player.playedCards.push(new MarsUniversity());

    expect(card.canPlay(player)).is.false;
    cast(card.play(player), undefined);
  });

  it('Should work with Heat Trappers', () => {
    const heatTrappers = new HeatTrappers();
    player.playedCards.push(heatTrappers);
    player.production.override(Units.of({ heat: 1 }));
    player2.production.override(Units.of({ heat: 1 }));

    expect(card.canPlay(player)).is.false;

    player2.production.override(Units.of({ heat: 2 }));

    expect(card.canPlay(player)).is.true;

    cast(card.play(player), undefined);
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard);

    expect(selectCard.cards).deep.eq([heatTrappers]);

    selectCard.cb([heatTrappers]);
    runAllActions(game);

    expect(player.production.asUnits()).deep.eq(
      Units.of({ heat: 1, energy: 1 }),
    );
    expect(player2.production.asUnits()).deep.eq(Units.EMPTY);
  });

  describe('test all cards', () => {
    ALL_MODULE_MANIFESTS.forEach((manifest) => {
      const cards: CardManifest<ICard> = {
        ...manifest.projectCards,
        ...manifest.corporationCards,
      };
      for (const [cardName, factory] of CardManifest.entries(cards)) {
        it(cardName, () => {
          const card = new factory!.Factory();
          testCard(card);
        });
      }
    });

    const testCard = function(card: ICard) {
      let include = false;
      if (
        (card.tags.includes(Tag.BUILDING) || card.tags.includes(Tag.WILD)) &&
        card.play !== undefined
      ) {
        // Create new players, set all productions to 2
        [game, player, player2] = testGame(2, {
        });

        player.production.override({
          megacredits: 2,
          steel: 2,
          titanium: 2,
          plants: 2,
          energy: 2,
          heat: 2,
        });
        player2.production.override({
          megacredits: 2,
          steel: 2,
          titanium: 2,
          plants: 2,
          energy: 2,
          heat: 2,
        });


        addCity(player, '17');
        addCity(player, '19');
        addOcean(player, '32');
        addOcean(player, '33');
        addOcean(player, '34');

        // Some moon cards need steel and titanium
        player.steel = 2;
        player.titanium = 2;

        expect(game.deferredActions).has.lengthOf(0);

        // Make sure to trigger any tag based production
        player.playedCards.push(
          fakeCard({
            tags: [Tag.WILD, Tag.WILD, Tag.WILD, Tag.WILD, Tag.WILD],
          }),
        );

        if (isICorporationCard(card)) {
          player.playCorporationCard(card);
        } else if (isIProjectCard(card)) {
          player.playCard(card);
        }

        // SelectSpace will trigger production changes in the right cards (e.g. Mining Rights)
        while (game.deferredActions.length) {
          runNextAction(game);
          const waitingFor = player.popWaitingFor();
          if (waitingFor instanceof SelectSpace) {
            waitingFor.cb(waitingFor.spaces[0]);
          }
        }

        // Now if any of the production changed, that means the card has a production change
        include =
          ALL_RESOURCES.filter((prod) => player.production[prod] !== 2).length >
          0;
      }

      console.log(
        `        ${card.name}: ${include ? 'eligible' : 'ineligible'}`,
      );
      // The card must have behavior, or a productionBox method.
      if (include) {
        if (card.productionBox === undefined) {
          const production = card.behavior?.production;
          if (
            production === undefined ||
            (Units.isUnits(production) && Units.isEmpty(production))
          ) {
            fail(card.name + ' should be registered for Robotic Workforce');
          }
        }
      }
    };
  });
});
