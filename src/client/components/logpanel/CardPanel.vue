<template>
  <div class="card-panel" v-if="message !== undefined && show">
    <AppButton size="big" type="close" :disableOnServerBusy="false" @click="hideMe" align="right"/>
    <div id="log_panel_card" class="cardbox" v-for="name in cards" :key="name">
      <Card :card="{name, isSelfReplicatingRobotsCard: isSelfReplicatingRobotsCard(name), resources: getResourcesOnCard(name)}"/>
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import {LogMessage} from '@/common/logs/LogMessage';
import {LogMessageDataType} from '@/common/logs/LogMessageDataType';
import {CardName} from '@/common/cards/CardName';
import {PublicPlayerModel} from '@/common/models/PlayerModel';
import Card from '@/client/components/card/Card.vue';
import AppButton from '@/client/components/common/AppButton.vue';

export default defineComponent({
  name: 'LogPanel',
  props: {
    message: {
      type: Object as () => LogMessage,
      required: true,
    },
    players: {
      type: Array as () => Array<PublicPlayerModel>,
      required: true,
    },
  },
  components: {
    AppButton,
    Card,
  },
  computed: {
    show(): boolean {
      return this.cards.length > 0;
    },
    cards(): ReadonlyArray<CardName> {
      return this.message.data
        .filter((datum) => datum.type === LogMessageDataType.CARD || datum.type === LogMessageDataType.CARDS)
        .flatMap((datum) => datum.type === LogMessageDataType.CARD ? [datum.value] : datum.value);
    },
  },
  methods: {
    hideMe() {
      this.$emit('hide');
    },
    isSelfReplicatingRobotsCard(cardName: CardName) {
      for (const player of this.players) {
        if (player.selfReplicatingRobotsCards.some((card) => card.name === cardName)) {
          return true;
        }
      }
      return false;
    },
    getResourcesOnCard(cardName: CardName) {
      for (const player of this.players) {
        const playedCard = player.tableau.find((card) => card.name === cardName);
        if (playedCard !== undefined) {
          return playedCard.resources;
        }
        const srrCard = player.selfReplicatingRobotsCards.find((card) => card.name === cardName);
        if (srrCard !== undefined) {
          return srrCard.resources;
        }
      }

      return undefined;
    },
  },
});

</script>
