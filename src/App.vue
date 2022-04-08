<script setup lang="ts">
import { onMounted } from "vue";
import { useCesium } from "./composition/useCesium";

import TheHeader from "./components/TheHeader.vue";
import TheToolbar from "./components/TheToolbar.vue";
import ToolbarButton from "./components/ToolbarButton.vue";
import IconHome from "./components/icons/IconHome.vue";
import IconMouse from "./components/icons/IconMouse.vue";
import IconPlay from "./components/icons/IconPlay.vue";
import IconPause from "./components/icons/IconPause.vue";

const cesium = useCesium();

const { isPlaying } = cesium;

onMounted(() => {
  cesium.init("cesium");

  window?.electron?.on("czml", (_: any, data: any) => {
    console.log(`received czml`, data);
    cesium.process(data);
  });
});
</script>

<template>
  <the-header />
  <the-toolbar class="text-xs">
    <toolbar-button @click="cesium.home"><icon-home /></toolbar-button>
  </the-toolbar>

  <the-toolbar bottom left class="text-xs">
    <toolbar-button>
      <icon-play v-if="isPlaying" @click="cesium.pause" />
      <icon-pause v-else @click="cesium.play" />
    </toolbar-button>
  </the-toolbar>

  <the-toolbar bottom right class="tabular-nums text-xs">
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

.cesium-viewer-bottom {
  display: none !important;
}

.cesium-timeline-main {
  @apply bg-gray-900 bg-opacity-70;
}

.cesium-timeline-bar {
  background: none !important;
}
</style>
