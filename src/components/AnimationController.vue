<script setup lang="ts">
import { useCesium } from "@/composition/useCesium";
import type { AppMenuItem } from "@/types/AppMenuItem";

import TheToolbar from "@/components/TheToolbar.vue";

const cesium = useCesium();
const { isPlaying, currentTime } = cesium;

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
  <the-toolbar>
    <button
      :disabled="isPlaying"
      @click="cesium.play"
      title="Play the loaded animation"
    >
      <fa-icon icon="play" class="mr-1" />
    </button>
    <button
      :disabled="!isPlaying"
      @click="cesium.pause"
      title="Pause the currently playing animation"
    >
      <fa-icon icon="pause" class="mr-1" />
    </button>
    <button title="Playback Speed">
      <fa-icon icon="gauge-high" @click="showSpeedContext" class="mr-1" />
    </button>
    <span class="focus:outline-none tabular-nums">
      {{ currentTime }}
    </span>
  </the-toolbar>
</template>
