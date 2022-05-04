<script setup lang="ts">
import { onMounted } from "vue";
import { useCesium } from "./composition/useCesium";

import TheHeader from "./components/TheHeader.vue";
import TheToolbar from "./components/TheToolbar.vue";
import InfoPanel from "./components/InfoPanel.vue";
import type { AppMenuItem } from "./types/AppMenuItem";

const cesium = useCesium();
const { isPlaying, currentTime } = cesium;

onMounted(() => {
  cesium.init("cesium");

  window?.electron?.on("czml", (_: any, data: any) => {
    console.log(`received czml`, data);
    cesium.process(data);
  });

  window.electron.on("whats-here", (_: any, payload: any) => {
    const description = `Latitude: ${payload.cartographic.latitude}, Longitude: ${payload.cartographic.longitude}`;
    alert(description);
  });

  window.electron.on("delete", (_: any, payload: any) => {
    const czml = payload.entities.map((id: string) => ({ id, delete: true }));
    cesium.process(czml);
  });

  window.electron.on("set-speed", (_: any, payload: any) => {
    if ("value" in payload) {
      cesium.setSpeed(payload.value);
    }
  });

  cesium.on("right_click", (event) => {
    const cartographic = cesium.getCartographic(event.position);
    const entities = cesium.getPicked(event.position);

    const contextmenu: AppMenuItem[] = [
      { label: "What's here?", emits: "whats-here" },
      { label: "Delete", emits: "delete", enabled: !!entities.length },
    ];

    window.electron.context(contextmenu, { cartographic, entities });
  });
});

function showSpeedContext() {
  const menu: AppMenuItem[] = [
    { label: "1x", emits: "set-speed", value: 1 },
    { label: "2x", emits: "set-speed", value: 2 },
    { label: "5x", emits: "set-speed", value: 5 },
    { label: "10x", emits: "set-speed", value: 10 },
    { label: "20x", emits: "set-speed", value: 20 },
    { label: "50x", emits: "set-speed", value: 50 },
    { label: "100x", emits: "set-speed", value: 100 },
  ];

  window.electron.context(menu);
}
</script>

<template>
  <the-header />

  <the-toolbar bottom left class="select-none text-xs">
    <button :disabled="isPlaying" @click="cesium.play" title="Play the loaded animation"
      class="disabled:text-gray-700 transform hover:scale-150 focus:outline-none">
      <fa-icon icon="play" class="mr-1" />
    </button>
    <button :disabled="!isPlaying" @click="cesium.pause" title="Pause the currently playing animation"
      class="disabled:text-gray-700 transform hover:scale-150 focus:outline-none">
      <fa-icon icon="pause" class="mr-1" />
    </button>
    <button class="disabled:text-gray-700 transform hover:scale-150 focus:outline-none" title="Playback Speed">
      <fa-icon icon="gauge-high" @click="showSpeedContext" class="mr-1" />
    </button>
    <button class="focus:outline-none tabular-nums">
      {{ currentTime }}
    </button>
  </the-toolbar>

  <the-toolbar bottom right class="tabular-nums text-xs select-none">
    {{ cesium.mouseLatitude }}, {{ cesium.mouseLongitude }}
    <fa-icon icon="arrow-pointer" class="ml-2" />
  </the-toolbar>

  <info-panel />

  <div id="cesium"></div>
</template>

<style>
@import "./assets/base.css";

#app,
#cesium {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

#cesium {
  top: 00px;
}

.cesium-viewer-bottom {
  display: none !important;
}

.cesium-timeline-main {
  @apply bg-gray-900 bg-opacity-0 backdrop-blur-sm;
  transition: all 0.3s ease-in;
  border: none !important;
}

.cesium-timeline-main:hover {
  @apply bg-opacity-70;
}

.cesium-timeline-trackContainer {
  border-top: none !important;
}

.cesium-timeline-bar {
  background: none !important;
}

.cesium-timeline-ticLabel {
  user-select: none !important;
}
</style>
