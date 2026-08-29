<template>
        <div id="game-setup-detail" class="game-setup-detail-container">
          <ul>
            <li><div class="setup-item" v-i18n>Game Version:</div>
              <div class="game-config generic" v-i18n>{{ gameOptions.corporateEra ? 'Corporate Era' : 'Base' }}</div>
            </li>

            <li><div class="setup-item" v-i18n>Board:</div>
              <span :class="boardColorClass" v-i18n>{{ gameOptions.boardName }}</span>
              &nbsp;
              <span v-if="gameOptions.shuffleMapOption" class="game-config generic" v-i18n>(randomized tiles)</span>
            </li>

            <li v-if="gameOptions.escapeVelocity !== undefined">
              <div class="create-game-expansion-icon expansion-icon-escape-velocity"></div>
              <span>{{escapeVelocityDescription}}</span>
            </li>

            <li v-if="playerNumber === 1">
              <div class="setup-item" v-i18n>Solo:</div>
              <div class="game-config generic" v-i18n>{{ lastSoloGeneration }} Gens</div>
              <div v-if="gameOptions.soloTR" class="game-config generic" v-i18n>63 TR</div>
              <div v-else class="game-config generic" v-i18n>TR all</div>
            </li>

            <li><div class="setup-item" v-i18n>Game configs:</div>
              <div v-if="gameOptions.fastModeOption" class="game-config fastmode" v-i18n>fast mode</div>
              <div v-if="gameOptions.showTimers" class="game-config timer" v-i18n>timer</div>
              <div v-if="gameOptions.showOtherPlayersVP" class="game-config realtime-vp" v-i18n>real-time vp</div>
              <div v-if="gameOptions.undoOption" class="game-config undo" v-i18n>undo</div>
            </li>
            <li v-if="gameOptions.bannedCards.length > 0"><div class="setup-item" v-i18n>Banned cards:</div>{{ gameOptions.bannedCards.join(', ') }}</li>
          </ul>
        </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import {GameOptionsModel} from '@/common/models/GameOptionsModel';
import {BoardName} from '@/common/boards/BoardName';
import {translateTextWithParams} from '@/client/directives/i18n';

const boardColorClass: Record<BoardName, string> = {
  [BoardName.THARSIS]: 'game-config board-tharsis map',
};

export default defineComponent({
  name: 'GameSetupDetail',
  props: {
    playerNumber: {
      type: Number,
      required: true,
    },
    gameOptions: {
      type: Object as () => GameOptionsModel,
      required: true,
    },
    lastSoloGeneration: {
      type: Number,
      required: true,
    },
  },
  computed: {
    boardColorClass(): string {
      return boardColorClass[this.gameOptions.boardName];
    },
    escapeVelocityDescription(): string {
      if (this.gameOptions.escapeVelocity === undefined) {
        return '';
      }
      const ev = this.gameOptions.escapeVelocity;
      return translateTextWithParams(
        'After ${0} min, reduce ${1} VP every ${2} min. (${3} bonus sec. per action.)',
        [
          ev.thresholdMinutes.toString(),
          ev.penaltyVPPerPeriod.toString(),
          ev.penaltyPeriodMinutes.toString(),
          ev.bonusSectionsPerAction.toString(),
        ]);
    },
  },
});

</script>
