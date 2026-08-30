<template>
  <PopupPanel @close="$emit('close')">
    <template #header>
      <h2>Keyboard Shortcuts</h2>
    </template>
    A - Main Board<br>
    S - Players Overview Table<br>
    D - Cards in Hand<br>
    F - Colonies<br>
    <br>
    ? - Show this help<br>
    ESC - close this help<br>
    <br>More coming.
  </PopupPanel>
</template>
<script lang="ts">
import {defineComponent} from 'vue';
import PopupPanel from './common/PopupPanel.vue';

export default defineComponent({
  name: 'KeyboardShortcuts',
  components: {
    PopupPanel,
  },
});
</script>
