<template>
    <div class="player-tags">
        <div class="player-tags-main">
            <TagCount tag="vp" :count="hideVpCount ? '?' : player.victoryPointsBreakdown.total" :size="'big'" :type="'main'" />
            <div v-if="isEscapeVelocityOn" :class="tooltipCss" :data-tooltip="$t('Escape Velocity penalty')">
              <TagCount tag="escape" :count="escapeVelocityPenalty" :size="'big'" :type="'main'" :showWhenZero="true"/>
            </div>
            <TagCount tag="tr" :count="player.terraformRating" :size="'big'" :type="'main'"/>
            <TagCount v-if="player.handicap !== undefined" :tag="'handicap'" :count="player.handicap" :size="'big'" :type="'main'" :showWhenZero="true"/>
            <div class="tag-and-discount">
              <PlayerTagDiscount v-if="all.discount" :amount="all.discount" :color="player.color"  :data-test="'discount-all'"/>
              <TagCount tag="cards" :count="cardsInHandCount" :size="'big'" :type="'main'"/>
            </div>
        </div>
        <div class="player-tags-secondary">
          <div class="tag-count-container" v-for="tagDetail of tags" :key="tagDetail.name">
            <div v-if="tagDetail.name === 'separator'" class="tag-separator"></div>
            <template v-else-if="tagDetail.name === 'all'"></template>
            <div v-else class="tag-and-discount">
              <PlayerTagDiscount v-if="tagDetail.discount > 0" :color="player.color" :amount="tagDetail.discount" :data-test="'discount-' + tagDetail.name"/>
              <PointsPerTag :points="tagDetail"/>
              <TagCount :tag="tagDetail.name" :count="tagDetail.count" :size="'big'" :type="'secondary'"/>
            </div>
          </div>
        </div>
    </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import TagCount from '@/client/components/TagCount.vue';
import {ViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {Tag} from '@/common/cards/Tag';
import {SpecialTags} from '@/client/cards/SpecialTags';
import PlayerTagDiscount from '@/client/components/overview/PlayerTagDiscount.vue';
import PointsPerTag from '@/client/components/overview/PointsPerTag.vue';
import {getCard} from '@/client/cards/ClientCardManifest';
import {vueRoot} from '@/client/components/vueRoot';

type InterfaceTagsType = Tag | typeof SpecialTags.NONE | typeof SpecialTags.CITY_COUNT | 'separator' | 'all';
type TagDetail = {
  name: InterfaceTagsType;
  discount: number;
  points: number;
  halfPoints: number;
  count: number;
  asterisk: boolean;
};

type DataModel = {
  all: TagDetail;
  tagsInOrder: Array<TagDetail>;
};

const ORDER: Array<InterfaceTagsType> = [
  Tag.BUILDING,
  Tag.SPACE,
  Tag.SCIENCE,
  Tag.POWER,
  Tag.EARTH,
  Tag.JOVIAN,
  Tag.PLANT,
  Tag.MICROBE,
  Tag.ANIMAL,
  Tag.CITY,
  'separator',
  Tag.EVENT,
  SpecialTags.NONE,
  SpecialTags.CITY_COUNT,
];

const getTagCount = (tagName: InterfaceTagsType, player: PublicPlayerModel): number => {
  switch (tagName) {
  case SpecialTags.CITY_COUNT:
    return player.citiesCount || 0;
  case SpecialTags.NONE:
    return player.noTagsCount || 0;
  case 'separator':
  case 'all':
    return -1;
  default:
    return player.tags[tagName as Tag];
  }
};

export default defineComponent({
  name: 'PlayerTags',
  props: {
    playerView: {
      type: Object as () => ViewModel,
      required: true,
    },
    player: {
      type: Object as () => PublicPlayerModel,
      required: true,
    },
    hideZeroTags: {
      type: Boolean,
    },
    isTopBar: {
      type: Boolean,
      default: false,
    },
    conciseTagsViewDefaultValue: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data(): DataModel {
    type TagDetails = Record<InterfaceTagsType | 'all', TagDetail>;

    // Start by giving every entry a default value
    const interim = ORDER.map((key) => [
      key,
      {name: key, discount: 0, points: 0, count: getTagCount(key, this.player), halfPoints: 0, asterisk: false},
    ]);
    const details: TagDetails = Object.fromEntries(interim);

    // Initialize all's card discount.
    details['all'] = {
      name: 'all',
      discount: 0,
      points: 0,
      count: 0,
      halfPoints: 0,
      asterisk: false,
    };

    // For each card
    for (const card of this.player.tableau) {
      // Calculate discount
      for (const discount of card.discount ?? []) {
        const tag = discount.tag ?? 'all';
        details[tag].discount += discount.amount;
      }

      const vps = getCard(card.name)?.victoryPoints;
      if (vps !== undefined && typeof(vps) !== 'number' && vps !== 'special') {
        // Special case Commercial District etc.
        const asterisk = vps.nextToThis !== undefined;
        if (vps.tag !== undefined) {
          if (!asterisk) {
            details[vps.tag].points += ((vps.each ?? 1) / (vps.per ?? 1));
          } else {
            details[vps.tag].asterisk = true;
          }
        }
        if (vps.cities !== undefined) {
          if (!asterisk) {
            details['city-count'].points += ((vps.each ?? 1) / (vps.per ?? 1));
          } else {
            details['city-count'].asterisk = true;
          }
        }
      }
    }

    // Put them in order.
    const tagsInOrder = [];
    for (const tag of ORDER) {
      const entry = details[tag];
      tagsInOrder.push(entry);
    }

    return {
      all: details['all'],
      tagsInOrder,
    };
  },

  components: {
    TagCount,
    PlayerTagDiscount,
    PointsPerTag,
  },
  computed: {
    isThisPlayer(): boolean {
      return this.player.color === this.playerView.thisPlayer?.color;
    },
    cardsInHandCount(): number {
      return this.player.cardsInHandNbr ?? 0;
    },
    hideVpCount(): boolean {
      return !this.playerView.game.gameOptions.showOtherPlayersVP && !this.isThisPlayer;
    },
    isEscapeVelocityOn(): boolean {
      return this.playerView.game.gameOptions.escapeVelocity !== undefined;
    },
    escapeVelocityPenalty(): number {
      return this.player.victoryPointsBreakdown.escapeVelocity;
    },
    tooltipCss(): string {
      return 'tooltip tooltip-' + (this.isTopBar ? 'bottom' : 'top');
    },
    tags(): Array<TagDetail> {
      // In tests this one call to vueRoot uses `?.` because for some reason it this doesn't pass tests.
      const concise = vueRoot(this).componentsVisibility?.['tags_concise'] ?? this.conciseTagsViewDefaultValue;
      return this.tagsInOrder.filter((entry) => {
        if (entry.count === 0 && entry.discount === 0) {
          if (this.hideZeroTags || concise) {
            return false;
          }
        }
        return true;
      });
    },
    SpecialTags() {
      return SpecialTags;
    },
  },
});

</script>
