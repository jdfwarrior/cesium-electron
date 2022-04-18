<script setup lang="ts">
import { onMounted } from "vue";
import { useCesium } from "./composition/useCesium";

import TheHeader from "./components/TheHeader.vue";
import TheToolbar from "./components/TheToolbar.vue";
import IconMouse from "./components/icons/IconMouse.vue";
import type { AppMenuItem } from "./types/AppMenuItem";

const cesium = useCesium();

onMounted(() => {
  cesium.init("cesium");

  window?.electron?.on("czml", (_: any, data: any) => {
    console.log(`received czml`, data);
    cesium.process(data);
  });

  window.electron.on("whats-here", (_, payload: any) => {
    const description = `Latitude: ${payload.cartographic.latitude}, Longitude: ${payload.cartographic.longitude}`;
    alert(description);
  });

  window.electron.on("delete", (_, payload: any) => {
    const czml = payload.entities.map((id) => ({ id, delete: true }));
    cesium.process(czml);
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
</script>

<template>
  <the-header />

  <the-toolbar bottom right class="tabular-nums text-xs select-none">
    {{ cesium.mouseLatitude }}, {{ cesium.mouseLongitude }}
    <icon-mouse class="ml-1" />
  </the-toolbar>

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
  top: 30px;
}

.cesium-viewer-bottom {
  display: none !important;
}

.cesium-timeline-main {
  @apply bg-gray-900 bg-opacity-0 backdrop-filter backdrop-blur-sm;
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
