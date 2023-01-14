<script setup lang="ts">
import { useCesium } from "@/composition/useCesium";
import TheToolbar from "@/components/TheToolbar.vue";
const cesium = useCesium();

function loadSampleData() {
  const start = new Date("2023-01-01").toISOString();
  const end = new Date("2023-01-10").toISOString();

  const doc = {
    id: "document",
    version: "1.0",
    clock: {
      interval: `${start}/${end}`,
      currentTime: start,
      multiplier: 10,
      range: "LOOP_STOP",
    },
  };

  const entity1 = {
    id: "entity1",
    name: "Sample Entity Billboard",
    description: `This is a sample entity with a billboard on it located near Huntsville, AL.`,
    position: {
      cartographicDegrees: [-86, 34, 100],
    },
    billboard: {
      scale: 1,
      image: {
        uri: "/favicon.ico",
      },
    },
  };

  cesium.process([doc, entity1]);
}

const menuItems = [
  { id: "samples", text: "Load Sample Date", click: loadSampleData },
];
</script>

<template>
  <the-toolbar top left>
    <button @click="cesium.home" title="Go to home location">
      <fa-icon icon="home" />
    </button>
    <button v-context="{ event: 'click', items: menuItems }">
      <fa-icon icon="chevron-down" />
    </button>
  </the-toolbar>
</template>
