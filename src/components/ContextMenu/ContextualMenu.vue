<script setup lang="ts">
import { useContextMenu } from "@/composition/useContextMenu";
import MenuItem from "./MenuItem.vue";

const { styles, items, anchor, close } = useContextMenu();
</script>

<script lang="ts">
export default {
  name: "ContextMenu",
};
</script>

<template>
  <teleport :to="anchor" v-if="items.length">
    <div class="fixed inset-0" @click="close">
      <div class="context-menu" :style="styles">
        <menu-item v-for="item in items" :key="item.id" v-bind="item" />
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.context-menu {
  @apply fixed flex flex-col z-30 text-xs;
  @apply border border-gray-700;
  @apply bg-gray-900 rounded bg-opacity-10 text-white backdrop-blur-md shadow;
}
</style>
