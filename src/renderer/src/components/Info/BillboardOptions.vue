<script setup lang="ts">
import type { Entity } from "cesium";
import { computed } from "vue";
import { hasBillboard } from "./info-helpers";
import { useCesium } from "@/composition/useCesium";

const { currentJulian, process, viewer } = useCesium();

const props = defineProps<{ entity: Entity | undefined }>();

const show = computed(() => {
  if (!currentJulian.value) return true;
  const current = props.entity?.billboard?.show?.getValue(currentJulian.value);
  if (current === undefined) return true;
  return current;
});

const scale = computed(() => {
  if (!currentJulian.value) return 1;
  const current = props.entity?.billboard?.scale?.getValue(currentJulian.value);
  if (current === undefined) return 1;
  return current;
});

function toggleShow() {
  if (!props.entity) return;
  const change = !show.value;
  const { id } = props.entity;
  process([{ id, billboard: { show: { boolean: change } } }]);
  viewer?.scene.render();
}

function updateScale(_: Event) {
  // if (!props.entity) return;
  // const target = event.target as HTMLInputElement;
  // if (!target) return;
  // const change = target.valueAsNumber;
  // if (!change) return;
  // const { id } = props.entity;
  // process([{ id, billboard: { scale: { number: change } } }]);
  // viewer?.scene.render();

  if (!props.entity) return;
  const { id } = props.entity;

  process([{ id, billboard: { scale: false } }]);
}

scale.value;
</script>

<template>
  <template v-if="hasBillboard(entity)">
    <h3 class="text-lg px-3 text-gray-800 font-bold">Billboard</h3>
    <section class="section-rows">
      <div class="row">
        <label class="label">Show</label>
        <span class="value">
          <input type="checkbox" :checked="show" @change="toggleShow" />
        </span>
      </div>
      <div class="row">
        <label class="label">Scale</label>
        <span class="value">
          <input type="number" min="1" max="10" :value="scale" @input="updateScale" @change="updateScale" />
        </span>
      </div>
    </section>
  </template>
</template>
