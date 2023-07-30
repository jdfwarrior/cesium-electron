<script setup lang="ts">
import { useCesium } from "@/composition/useCesium";

import TheToolbar from "@/components/TheToolbar.vue";

const cesium = useCesium();
const { isPlaying, currentTime } = cesium;

const playbackContext = [
  { id: "1x", text: "1x", click: () => cesium.setSpeed(1) },
  { id: "2x", text: "2x", click: () => cesium.setSpeed(2) },
  { id: "5x", text: "5x", click: () => cesium.setSpeed(5) },
  { id: "10x", text: "10x", click: () => cesium.setSpeed(10) },
  { id: "20x", text: "20x", click: () => cesium.setSpeed(20) },
  { id: "50x", text: "50x", click: () => cesium.setSpeed(50) },
  { id: "100x", text: "100x", click: () => cesium.setSpeed(100) },
];
</script>

<template>
  <the-toolbar>
    <button :disabled="isPlaying" @click="cesium.play" title="Play the loaded animation">
      <fa-icon icon="play" class="mr-1" />
    </button>
    <button :disabled="!isPlaying" @click="cesium.pause" title="Pause the currently playing animation">
      <fa-icon icon="pause" class="mr-1" />
    </button>
    <button title="Playback Speed">
      <fa-icon icon="gauge-high" v-context="{ items: playbackContext, event: 'click' }" class="mr-1" />
    </button>
    <span class="focus:outline-none tabular-nums">
      {{ currentTime }}
    </span>
  </the-toolbar>
</template>
