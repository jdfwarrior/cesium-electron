<script setup lang="ts">
import { onMounted } from "vue";
import { useCesium } from "./composition/useCesium";

import TheHeader from "./components/TheHeader.vue";
import InfoPanel from "./components/InfoPanel.vue";
import ContextualMenu from "./components/ContextMenu/ContextualMenu.vue";
import AnimationController from "./components/AnimationController.vue";
import TopLeftToolbar from "./components/TopLeftToolbar.vue";
import TopRightToolbar from "./components/TopRightToolbar.vue";
import MouseTracker from "./components/MouseTracker.vue";
import type { AppMenuItem } from "./types/AppMenuItem";

const cesium = useCesium();
const { selected } = cesium;

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

  cesium.createTimeline("#timeline");
});
</script>

<template>
  <the-header />

  <top-left-toolbar />
  <top-right-toolbar />

  <div id="cesium"></div>

  <info-panel v-if="selected" />
  <contextual-menu />

  <div
    class="flex justify-start items-center absolute bottom-3 space-x-3 left-3 right-3 h-6"
  >
    <div><animation-controller /></div>
    <div id="timeline" class="grow cesium-viewer-timelineContainer"></div>
    <div><mouse-tracker /></div>
  </div>
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
  top: 0px;
}

.cesium-viewer-bottom {
  display: none !important;
}

.cesium-viewer-timelineContainer {
  @apply bg-gray-900 bg-opacity-10 backdrop-blur-md;
  @apply border border-gray-700 text-gray-200 shadow select-none absolute;
  @apply rounded-full;
  position: relative !important;
  left: 0px !important;
  right: 0px !important;
  width: auto;
  /* left: 0.75rem !important;
  right: 0.75rem !important;
  bottom: 0.5rem !important; */
}

.cesium-timeline-icon16 {
  background-image: url("/timeline-marker.png") !important;
}

.cesium-timeline-main {
  @apply bg-gray-900 bg-opacity-0 backdrop-blur-sm text-white h-6;
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
