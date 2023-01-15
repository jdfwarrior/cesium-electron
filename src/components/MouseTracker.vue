<script setup lang="ts">
import { useCesium } from "@/composition/useCesium";
import TheToolbar from "@/components/TheToolbar.vue";
const cesium = useCesium();
</script>

<template>
  <the-toolbar class="tabular-nums justify-end" style="width: 160px">
    {{ cesium.mouseLatitude }}, {{ cesium.mouseLongitude }}
    <fa-icon icon="arrow-pointer" class="ml-2" />
  </the-toolbar>
</template>
