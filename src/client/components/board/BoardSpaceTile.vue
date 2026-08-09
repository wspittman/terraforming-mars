<template>
  <div :class="klass" :title="$t(description)" data-test="tile">
  </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import {SpaceType} from '@/common/boards/SpaceType';
import {TileType, tileTypeToString} from '@/common/TileType';
import {SpaceHighlight, SpaceModel} from '@/common/models/SpaceModel';
import {TileView} from '@/client/components/board/TileView';

const tileTypeToCssClass: Record<TileType, string> = {
  [TileType.OCEAN]: 'ocean',
  [TileType.CITY]: 'city',
  [TileType.GREENERY]: 'greenery',
  [TileType.COMMERCIAL_DISTRICT]: 'commercial_district',
  [TileType.ECOLOGICAL_ZONE]: 'ecological_zone',
  [TileType.INDUSTRIAL_CENTER]: 'industrial_center',
  [TileType.LAVA_FLOWS]: 'lava_flows',
  [TileType.MINING_AREA]: 'mining_area',
  [TileType.MINING_RIGHTS]: 'mining_rights',
  [TileType.CAPITAL]: 'capital',
  [TileType.MOHOLE_AREA]: 'mohole_area',
  [TileType.NATURAL_PRESERVE]: 'natural_preserve',
  [TileType.NUCLEAR_ZONE]: 'nuclear_zone',
  [TileType.RESTRICTED_AREA]: 'restricted_area',
  [TileType.DEIMOS_DOWN]: 'deimos_down',
  [TileType.GREAT_DAM]: 'great_dam',
  [TileType.MAGNETIC_FIELD_GENERATORS]: 'magnetic_field_generators',
};

const descriptions: Record<TileType, string> = {
  ...tileTypeToString,
  [TileType.COMMERCIAL_DISTRICT]: 'Commercial District: 1 VP per adjacent city tile',
  [TileType.CITY]: 'City: 1 VP per adjacent greenery',
  [TileType.GREENERY]: 'Greenery: 1 VP',
  [TileType.OCEAN]: 'Ocean: grants 2M€ when players put tiles next to it',


};

export default defineComponent({
  name: 'BoardSpaceTile',
  props: {
    space: {
      type: Object as () => SpaceModel,
      required: true,
    },
    tileView: {
      type: String as () => TileView,
      default: 'show',
    },
  },
  data() {
    return {};
  },
  computed: {
    tileType(): TileType | undefined {
      return this.space.tileType;
    },
    spaceType(): SpaceType {
      return this.space.spaceType;
    },
    highlight(): SpaceHighlight {
      return this.space.highlight;
    },
    description(): string {
      if (this.tileType === undefined) {
        return '';
      }
      if (this.tileType === TileType.CITY && this.spaceType === SpaceType.COLONY) {
        return 'City in space.';
      }
      return descriptions[this.tileType];
    },
    klass(): string {
      let css = 'board-space';
      if (this.tileType !== undefined) {
        const cssClass: string | undefined = tileTypeToCssClass[this.tileType];
        css += ' board-space-tile--' + cssClass;
      } else {
        switch (this.spaceType) {
        case SpaceType.OCEAN:
          css += ' board-space-type-ocean';
          break;
        default:
          css += ' board-space-type-land';

          if (this.highlight) {
            css += ` board-space-type-land-${this.highlight}`;
          }
        }
      }
      if (this.tileView !== 'show') {
        css += ' board-hidden-tile';
      }
      return css;
    },
  },
});

</script>
