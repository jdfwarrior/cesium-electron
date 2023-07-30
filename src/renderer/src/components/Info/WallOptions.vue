<script setup lang="ts">
import type { Entity } from "cesium";
import { hasWall } from "./info-helpers";

defineProps<{ entity: Entity | undefined }>();
</script>

<template>
  <template v-if="hasWall(entity)">
    <h3 class="text-lg px-3 text-gray-800 font-bold">Wall</h3>
    <section class="section-rows">
      <div class="row">
        <label class="label">Show</label>
        <span class="value">{{ entity?.wall?.show }}</span>
      </div>
    </section>
  </template>
</template>
