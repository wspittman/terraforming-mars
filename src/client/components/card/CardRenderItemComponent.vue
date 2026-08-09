<template>
  <div class="card-item-container">
    <div class="card-res-amount" v-if="item.showDigit">{{ amountAbs }}</div>
    <div :class="componentClasses" v-for="index in itemsToShow" v-html="itemHtmlContent" :key="index"></div>
    <div class="card-over" v-if="item.over !== undefined">over {{item.over}}</div>
  </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import {CardRenderItemType} from '@/common/cards/render/CardRenderItemType';
import {AltSecondaryTag} from '@/common/cards/render/AltSecondaryTag';
import {Size} from '@/common/cards/render/Size';
import {Tag} from '@/common/cards/Tag';
import {ICardRenderItem, isICardRenderItem} from '@/common/cards/render/Types';
import {cardResourceCSS} from '../common/cardResources';

export default defineComponent({
  name: 'CardRenderItemComponent',
  props: {
    item: {
      type: Object as () => ICardRenderItem,
      required: true,
    },
  },
  computed: {
    resourceClass(): string {
      return (this.item.resource === undefined) ? '' : cardResourceCSS[this.item.resource];
    },
    resourceSizeClass(): string {
      if (this.item.size !== undefined) {
        return 'card-resource-size--' + this.item.size;
      }
      return '';
    },
    tagClass(): string {
      if (this.item.tag === undefined) {
        return '';
      }
      return 'tag-' + this.item.tag.toLowerCase().replaceAll(' ', '-');
    },
    tagSizeClass(): string {
      if (this.item.size !== undefined) {
        return 'tag-size--' + this.item.size;
      }
      return '';
    },
    componentClasses(): ReadonlyArray<string> {
      const classes: Array<string> = [];
      if (this.item.isSuperscript) {
        classes.push('card-superscript');
      }

      classes.push(...this.componentClassArray);

      // act upon any player
      if (this.item.anyPlayer === true) {
        classes.push('red-outline');
      }

      // golden background
      if (this.item.isPlate) {
        classes.push('card-plate');
        if (this.item.size === Size.SMALL) {
          classes.push('card-plate--narrow');
        }
      }

      // size and text
      if (this.item.text !== undefined) {
        classes.push(`card-text-size--${this.item.size}`);
        if (this.item.isUppercase) {
          classes.push('card-text-uppercase');
        }
        if (this.item.isBold) {
          classes.push('card-text-bold');
        } else {
          classes.push('card-text-normal');
        }
      }
      return classes;
    },
    tileSizeClass(): string {
      const size = this.item.size ?? Size.MEDIUM;
      const tileSizeClass = `tile-size--${size}`;
      return this.item.secondaryTag ? `tile-size--${size}-square` : tileSizeClass;
    },
    componentClassArray(): Array<string> {
      let cardResource = 'card-resource';
      if (this.item.secondaryTag) {
        cardResource = 'card-resource--has-secondary-tag';
      } else if (this.item.isSuperscript) {
        cardResource = 'card-resource--superscript';
      }
      switch (this.item.type) {
      case CardRenderItemType.TEMPERATURE: return ['card-global-requirement', 'card-temperature-global-requirement'];
      case CardRenderItemType.OXYGEN: return this.item.size !== undefined && this.item.size !== Size.MEDIUM ? ['card-global-requirement', 'card-oxygen-global-requirement', `card-oxygen--${this.item.size}`] : ['card-global-requirement', 'card-oxygen-global-requirement'];
      case CardRenderItemType.OCEANS: return this.item.size !== undefined && this.item.size !== Size.MEDIUM ? ['card-global-requirement', 'card-ocean-global-requirement', `card-ocean--${this.item.size}`] : ['card-global-requirement', 'card-ocean-global-requirement'];
      case CardRenderItemType.TR: return this.item.size !== undefined && this.item.size !== Size.MEDIUM ? ['card-tile', 'card-tr', `card-tr--${this.item.size}`] : ['card-tile', 'card-tr'];
      case CardRenderItemType.TITANIUM: return [cardResource, 'card-resource-titanium'];
      case CardRenderItemType.STEEL: return [cardResource, 'card-resource-steel'];
      case CardRenderItemType.HEAT: return [cardResource, 'card-resource-heat'];
      case CardRenderItemType.ENERGY: return [cardResource, 'card-resource-energy'];
      case CardRenderItemType.PLANTS: return [cardResource, 'card-resource-plant'];
      case CardRenderItemType.MEGACREDITS: return this.item.size !== undefined && this.item.size !== Size.MEDIUM ? [cardResource, 'card-resource-money', `card-money--${this.item.size}`] : [cardResource, 'card-resource-money'];
      case CardRenderItemType.CARDS: return [cardResource, 'card-card'];
      case CardRenderItemType.MULTIPLIER_WHITE: return [cardResource, 'card-resource-trade-discount'];
      case CardRenderItemType.CITY: return ['card-tile', 'city-tile', this.tileSizeClass];
      case CardRenderItemType.GREENERY: return ['card-tile', this.item.secondaryTag === AltSecondaryTag.OXYGEN ? 'greenery-tile-oxygen' : 'greenery-tile', this.tileSizeClass];
      case CardRenderItemType.EMPTY_TILE: return ['card-tile', 'empty-tile', this.tileSizeClass];
      case CardRenderItemType.EMPTY_TILE_SPECIAL: return ['card-tile', 'special-tile', this.tileSizeClass];
      case CardRenderItemType.RESOURCE: return [cardResource, this.resourceClass, this.resourceSizeClass];
      case CardRenderItemType.TAG: return ['card-resource-tag', this.tagClass, this.tagSizeClass];
      default: return [];
      }
    },
    amountAbs(): number {
      return this.item.amountInside ? 1 : Math.abs(this.item.amount);
    },
    itemsToShow(): number {
      return this.item.showDigit ? 1 : this.amountAbs;
    },
    // Oooh this is begging to be a template or something.
    itemHtmlContent(): string {
      let result = '';
      // in case of symbols inside
      if (isICardRenderItem(this.item)) {
        if (this.item.innerText) {
          result += this.item.innerText;
        } else if (this.item.amountInside) {
          if (this.item.amount !== 0) {
            result += this.item.amount.toString();
          }

          if (this.item.clone) {
            result += '<div style="-webkit-filter: greyscale(100%);filter: grayscale(100%)">🪐</div>';
          }
        }
      }

      const previouslyRendered: Array<Tag | AltSecondaryTag> = [AltSecondaryTag.OXYGEN];
      // Oxygen is handled specially separately.
      const secondaryTag = this.item.secondaryTag;
      if (secondaryTag !== undefined && !previouslyRendered.includes(secondaryTag)) {
        result += '<div class="card-icon tag-' + secondaryTag + '"></div>';
      }
      if (this.item.isPlate || this.item.text !== undefined) {
        if (this.item.inParens) {
          result += '(';
        }
        result += this.item.text || 'n/a';
        if (this.item.inParens) {
          result += ')';
        }
      }
      if (this.item.type === CardRenderItemType.MULTIPLIER_WHITE) {
        result = 'X';
      } else if (this.item.type === CardRenderItemType.IGNORE_GLOBAL_REQUIREMENTS) {
        result += '<div class="card-project-requirements">';
        result += '<div class="card-x">x</div>';
        result += '<div class="card-requirements">Global Requirements</div>';
        result += '</div>';
      }
      if (this.item.type === CardRenderItemType.CORPORATION) {
        result = '<div class="card-corporation-icon"></div>';
      }
      if (this.item.type === CardRenderItemType.AWARD) {
        result = '<span class="card-award-icon">award</span>';
      }
      if (this.item.type === CardRenderItemType.MILESTONE) {
        result = '<span class="card-award-icon">milestone</span>';
      }
      if (this.item.type === CardRenderItemType.VP) {
        result = '<div class="card-resource points-big card-vp-questionmark">?</div>';
      }
      if (this.item.type === CardRenderItemType.MEGACREDITS && this.item.amount === undefined) {
        result = '?';
      }
      // TODO(chosta): abstract once another case of cancel (X) on top of an item is needed
      if (this.item.cancelled === true) {
        switch (this.item.type) {
        case CardRenderItemType.TR:
          result = '<div class="card-x">x</div>';
        }
      }

      return result;
    },
  },
});
</script>
