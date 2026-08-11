<template>
  <div class="player_home_block player_home_block--setup nofloat">
    <template v-if="game.phase === Phase.INITIALDRAFTING">
      <div v-for="card in playerView.dealtCorporationCards" :key="card.name" class="cardbox">
        <Card :card="card"/>
      </div>

      <div v-for="card in playerView.dealtProjectCards" :key="card.name" class="cardbox">
        <Card :card="card"/>
      </div>
    </template>
    <div class="player_home_block player_home_block--hand" v-if="playerView.draftedCards.length > 0">
      <DynamicTitle title="Drafted Cards" :color="thisPlayer.color"/>
      <div v-for="card in playerView.draftedCards" :key="card.name" class="cardbox">
          <Card :card="card"/>
      </div>
    </div>

    <template v-if="playerView.pickedCorporationCard.length === 1">
      <DynamicTitle title="Your selected cards:" :color="thisPlayer.color"/>
      <div>
        <div class="cardbox">
          <Card :card="playerView.pickedCorporationCard[0]"/>
        </div>
      </div>
      <div>
        <div v-for="card in playerView.cardsInHand" :key="card.name" class="cardbox">
          <Card :card="card"/>
        </div>
      </div>
    </template>

    <DynamicTitle v-if="playerView.pickedCorporationCard.length === 0" title="Select initial cards:" :color="thisPlayer.color"/>
    <WaitingFor v-if="game.phase !== 'end'" :playerView="playerView" :waitingfor="playerView.waitingFor"/>

    <DynamicTitle title="Game details" :color="thisPlayer.color"/>

    <div class="player_home_block" v-if="playerView.players.length > 1">
      <Milestones :showScores="false" :milestones="game.milestones" />
      <Awards :show-scores="false" :awards="game.awards" />
    </div>

    <div class="player_home_block player_home_block--turnorder nofloat" v-if="playerView.players.length>1">
      <DynamicTitle title="Turn order" :color="thisPlayer.color"/>
      <div class="player_item" v-for="(p, idx) in playerView.players" :key="idx" v-trim-whitespace>
        <div class="player_name_cont" :class="getPlayerCssForTurnOrder(p, true)">
          <span class="player_number">{{ idx+1 }}.</span><span class="player_name" :class="getPlayerCssForTurnOrder(p, false)" href="#">{{ p.name }}</span>
        </div>
        <div class="player_separator" v-if="idx !== playerView.players.length - 1">⟶</div>
      </div>
    </div>

    <details class="accordion board-accordion" open>
      <summary class="accordion-header">
        <div class="is-action">
          <i class="icon icon-arrow-right mr-1"></i>
          <span v-i18n>Board</span>
        </div>
      </summary>
      <div class="accordion-body">
        <Board
          :spaces="game.spaces"
          :boardName ="game.gameOptions.boardName"
          />
      </div>
    </details>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

import Board from '@/client/components/Board.vue';
import Card from '@/client/components/card/Card.vue';
import DynamicTitle from '@/client/components/common/DynamicTitle.vue';
import Milestones from '@/client/components/Milestones.vue';
import Awards from '@/client/components/Awards.vue';
import WaitingFor from '@/client/components/WaitingFor.vue';
import {playerColorClass} from '@/common/utils/utils';
import {Phase} from '@/common/Phase';
import {GameModel} from '@/common/models/GameModel';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {TileView} from './board/TileView';

export default defineComponent({
  name: 'PlayerSetupView',
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
      required: true,
    },
    tileView: {
      type: String as () => TileView,
      required: true,
    },
  },
  computed: {
    thisPlayer(): PublicPlayerModel {
      return this.playerView.thisPlayer;
    },
    game(): GameModel {
      return this.playerView.game;
    },
    Phase(): typeof Phase {
      return Phase;
    },
  },
  components: {
    Board,
    Card,
    DynamicTitle,
    WaitingFor,
    Milestones,
    Awards,
  },
  methods: {
    getPlayerCssForTurnOrder: (
      player: PublicPlayerModel,
      highlightActive: boolean,
    ): string => {
      const classes = ['highlighter_box'];
      if (highlightActive) {
        if (player.needsToDraft || (player.needsToDraft === undefined && player.isActive)) {
          classes.push('player_is_active');
        }
        classes.push(playerColorClass(player.color, 'bg'));
      }
      return classes.join(' ');
    },
  },
});
</script>
