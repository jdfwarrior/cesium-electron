<script setup lang="ts">
import type { Entity } from "cesium";
import { hasModel } from "./info-helpers";

defineProps<{ entity: Entity | undefined }>();
</script>

<template>
  <template v-if="hasModel(entity)">
    <h3 class="text-lg px-3 text-gray-800 font-bold">Model</h3>
    <section class="section-rows">
      <div class="row">
        <label class="label">Show</label>
        <span class="value">{{ entity?.model?.show }}</span>
      </div>
    </section>
  </template>
</template>
