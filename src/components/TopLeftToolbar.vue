<script setup lang="ts">
import { useCesium } from "@/composition/useCesium";
import TheToolbar from "@/components/TheToolbar.vue";
const cesium = useCesium();
</script>

<template>
  <the-toolbar top left>
    <button @click="cesium.home" title="Go to home location">
      <fa-icon icon="home" />
    </button>
  </the-toolbar>
</template>
