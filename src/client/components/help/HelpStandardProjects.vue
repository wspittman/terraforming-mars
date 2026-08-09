<template>
    <div class="help-standard-projects-container">

      <h2 v-i18n>Standard Projects</h2>
      <div class="cardbox" v-for="card in getBasicStandardProjects()" :key="card">
        <Card :card="{'name': card}" />
      </div>

    </div>
</template>
<script lang="ts">

import {defineComponent} from 'vue';
import Card from '@/client/components/card/Card.vue';
import {CardName} from '@/common/cards/CardName';

export default defineComponent({
  name: 'HelpStandardProjects',
  components: {
    Card,
  },
  methods: {
    getBasicStandardProjects: () => [
      CardName.SELL_PATENTS_STANDARD_PROJECT,
      CardName.POWER_PLANT_STANDARD_PROJECT,
      CardName.ASTEROID_STANDARD_PROJECT,
      CardName.AQUIFER_STANDARD_PROJECT,
      CardName.GREENERY_STANDARD_PROJECT,
      CardName.CITY_STANDARD_PROJECT,
    ],

  },
});
</script>
