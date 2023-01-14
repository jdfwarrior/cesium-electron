<script setup lang="ts">
import { useCesium } from "@/composition/useCesium";
import TheToolbar from "@/components/TheToolbar.vue";
const cesium = useCesium();
</script>

<template>
  <the-toolbar
    bottom
    right
    class="tabular-nums"
    style="width: 160px; text-align: right"
  >
    {{ cesium.mouseLatitude }}, {{ cesium.mouseLongitude }}
    <fa-icon icon="arrow-pointer" class="ml-2" />
  </the-toolbar>
</template>
