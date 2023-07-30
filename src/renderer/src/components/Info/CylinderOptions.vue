<script setup lang="ts">
import type { Entity } from "cesium";
import { hasCylinder } from "./info-helpers";

defineProps<{ entity: Entity | undefined }>();
</script>

<template>
  <template v-if="hasCylinder(entity)">
    <h3 class="text-lg px-3 text-gray-800 font-bold">Cylinder</h3>
    <section class="section-rows">
      <div class="row">
        <label class="label">Show</label>
        <span class="value">{{ entity?.cylinder?.show }}</span>
      </div>
      <div class="row">
        <label class="label">Top Radius (m)</label>
        <span class="value">{{ entity?.cylinder?.topRadius }}</span>
      </div>
      <div class="row">
        <label class="label">Bottom Radius (m)</label>
        <span class="value">{{ entity?.cylinder?.bottomRadius }}</span>
      </div>
      <div class="row">
        <label class="label">Length (m)</label>
        <span class="value">{{ entity?.cylinder?.length }}</span>
      </div>
    </section>
  </template>
</template>
