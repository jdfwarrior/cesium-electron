<script setup lang="ts">
import { useCesium } from "@/composition/useCesium";
import TheToolbar from "@/components/TheToolbar.vue";
const cesium = useCesium();
</script>

<template>
  <the-toolbar top right>
    <button @click="cesium.clear" title="Reset all data">
      <fa-icon icon="arrow-rotate-left" />
    </button>
  </the-toolbar>
</template>
