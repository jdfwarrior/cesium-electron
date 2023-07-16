<script setup lang="ts">
import { ref, computed } from "vue";

export interface MenuItem {
  id: string;
  text: string;
  click?: () => void;
  disabled?: boolean;
  items?: MenuItem[];
}

defineProps<MenuItem>();

const ele = ref<HTMLElement | null>(null);

const reveal = ref(false);

const submenuStyles = computed(() => {
  if (!ele.value) return { left: `0px`, top: `0px` };
  else {
    const { width } = ele.value.getBoundingClientRect();
    return { left: width + "px", top: "0px" };
  }
});
</script>

<script lang="ts">
export default {
  name: "MenuItem",
};
</script>

<template>
  <button
    class="hover:bg-gray-700 px-3 py-1 relative"
    @click="click?.()"
    :disabled="disabled"
    ref="ele"
    @mouseenter="reveal = true"
    @mouseleave="reveal = false"
  >
    {{ text }}

    <template v-if="items && reveal">
      <div class="context-menu" :style="submenuStyles">
        <menu-item v-for="item in items" :key="item.id" v-bind="item" />
      </div>
    </template>
  </button>
</template>

<style scoped>
.context-menu {
  @apply absolute flex flex-col z-20 text-xs;
  @apply border border-gray-700;
  @apply bg-gray-900 rounded bg-opacity-10 text-white backdrop-blur-md shadow select-none;
}

.context-menu > button {
  @apply flex justify-start px-3 py-1 bg-gray-800;
}

.context-menu > button:disabled {
  @apply text-gray-400;
}

.context-menu > button:hover {
  @apply bg-gray-700;
}
</style>
