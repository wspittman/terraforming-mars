<template>
  <div class="card-corporation-logo">
    <div :class="logoClass">{{capsTitle}}</div>
  </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import {CardName} from '@/common/cards/CardName';


const logos: Partial<Record<CardName, 'image' | 'css' | 'bespoke'>> = {
  [CardName.CREDICOR]: 'css',
  [CardName.ECOLINE]: 'css',
  [CardName.HELION]: 'css',
  [CardName.INTERPLANETARY_CINEMATICS]: 'bespoke',
  [CardName.INVENTRIX]: 'bespoke',
  [CardName.MINING_GUILD]: 'bespoke',
  [CardName.PHOBOLOG]: 'css',
  [CardName.SATURN_SYSTEMS]: 'bespoke',
  [CardName.TERACTOR]: 'css',
  [CardName.THARSIS_REPUBLIC]: 'bespoke',
  [CardName.THORGATE]: 'css',
  [CardName.UNITED_NATIONS_MARS_INITIATIVE]: 'bespoke',
};

export default defineComponent({
  name: 'CardCorporationLogo',
  props: {
    title: {
      type: String as () => CardName,
      required: true,
    },
  },
  computed: {
    logos(): typeof logos {
      return logos;
    },
    CardName(): typeof CardName {
      return CardName;
    },
    logoClass(): string {
      const type = logos[this.title];
      switch (type) {
      case 'image':
      case 'css':
        const local = this.title.toLowerCase()
          .replaceAll(' ', '-')
          .replaceAll('&', '')
          .replaceAll('--', '-');
        return `card-${local}-logo`;
      default:
        return '';
      }
    },
    capsTitle(): string {
      return logos[this.title] === 'image' ? '' : this.title.toUpperCase();
    },
  },
});

</script>

