<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import { useCesium } from "@/composition/useCesium";
import type { Entity } from "cesium";

const show = ref(false);
const id = ref("");
const name = ref("");

const clear = () => (show.value = false);

const update = (entity: Entity | undefined) => {
  if (!entity) return clear();

  show.value = true;
  id.value = entity.id as string;
  name.value = entity.name ?? "No name provided";
};

const { whenEntitySelected, process } = useCesium();
let entitySelectedHandler = whenEntitySelected(update);
onUnmounted(() => entitySelectedHandler?.());

const remove = () => {
  process([{ id: id.value, delete: true }]);
};

const close = () => {
  const { viewer } = useCesium();
  show.value = false;

  if (!viewer) return;
  viewer.selectedEntity = undefined;
};
</script>

<template>
  <transition name="info-panel">
    <div
      class="info-panel absolute top-10 right-3 w-64 bg-gray-900 bg-opacity-30 backdrop-blur-md z-10 rounded text-xs text-gray-200"
      v-if="show">
      <div class="px-2 py-1 flex justify-between items-center">
        {{ name }}

        <button type="button" class="" @click="close">&times;</button>
      </div>

      <div class="px-2 flex justify-end space-x-2 py-1">
        <button type="button" @click="remove">Delete</button>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.info-panel-enter-from,
.info-panel-leave-to {
  opacity: 0;
}

.info-panel-enter-active,
.info-panel-leave-active {
  transition: opacity 300ms ease;
}
</style>
