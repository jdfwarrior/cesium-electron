<script setup lang="ts">
import type { Entity } from "cesium";
import { hasPolylineVolume } from "./info-helpers";

const props = defineProps<{ entity: Entity | undefined }>();
</script>

<template>
  <template v-if="hasPolylineVolume(entity)">
    <h3 class="text-lg px-3 text-gray-800 font-bold">Polyline Volume</h3>
    <section class="section-rows">
      <div class="row">
        <label class="label">Show</label>
        <span class="value">{{ entity?.polylineVolume?.show }}</span>
      </div>
    </section>
  </template>
</template>
