<script setup lang="ts">
import { useContextMenu } from "@/composition/useContextMenu";

const { styles, items, anchor } = useContextMenu();
</script>

<template>
  <teleport :to="anchor">
    <div class="context-menu" :style="styles">
      <button
        class="hover:bg-gray-700 px-3 py-1"
        v-for="item in items"
        :key="item.id"
        @click="item.click"
      >
        {{ item.text }}
      </button>
    </div>
  </teleport>
</template>

<style scoped>
.context-menu {
  @apply fixed flex flex-col z-20 text-xs;
  @apply border border-gray-700;
  @apply bg-gray-900 rounded bg-opacity-10 text-white backdrop-blur-md shadow;
}

.context-menu > button {
  @apply flex justify-start px-3 py-1;
}

.context-menu > button:hover {
  @apply bg-gray-700;
}
</style>
