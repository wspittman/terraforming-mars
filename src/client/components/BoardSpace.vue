<template>
  <div v-if="space !== undefined" :class="mainClass" :data_space_id="space.id">
    <BoardSpaceTile
      :space="space"
      :tileView="tileView"
    />
    <div class="board-space-text" v-if="text" v-i18n>{{ text }}</div>
    <Bonus :bonus="space.bonus" v-if="showBonus"/>
    <template v-if="tileView === 'coords'">
      <div class="board-space-coords">{{ getSpaceName(space.id) }}</div>
    </template>
    <template v-if="tileView === 'show'">
      <div :class="playerColorCss" v-if="space.color !== undefined"></div>
    </template>
    <div class="board-log-highlight" :data_log_highlight_id="space.id"></div>
    </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import Bonus from '@/client/components/Bonus.vue';
import BoardSpaceTile from '@/client/components/board/BoardSpaceTile.vue';
import {TileView} from '@/client/components/board/TileView';
import {SpaceModel} from '@/common/models/SpaceModel';
import {getPreferences} from '../utils/PreferencesManager';
import {getSpaceName} from '@/common/boards/spaces';
import {SpaceType} from '@/common/boards/SpaceType';
export default defineComponent({
  name: 'BoardSpace',
  props: {
    space: {
      type: Object as () => SpaceModel,
      required: true,
    },
    text: {
      type: String,
      default: '',
    },
    tileView: {
      type: String as () => TileView,
      required: true,
    },
  },
  data() {
    return {};
  },
  components: {
    Bonus,
    BoardSpaceTile,
  },
  computed: {
    mainClass(): string {
      let css = 'board-space board-space-' + this.space?.id.toString();
      css += ' board-space-selectable';
      return css;
    },
    showBonus(): boolean {
      return this.space.tileType === undefined || this.tileView === 'hide';
    },
    playerColorCss(): string {
      if (this.space.color === undefined) {
        return '';
      }
      const css = 'board-cube board-cube--' + this.space.color;
      return getPreferences().symbol_overlay ? css + ' overlay' : css;
    },
    getSpaceName(): typeof getSpaceName {
      return getSpaceName;
    },
    SpaceType(): typeof SpaceType {
      return SpaceType;
    },
  },
});

</script>
