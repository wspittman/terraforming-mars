<template>
  <div :class="outerClass">
    <Tag :tag="(tag as CardTag)" :size="size" :type="type"/>
    <span :class="innerClass">{{ count }}</span>
  </div>
</template>

<script lang="ts">

import {defineComponent, PropType} from 'vue';
import Tag from '@/client/components/Tag.vue';
import {Tag as CardTag} from '@/common/cards/Tag';
import {SpecialTags} from '@/client/cards/SpecialTags';

// Display-only tags used in PlayerTags for overview counts.
type DisplayTag = 'vp' | 'tr' | 'handicap' | 'cards' | 'escape';

export default defineComponent({
  name: 'TagCount',
  props: {
    tag: {
      type: String as () => CardTag | SpecialTags | DisplayTag,
      required: true,
    },
    count: {
      type: [Number, String] as PropType<number | string>,
    },
    size: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    showWhenZero: {
      // When true, show even if the value is zero.
      type: Boolean,
      required: false,
      default: false,
    },
  },
  components: {
    Tag,
  },
  computed: {
    outerClass(): string {
      const classes = ['tag-display'];
      if (this.count === 0 && this.showWhenZero === false) {
        classes.push('tag-no-show');
      }
      return classes.join(' ');
    },
    innerClass(): string {
      const classes = ['tag-count-display'];
      if (this.count === 0 && this.showWhenZero === false) {
        classes.push('tag-count-no-show');
      }

      return classes.join(' ');
    },
  },
});
</script>

