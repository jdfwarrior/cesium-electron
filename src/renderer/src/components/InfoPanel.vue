<script setup lang="ts">
import { reactive, onMounted, onUnmounted } from "vue";
import { useCesium } from "@/composition/useCesium";
import { debounce } from "@/composition/useDebounce";
import { throttle } from "@/utils/throttle";

import BillboardOptions from "./Info/BillboardOptions.vue";
import BoxOptions from "./Info/BoxOptions.vue";
import CorridorOptions from "./Info/CorridorOptions.vue";
import CylinderOptions from "./Info/CylinderOptions.vue";
import EllipseOptions from "./Info/EllipseOptions.vue";
import EllipsoidOptions from "./Info/EllipsoidOptions.vue";
import LabelOptions from "./Info/LabelOptions.vue";
import ModelOptions from "./Info/ModelOptions.vue";
import PathOptions from "./Info/PathOptions.vue";
import PointOptions from "./Info/PointOptions.vue";
import PolygonOptions from "./Info/PolygonOptions.vue";
import PolylineOptions from "./Info/PolylineOptions.vue";
import PolylineVolumeOptions from "./Info/PolylineVolumeOptions.vue";
import RectangleOptions from "./Info/RectangleOptions.vue";
import WallOptions from "./Info/WallOptions.vue";

const { selected, process } = useCesium();

const state = reactive({
  latitude: 0,
  longitude: 0,
});

function remove() {
  if (!selected.value) return;
  const { id } = selected.value;
  process([{ id, delete: true }]);
}

function close() {
  const { viewer } = useCesium();
  if (!viewer) return;
  viewer.selectedEntity = undefined;
}

function track() {
  const { viewer } = useCesium();
  if (!viewer) return;
  if (!viewer?.trackedEntity) viewer.trackedEntity = selected.value;
  else viewer.trackedEntity = undefined;
}

function positionWatcher() {
  if (!selected.value) return;
  const { viewer, getCartographic } = useCesium();
  if (!viewer) return;
  const currentJulian = viewer?.clock.currentTime;
  if (!selected) throw new Error(`no selected entity found`);
  const cartesian3 = selected.value?.position?.getValue(currentJulian);
  if (!cartesian3) throw new Error(`no cartesian found`);
  const cartographic = getCartographic(cartesian3);
  if (!cartographic) throw new Error(`no cartographic found`);
  const { latitude, longitude } = cartographic;
  state.latitude = latitude;
  state.longitude = longitude;
}

const throttlePosition = throttle(positionWatcher, 1000);

onMounted(() => {
  const { viewer } = useCesium();
  viewer?.clock.onTick.addEventListener(throttlePosition);
});

onUnmounted(() => {
  const { viewer } = useCesium();
  viewer?.clock.onTick.removeEventListener(throttlePosition);
});

const updateName = debounce((event: InputEvent) => {
  if (!selected.value) return;

  const target = event.target as HTMLInputElement;
  const name = target.value;

  const { id } = selected.value;

  const cesium = useCesium();
  cesium.process([{ id, name }]);
}, 500);
</script>

<template>
  <teleport to="body">
    <transition name="info-panel">
      <div v-draggable class="info-panel">
        <header class="mb-5 px-2 flex justify-end space-x-3 py-1">
          <button type="button" class="" @click="close">&times;</button>
        </header>

        <div class="h-full overflow-y-scroll">
          <h3 class="text-lg px-3 text-gray-800 font-bold">Entity Details</h3>

          <section class="section-rows">
            <div class="row">
              <label class="label">Name</label>
              <span class="value">
                <input
                  type="text"
                  :value="selected?.name"
                  @input="updateName"
                />
              </span>
            </div>
            <div class="row">
              <label class="label">Latitude</label>
              <span class="value">{{ state.latitude.toFixed(4) }}°</span>
            </div>
            <div class="row">
              <label class="label">Longitude</label>
              <span class="value">{{ state.longitude.toFixed(4) }}°</span>
            </div>
          </section>

          <h3 class="text-lg px-3 text-gray-800 font-bold">Description</h3>

          <section class="section-block">
            <p>{{ selected?.description ?? "This item has no description" }}</p>
          </section>

          <billboard-options :entity="selected" />
          <box-options :entity="selected" />
          <corridor-options :entity="selected" />
          <cylinder-options :entity="selected" />
          <ellipse-options :entity="selected" />
          <ellipsoid-options :entity="selected" />
          <label-options :entity="selected" />
          <model-options :entity="selected" />
          <path-options :entity="selected" />
          <point-options :entity="selected" />
          <polygon-options :entity="selected" />
          <polyline-options :entity="selected" />
          <polyline-volume-options :entity="selected" />
          <rectangle-options :entity="selected" />
          <wall-options :entity="selected" />
        </div>

        <footer class="mt-5 px-2 flex justify-end space-x-3 py-1">
          <button
            type="button"
            @click="track"
            title="Lock to the selected entity"
          >
            <fa-icon icon="lock" />
          </button>
          <button
            type="button"
            @click="remove"
            title="Remove the selected entity"
          >
            <fa-icon icon="trash-can" />
          </button>
        </footer>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.info-panel {
  @apply fixed top-20 right-3 w-72 flex flex-col;
  @apply bg-white bg-opacity-40 backdrop-blur-sm z-30 rounded shadow;
  @apply shadow;
  @apply text-xs text-gray-200;
  @apply h-2/3;
}

.info-panel header {
  @apply bg-white bg-opacity-40 backdrop-blur-md rounded-t shadow;
  @apply text-gray-800;
  @apply p-3;
}

.info-panel footer {
  @apply bg-white bg-opacity-40 backdrop-blur-md rounded-b shadow;
  @apply text-gray-800;
  @apply p-3;
}

.info-panel-enter-from,
.info-panel-leave-to {
  opacity: 0;
}

.info-panel-enter-active,
.info-panel-leave-active {
  transition: opacity 0.5s ease;
}
</style>
