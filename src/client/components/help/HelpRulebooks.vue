<template>
  <div class="help-rulebooks-container">
    <div class="help-rulebooks-section">
      <div class="help-icons-section-heading" v-i18n>Game Version</div>
      <div class="help-rulebook-rows">
        <a v-for="entry in officialExpansions" :key="entry.module" :href="entry.url" class="help-rulebook-row" target="_blank" v-i18n>
          <div :class="`create-game-expansion-icon expansion-icon-${entry.iconClass}`"></div>
          {{ entry.name }}
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {RULEBOOK_URLS} from '@/client/utils/WikiLinks';

interface RulebookEntry {
  module: string;
  name: string;
  iconClass: string;
  url: string;
}

const officialExpansions: ReadonlyArray<RulebookEntry> = [
  {module: 'corpera', name: 'Corporate Era', iconClass: 'CE', url: RULEBOOK_URLS.corpera},
];

export default defineComponent({
  name: 'HelpRulebooks',
  data() {
    return {
      officialExpansions,
    };
  },
});
</script>
