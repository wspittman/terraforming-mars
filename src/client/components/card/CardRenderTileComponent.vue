<template>
  <div :class="tiles">
    <div v-if="symbols.length > 0" :class="symbols">
    </div>
    <AdjacencyBonus v-if="item.isAres" :tileType="item.tile" />
  </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import {ICardRenderTile} from '@/common/cards/render/Types';
import {TileType} from '@/common/TileType';
import AdjacencyBonus from '@/client/components/AdjacencyBonus.vue';

type Classes = {
  // The tile div is used to display a full tile. If distinct version
  // of the tile appears for Ares it uses aresTile, otherwise it ses tile.
  tile?: string;
  aresTile?: string;

  // symbol is used for the inner div, and only used when the renderer isn't
  // going to show a whole tile, just a symbol on top of a tile template.
  symbol?: string;
}

const TILE_CLASSES: Record<TileType, Classes> = {
  [TileType.CAPITAL]: {
    tile: 'card-tile-capital',
    aresTile: 'card-tile-capital-ares',
  },
  [TileType.COMMERCIAL_DISTRICT]: {
    aresTile: 'card-tile-commercial-district-ares',
    symbol: 'card-tile-symbol-commercial-district',
  },
  [TileType.DEIMOS_DOWN]: {
    aresTile: 'card-tile-deimos-down-ares',
    symbol: 'card-tile-symbol-deimos-down',
  },
  [TileType.GREAT_DAM]: {
    aresTile: 'card-tile-great-dam-ares',
    symbol: 'card-tile-symbol-great-dam',
  },
  [TileType.ECOLOGICAL_ZONE]: {
    aresTile: 'card-tile-ecological-zone-ares',
    symbol: 'card-tile-symbol-ecological-zone',
  },
  [TileType.INDUSTRIAL_CENTER]: {
    aresTile: 'card-tile-industrial-center-ares',
    symbol: 'card-tile-symbol-industrial-center',
  },
  [TileType.LAVA_FLOWS]: {
    aresTile: 'card-tile-lava-flows-ares',
    symbol: 'card-tile-symbol-lava-flows',
  },
  [TileType.MAGNETIC_FIELD_GENERATORS]: {
    aresTile: 'card-tile-magnetic-field-generators-ares',
    symbol: 'card-tile-symbol-magnetic-field-generators',
  },
  [TileType.MINING_AREA]: {
    symbol: 'card-tile-symbol-mining',
  },
  [TileType.MINING_RIGHTS]: {
    symbol: 'card-tile-symbol-mining',
  },
  [TileType.MOHOLE_AREA]: {
    aresTile: 'card-tile-mohole-area-ares',
    symbol: 'card-tile-symbol-mohole-area',
  },
  [TileType.NATURAL_PRESERVE]: {
    aresTile: 'card-tile-natural-preserve-ares',
    symbol: 'card-tile-symbol-natural-preserve',
  },
  [TileType.NUCLEAR_ZONE]: {
    aresTile: 'card-tile-nuclear-zone-ares',
    symbol: 'card-tile-symbol-nuclear-zone',
  },
  [TileType.RESTRICTED_AREA]: {
    aresTile: 'card-tile-restricted-area-ares',
    symbol: 'card-tile-symbol-restricted-area',
  },
  [TileType.GREENERY]: {},
  [TileType.OCEAN]: {},
  [TileType.CITY]: {},
};

export default defineComponent({
  name: 'CardRenderTileComponent',
  props: {
    item: {
      type: Object as () => ICardRenderTile,
      required: true,
    },
  },
  components: {
    AdjacencyBonus,
  },
  computed: {
    tiles(): ReadonlyArray<string> {
      const classes: string[] = ['card-tile'];
      if (this.item.hasSymbol) {
        classes.push('card-tile-canvas');
      }
      const symbolClass = TILE_CLASSES[this.item.tile];
      if (this.item.isAres && symbolClass.aresTile !== undefined) {
        classes.push(symbolClass.aresTile);
      } else if (symbolClass.tile !== undefined) {
        classes.push(symbolClass.tile);
      }
      return classes;
    },
    // Symbols for tiles go on top of the tile canvas
    symbols(): ReadonlyArray<string> {
      if (this.item.hasSymbol) {
        const symbolClass = TILE_CLASSES[this.item.tile];
        if (symbolClass.symbol !== undefined) {
          return ['card-tile-symbol', symbolClass.symbol];
        }
      }
      return [];
    },
  },
});

</script>

