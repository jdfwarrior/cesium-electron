<script setup lang="ts">
import { computed } from "vue";

export interface ToolbarProps {
  top?: boolean;
  center?: boolean;
  left?: boolean;
  right?: boolean;
  bottom?: boolean;
}

const props = defineProps<ToolbarProps>();

const positionClasses = computed(() => {
  const classes: string[] = [];

  if (props.left || props.right || props.top || props.bottom) {
    classes.push("absolute", "z-10");
  }

  if (props.left) classes.push("justify-start", "left-3");
  if (props.right) classes.push("justify-end", "right-3");
  if (props.top) classes.push("top-10");
  if (props.bottom) classes.push("bottom-10");

  classes.push("space-x-2");

  return classes;
});
</script>

<template>
  <div class="toolbar" :class="positionClasses">
    <slot />
  </div>
</template>

<style scoped>
.toolbar {
  @apply flex items-center;
  @apply bg-gray-900 py-1 px-2 rounded-full bg-opacity-10 backdrop-blur-md;
  @apply shadow border border-gray-700;
  @apply text-gray-200;
  @apply select-none text-xs;
}

.toolbar :deep(button) {
  @apply transform;
}

.toolbar :deep(button:hover) {
  @apply scale-150;
}

.toolbar :deep(button:focus) {
  @apply outline-none;
}

.toolbar :deep(button:disabled) {
  @apply text-gray-700;
}
</style>
