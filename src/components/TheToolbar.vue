<script setup lang="ts">
import { computed } from "vue";

interface ToolbarProps {
  top?: boolean;
  center?: boolean;
  left?: boolean;
  right?: boolean;
  bottom?: boolean;
}

const props = defineProps<ToolbarProps>();

const positionClasses = computed(() => {
  const classes: string[] = [];

  if (props.top && props.left) classes.push("top-10", "left-5", "space-x-2");
  else if (props.top && props.center)
    classes.push(
      "top-10",
      "left-1/2",
      "transform",
      "-translate-x-1/2",
      "space-x-2"
    );
  else if (props.top && props.right)
    classes.push("top-10", "right-3", "space-x-2");
  else if (props.left && props.center)
    classes.push(
      "top-1/2",
      "transform",
      "-translate-y-1/2",
      "left-3",
      "flex-col",
      "space-y-2"
    );
  else if (props.right && props.center)
    classes.push(
      "top-1/2",
      "transform",
      "-translate-y-1/2",
      "right-3",
      "flex-col",
      "space-y-2"
    );
  else if (props.bottom && props.left)
    classes.push("bottom-10", "left-3", "space-x-2");
  else if (props.bottom && props.center)
    classes.push(
      "bottom-10",
      "left-1/2",
      "transform",
      "-translate-x-1/2",
      "space-x-2"
    );
  else if (props.bottom && props.right)
    classes.push("bottom-10", "right-3", "space-x-2");
  else classes.push("top-10", "left-3", "space-x-2");

  return classes;
});
</script>

<template>
  <div id="toolbar" :class="positionClasses">
    <slot />
  </div>
</template>

<style scoped>
#toolbar {
  @apply absolute z-20;
  @apply flex justify-start items-center;
  @apply bg-gray-900 p-1 rounded bg-opacity-30 backdrop-blur-md;
  @apply shadow border border-gray-700;
  @apply text-gray-200;
}
</style>
