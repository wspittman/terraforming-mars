<template>
<div :class="'sidebar_cont sidebar '+getSideBarClass()">
  <div class="tm" :title="$t('Generation Marker')">
    <div class="gen-text" v-i18n>GEN</div>
    <div class="gen-marker">{{ getGenMarker() }}</div>
  </div>
  <div class="global_params">
    <GlobalParameterValue :param="globalParameter.TEMPERATURE" :value="temperature"/>
    <GlobalParameterValue :param="globalParameter.OXYGEN" :value="oxygen"/>
    <GlobalParameterValue :param="globalParameter.OCEANS" :value="oceans"/>
  </div>
  <div class="sidebar_item preferences_player" :title="$t('Player Color Cube')">
    <div :class="getPlayerColorCubeClass()+' player_bg_color_' + playerColor"></div>
  </div>

  <a href="#board" :title="$t('Jump to board')">
      <div class="sidebar_item sidebar_item_shortcut">
          <i class="sidebar_icon sidebar_icon--board"></i>
      </div>
  </a>
  <a href="#actions" :title="$t('Jump to actions')">
      <div class="sidebar_item sidebar_item_shortcut">
          <i class="sidebar_icon sidebar_icon--actions"></i>
      </div>
  </a>
  <a href="#cards" :title="$t('Jump to cards')">
      <div class="sidebar_item goto-cards sidebar_item_shortcut-long">
          <i class="sidebar_icon sidebar_icon--cards">
            <div class="deck-size">🂠{{ deckSize }}<br>🗑{{ discardPileSize }}</div>
          </i>
      </div>
  </a>
  <div class="sidebar_item sidebar_item--info" :title="$t('Information panel')">
    <i class="sidebar_icon sidebar_icon--info"
      :class="{'sidebar_item--is-active': ui.gamesetup_detail_open}"
      @click="ui.gamesetup_detail_open = !ui.gamesetup_detail_open"
      :title="$t('game setup details')"></i>
    <div class="info_panel" v-if="ui.gamesetup_detail_open">
      <div class="info_panel-spacing"></div>
      <div class="info-panel-title" v-i18n>Game Setup Details</div>
      <GameSetupDetail :gameOptions="gameOptions" :playerNumber="playerNumber" :lastSoloGeneration="lastSoloGeneration"/>

      <div class="info_panel_actions">
        <button class="btn btn-lg btn-primary" @click="ui.gamesetup_detail_open=false" v-i18n>Ok</button>
      </div>
    </div>
  </div>

  <a href="help" target="_blank">
    <div class="sidebar_item sidebar_item--help">
      <i class="sidebar_icon sidebar_icon--help" :title="$t('player aid')"></i>
    </div>
  </a>

  <PreferencesIcon/>
</div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import {Color} from '@/common/Color';
import {getPreferences, PreferencesManager} from '@/client/utils/PreferencesManager';
import GameSetupDetail from '@/client/components/GameSetupDetail.vue';
import {GameOptionsModel} from '@/common/models/GameOptionsModel';
import GlobalParameterValue from '@/client/components/GlobalParameterValue.vue';
import {GlobalParameter} from '@/common/GlobalParameter';
import PreferencesIcon from '@/client/components/PreferencesIcon.vue';

export default defineComponent({
  name: 'Sidebar',
  props: {
    playerNumber: {
      type: Number,
      required: true,
    },
    gameOptions: {
      type: Object as () => GameOptionsModel,
      required: true,
    },
    actingPlayer: {
      type: Boolean,
    },
    playerColor: {
      type: String as () => Color,
      required: true,
    },
    generation: {
      type: Number,
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    oxygen: {
      type: Number,
      required: true,
    },
    oceans: {
      type: Number,
      required: true,
    },
    lastSoloGeneration: {
      type: Number,
      required: true,
    },
    deckSize: {
      type: Number,
      required: true,
    },
    discardPileSize: {
      type: Number,
      required: true,
    },
  },
  components: {
    GameSetupDetail,
    GlobalParameterValue,
    PreferencesIcon,
  },
  data() {
    return {
      'ui': {
        'gamesetup_detail_open': false,
      },
      'globalParameter': GlobalParameter,
    };
  },
  methods: {
    getPlayerColorCubeClass(): string {
      return this.actingPlayer && (getPreferences().hide_animated_sidebar === false) ? 'preferences_player_inner active' : 'preferences_player_inner';
    },
    getSideBarClass(): string {
      return this.actingPlayer && (getPreferences().hide_animated_sidebar === false) ? 'preferences_acting_player' : 'preferences_nonacting_player';
    },
    getGenMarker(): string {
      return `${this.generation}`;
    },
  },
  computed: {
    preferencesManager(): PreferencesManager {
      return PreferencesManager.INSTANCE;
    },
  },
});

</script>
