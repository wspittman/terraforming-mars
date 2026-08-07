<!-- Common widgets between player and spectator views -->
<template>
  <a name="board" class="player_home_anchor hotkey-target"></a>
  <Board
    :spaces="game.spaces"
    :boardName ="game.gameOptions.boardName"
    :oceans_count="game.oceans"
    :oxygen_level="game.oxygenLevel"
    :temperature="game.temperature"
    :tileView="tileView"
    @toggleTileView="$emit('toggleTileView')"
    id="shortkey-board"
  />

  <div v-if="players.length > 1" class="player_home_block--milestones-and-awards">
    <a class="hotkey-target"></a>
    <Milestones :milestones="game.milestones" />
    <Awards :awards="game.awards" />
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';

import {GameModel} from '@/common/models/GameModel';
import {PublicPlayerModel} from '@/common/models/PlayerModel';
import Board from '@/client/components/Board.vue';
import Milestones from '@/client/components/Milestones.vue';
import Awards from '@/client/components/Awards.vue';
import {TileView} from './board/TileView';

export default defineComponent({
  name: 'GameBoardView',
  props: {
    game: {
      type: Object as () => GameModel,
      required: true,
    },
    tileView: {
      type: String as () => TileView,
      required: true,
    },
    players: {
      type: Array as PropType<ReadonlyArray<PublicPlayerModel>>,
      required: true,
    },
  },
  emits: ['toggleTileView'],
  components: {
    Board,
    Milestones,
    Awards,
  },
});
</script>
