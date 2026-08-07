<template>
  <div id="spectator-home">

    <div v-if="game.phase === 'end'">
      <div class="player_home_block">
        <DynamicTitle title="This game is over!" :color="spectator.color"/>
        <a :href="'the-end?id='+ spectator.id" v-i18n>Go to game results</a>
      </div>
    </div>

    <Sidebar v-trim-whitespace
      :actingPlayer="false"
      :playerColor="spectator.color"
      :generation="game.generation"
      :temperature = "game.temperature"
      :oxygen = "game.oxygenLevel"
      :oceans = "game.oceans"
      :gameOptions = "game.gameOptions"
      :playerNumber = "spectator.players.length"
      :lastSoloGeneration = "game.lastSoloGeneration"
      :deckSize = "game.deckSize"
      :discardPileSize = "game.discardPileSize"/>

    <div class="player_home_block nofloat">
        <LogPanel v-if="spectator.id !== undefined" :viewModel="spectator" :color="spectator.color" :step="game.step"/>
    </div>

    <PlayersOverview class="player_home_block player_home_block--players nofloat" :playerView="spectator" v-trim-whitespace id="shortkey-playersoverview"/>

    <GameBoardView
      :game="game"
      :tileView="tileView"
      :players="spectator.players"
      @toggleTileView="cycleTileView()"
    />

    <WaitingFor v-show="false" v-if="game.phase !== 'end'" :playerView="spectator" :waitingfor="undefined"/>
    <div v-if="game.spectatorId">
      <a :href="'/spectator?id=' +game.spectatorId" target="_blank" rel="noopener noreferrer" v-i18n>Spectator link</a>
    </div>
    <PurgeWarning :expectedPurgeTimeMs="game.expectedPurgeTimeMs"/>
    <KeyboardShortcuts v-show="keyboardShortcutOpened" @close="keyboardShortcutOpened = false"/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

import {GameModel} from '@/common/models/GameModel';
import {vueRoot} from '@/client/components/vueRoot';
import {SpectatorModel} from '@/common/models/SpectatorModel';
import DynamicTitle from '@/client/components/common/DynamicTitle.vue';
import GameBoardView from '@/client/components/GameBoardView.vue';
import LogPanel from '@/client/components/logpanel/LogPanel.vue';
import Sidebar from '@/client/components/Sidebar.vue';
import WaitingFor from '@/client/components/WaitingFor.vue';
import PlayersOverview from '@/client/components/overview/PlayersOverview.vue';
import PurgeWarning from '@/client/components/common/PurgeWarning.vue';
import KeyboardShortcuts from '@/client/components/KeyboardShortcuts.vue';
import {HomeMixin} from '@/client/mixins/HomeMixin';

export default defineComponent({
  name: 'SpectatorHome',
  mixins: [HomeMixin],
  props: {
    spectator: {
      type: Object as () => SpectatorModel,
      required: true,
    },
  },
  computed: {
    game(): GameModel {
      return this.spectator.game;
    },
  },
  components: {
    DynamicTitle,
    GameBoardView,
    KeyboardShortcuts,
    LogPanel,
    PlayersOverview,
    PurgeWarning,
    Sidebar,
    WaitingFor,
  },
  methods: {
    forceRerender() {
      // TODO(kberg): this is very inefficient. It pulls down the entire state, ignoring the value of 'waitingFor' which only fetches a short state.
      vueRoot(this).updateSpectator();
    },
  },
});
</script>
