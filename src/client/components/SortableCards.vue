<template>
<div>
  <div class="sortable-cards">
    <div ref="draggers" :class="{ 'dragging': Boolean(dragCard) }" v-for="card in getSortedCards()" :key="card.name" draggable="true" @dragend="onDragEnd()" @dragstart="onDragStart(card.name)" @dragover.prevent="onDragOver(card.name, $event)">
      <div ref="cardbox" class="cardbox">
        <Card :card="card"/>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Card from '@/client/components/card/Card.vue';
import {CardName} from '@/common/cards/CardName';
import {CardModel} from '@/common/models/CardModel';
import {CardOrderStorage} from '@/client/utils/CardOrderStorage';

type DataModel = {
  /** Mapping from card name to its order */
  cardOrder: {[x: string]: number};
  /** When defined, it is the name of the card being dragged. */
  dragCard: CardName | undefined;
};

export default defineComponent({
  name: 'SortableCards',
  components: {
    Card,
  },
  props: {
    cards: {
      type: Array as () => Array<CardModel>,
      required: true,
    },
    playerId: {
      type: String,
      required: true,
    },
  },
  data(): DataModel {
    const cache = CardOrderStorage.getCardOrder(this.playerId);
    const cardOrder: {[x: string]: number} = {};
    const keys = Object.keys(cache);
    let max = 0;
    for (const key of keys) {
      if (this.cards.find((card) => card.name === key) !== undefined) {
        cardOrder[key] = cache[key];
        max = Math.max(max, cache[key]);
      }
    }
    max++;
    for (const card of this.cards) {
      if (cardOrder[card.name] === undefined) {
        cardOrder[card.name] = max++;
      }
    }
    return {
      cardOrder: cardOrder,
      dragCard: undefined,
    };
  },
  methods: {
    getSortedCards() {
      return CardOrderStorage.getOrdered(
        this.cardOrder,
        this.cards,
      );
    },
    onDragStart(source: CardName): void {
      this.dragCard = source;
    },
    onDragEnd(): void {
      this.dragCard = undefined;
    },
    onDragOver(source: CardName, event: DragEvent): void {
      if (this.dragCard === undefined || source === this.dragCard) {
        return;
      }

      const cardNames = this.getSortedCards().map((card) => card.name);
      const dragIndex = cardNames.indexOf(this.dragCard);
      if (dragIndex === -1) {
        return;
      }

      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const insertAfter = event.clientX >= rect.left + rect.width / 2;
      const draggedCard = cardNames.splice(dragIndex, 1)[0];
      cardNames.splice(cardNames.indexOf(source) + (insertAfter ? 1 : 0), 0, draggedCard);
      cardNames.forEach((cardName, index) => this.cardOrder[cardName] = index + 1);
      CardOrderStorage.updateCardOrder(this.playerId, this.cardOrder);
    },
  },
});
</script>
