import { expect } from 'chai';
import { CardResource } from '../../../src/common/CardResource';
import { AltSecondaryTag } from '../../../src/common/cards/render/AltSecondaryTag';
import { CardRenderItemType } from '../../../src/common/cards/render/CardRenderItemType';
import { Size } from '../../../src/common/cards/render/Size';
import { Tag } from '../../../src/common/cards/Tag';
import { cast } from '../../../src/common/utils/utils';
import { CardRenderer } from '../../../src/server/cards/render/CardRenderer';
import { CardRenderItem } from '../../../src/server/cards/render/CardRenderItem';

describe('CardRenderer', () => {
  describe('temperature', () => {
    it('success', () => {
      const renderer = CardRenderer.builder((b) => b.temperature(1));
      const item = cast(renderer.rows[0][0], CardRenderItem);
      expect(item.type).to.equal(CardRenderItemType.TEMPERATURE);
      expect(item.amount).to.equal(1);
    });
  });
  describe('oceans', () => {
    it('success', () => {
      const renderer = CardRenderer.builder((b) => b.oceans(1));
      const item = cast(renderer.rows[0][0], CardRenderItem);
      expect(item.type).to.equal(CardRenderItemType.OCEANS);
      expect(item.amount).to.equal(1);
    });
  });
  describe('oxygen', () => {
    it('success', () => {
      const renderer = CardRenderer.builder((b) => b.oxygen(3));
      const item = cast(renderer.rows[0][0], CardRenderItem);
      expect(item.type).to.equal(CardRenderItemType.OXYGEN);
      expect(item.amount).to.equal(3);
    });
  });
  it('plants: success', () => {
    const renderer = CardRenderer.builder((b) => b.plants(-5));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.PLANTS);
    expect(item.amount).to.equal(-5);
  });
  it('heat: success', () => {
    const renderer = CardRenderer.builder((b) => b.heat(2));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.HEAT);
    expect(item.amount).to.equal(2);
  });
  it('energy: success', () => {
    const renderer = CardRenderer.builder((b) => b.energy(3));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.ENERGY);
    expect(item.amount).to.equal(3);
  });
  describe('titanium', () => {
    it('success', () => {
      const renderer = CardRenderer.builder((b) => b.titanium(3));
      const item = cast(renderer.rows[0][0], CardRenderItem);
      expect(item.type).to.equal(CardRenderItemType.TITANIUM);
      expect(item.amount).to.equal(3);
    });
  });
  it('steel: success', () => {
    const renderer = CardRenderer.builder((b) => b.steel(2));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.STEEL);
    expect(item.amount).to.equal(2);
  });
  describe('tr', () => {
    it('success', () => {
      const renderer = CardRenderer.builder((b) => b.tr(10));
      const item = cast(renderer.rows[0][0], CardRenderItem);
      expect(item.type).to.equal(CardRenderItemType.TR);
      expect(item.amount).to.equal(10);
    });
    it('size - S', () => {
      const renderer = CardRenderer.builder((b) => b.tr(6, {size: Size.SMALL}));
      const item = cast(renderer.rows[0][0], CardRenderItem);
      expect(item.amount).to.equal(6);
      expect(item.size).to.equal(Size.SMALL);
      expect(item.cancelled).to.be.undefined;
    });
    it('cancelled', () => {
      const renderer = CardRenderer.builder((b) => b.tr(6, {size: Size.SMALL, cancelled: true}));
      const item = cast(renderer.rows[0][0], CardRenderItem);
      expect(item.amount).to.equal(6);
      expect(item.size).to.equal(Size.SMALL);
      expect(item.cancelled).to.be.true;
    });
  });
  describe('megacredits', () => {
    it('success - amount inside (always)', () => {
      const renderer = CardRenderer.builder((b) => b.megacredits(45));
      const item = cast(renderer.rows[0][0], CardRenderItem);
      expect(item.type).to.equal(CardRenderItemType.MEGACREDITS);
      expect(item.amount).to.equal(45);
      expect(item.showDigit).to.be.undefined;
      expect(item.amountInside).to.be.true;
    });
    it('size - s', () => {
      const renderer = CardRenderer.builder((b) => b.megacredits(16, {size: Size.SMALL}));
      const item = cast(renderer.rows[0][0], CardRenderItem);
      expect(item.type).to.equal(CardRenderItemType.MEGACREDITS);
      expect(item.amount).to.equal(16);
      expect(item.showDigit).to.be.undefined;
      expect(item.amountInside).to.be.true;
      expect(item.size).to.equal(Size.SMALL);
    });
  });
  it('cards: success', () => {
    const renderer = CardRenderer.builder((b) => b.cards(3));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.CARDS);
    expect(item.amount).to.equal(3);
  });
  it('event: success', () => {
    const renderer = CardRenderer.builder((b) => b.tag(Tag.EVENT));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.TAG);
    expect(item.tag).to.equal(Tag.EVENT);
    expect(item.amount).to.equal(-1);
  });
  it('space: success', () => {
    const renderer = CardRenderer.builder((b) => b.tag(Tag.SPACE));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.TAG);
    expect(item.tag).to.equal(Tag.SPACE);
    expect(item.amount).to.equal(-1);
  });
  it('earth: success', () => {
    const renderer = CardRenderer.builder((b) => b.tag(Tag.EARTH));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.TAG);
    expect(item.tag).to.equal(Tag.EARTH);
    expect(item.amount).to.equal(-1);
  });
  it('building: success', () => {
    const renderer = CardRenderer.builder((b) => b.tag(Tag.BUILDING, 2));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.TAG);
    expect(item.tag).to.equal(Tag.BUILDING);
    expect(item.amount).to.equal(2);
  });
  it('jovian: success', () => {
    const renderer = CardRenderer.builder((b) => b.tag(Tag.JOVIAN));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.TAG);
    expect(item.tag).to.equal(Tag.JOVIAN);
    expect(item.amount).to.equal(-1);
  });
  it('science: success', () => {
    const renderer = CardRenderer.builder((b) => b.resource(CardResource.SCIENCE, 3));
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.RESOURCE);
    expect(item.resource).to.equal(CardResource.SCIENCE);
    expect(item.amount).to.equal(3);
  });
  describe('colonies', () => {
  });
  it('city: success', () => {
    const renderer = CardRenderer.builder((b) => b.city());
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.CITY);
    expect(item.amount).to.equal(-1);
  });
  describe('greenery', () => {
    it('success', () => {
      const renderer = CardRenderer.builder((b) => b.greenery());
      const item = cast(renderer.rows[0][0], CardRenderItem);
      expect(item.type).to.equal(CardRenderItemType.GREENERY);
      expect(item.amount).to.equal(-1);
    });
    it('size - s', () => {
      const renderer = CardRenderer.builder((b) => b.greenery({size: Size.SMALL}));
      const item = cast(renderer.rows[0][0], CardRenderItem);
      expect(item.type).to.equal(CardRenderItemType.GREENERY);
      expect(item.size).to.equal(Size.SMALL);
      expect(item.amount).to.equal(-1);
    });
    it('without 02', () => {
      const renderer = CardRenderer.builder((b) => b.greenery());
      const item = cast(renderer.rows[0][0], CardRenderItem);
      expect(item.type).to.equal(CardRenderItemType.GREENERY);
      expect(item.secondaryTag).to.equal(AltSecondaryTag.OXYGEN);
      expect(item.amount).to.equal(-1);
    });
  });
  it('corporation: success', () => {
    const renderer = CardRenderer.builder((b) => b.corporation());
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.CORPORATION);
    expect(item.amount).to.equal(-1);
  });
  it('award: success', () => {
    const renderer = CardRenderer.builder((b) => b.award());
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.AWARD);
    expect(item.amount).to.equal(-1);
  });
  it('vpIcon: success', () => {
    const renderer = CardRenderer.builder((b) => b.vpIcon());
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.VP);
    expect(item.amount).to.equal(-1);
  });
  it('multiplierWhite: success', () => {
    const renderer = CardRenderer.builder((b) => b.multiplierWhite());
    const item = cast(renderer.rows[0][0], CardRenderItem);
    expect(item.type).to.equal(CardRenderItemType.MULTIPLIER_WHITE);
    expect(item.amount).to.equal(-1);
  });
});
