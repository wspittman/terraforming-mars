import { expect } from 'chai';
import { Resource } from '../../src/common/Resource';
import { ProtectedHabitats } from '../../src/server/cards/base/ProtectedHabitats';
import { LunarSecurityStations } from '../../src/server/cards/moon/LunarSecurityStations';
import { BotanicalExperience } from '../../src/server/cards/pathfinders/BotanicalExperience';
import { RemoveResources } from '../../src/server/deferredActions/RemoveResources';
import { testGame } from '../TestGame';
import { TestPlayer } from '../TestPlayer';

describe('RemoveResources', () => {
  let player: TestPlayer;
  let target: TestPlayer;

  let removed: number;
  const andThen = (c: number) => {
    removed = c;
  };

  beforeEach(() => {
    [, /* game */ player, target] = testGame(3);
    removed = 0;
  });

  it('simple', () => {
    target.plants = 15;
    new RemoveResources(target, player, Resource.PLANTS, 2)
      .andThen(andThen)
      .execute();
    expect(removed).eq(2);
    expect(target.plants).eq(13);
  });

  it('not enough', () => {
    target.plants = 1;
    new RemoveResources(target, player, Resource.PLANTS, 2)
      .andThen(andThen)
      .execute();
    expect(removed).eq(1);
    expect(target.plants).eq(0);
  });

  it('Protected Habitats', () => {
    target.plants = 5;
    target.playedCards.push(new ProtectedHabitats());
    new RemoveResources(target, player, Resource.PLANTS, 2)
      .andThen(andThen)
      .execute();
    expect(removed).eq(0);
    expect(target.plants).eq(5);
  });

  it('Protected Habitats works only for plants', () => {
    target.steel = 5;
    target.playedCards.push(new ProtectedHabitats());
    new RemoveResources(target, player, Resource.STEEL, 2)
      .andThen(andThen)
      .execute();
    expect(removed).eq(2);
    expect(target.steel).eq(3);
  });

  it('Botanical Experience', () => {
    target.plants = 5;
    target.playedCards.push(new BotanicalExperience());
    new RemoveResources(target, player, Resource.PLANTS, 4)
      .andThen(andThen)
      .execute();
    expect(removed).eq(2);
    expect(target.plants).eq(3);
  });

  it('Lunar Security Stations', () => {
    target.steel = 5;
    target.playedCards.push(new LunarSecurityStations());
    new RemoveResources(target, player, Resource.STEEL, 2)
      .andThen(andThen)
      .execute();
    expect(removed).eq(0);
    expect(target.steel).eq(5);
  });

  it('Lunar Security Stations works only for alloys', () => {
    target.plants = 5;
    target.playedCards.push(new LunarSecurityStations());
    new RemoveResources(target, player, Resource.PLANTS, 2)
      .andThen(andThen)
      .execute();
    expect(removed).eq(2);
    expect(target.plants).eq(3);
  });
});
