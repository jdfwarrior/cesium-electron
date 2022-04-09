<script setup lang="ts">
import { useCesium } from '../composition/useCesium'

const cesium = useCesium()
const { isPlaying } = cesium

function onMinimize() {
  if (!window?.electron) return;
  window.electron.minimize();
}

function onMaximize() {
  if (!window?.electron) return;
  window.electron.maximize();
}

function onExit() {
  if (!window?.electron) return;
  window.electron.exit();
}
</script>

<template>
  <header id="header">
    <div class="w-1/3 px-3 flex items-center space-x-3">
      <button class="action-button" @click="cesium.home">Home</button>
      <button class="action-button" @click="cesium.play" v-if="!isPlaying">Play</button>
      <button class="action-button" @click="cesium.pause" v-else>Pause</button>
      <button class="action-button" @click="cesium.clear">Clear</button>
    </div>
    <div class="flex-grow text-center"></div>
    <div class="w-1/3 flex space-x-2 justify-end items-center px-3">
      <button title="Minimize" @click="onMinimize" class="window-control hover:bg-amber-300"></button>
      <button title="Maximize" @click="onMaximize" class="window-control hover:bg-green-300"></button>
      <button title="Exit" @click="onExit" class="window-control hover:bg-red-500"></button>
    </div>
  </header>
</template>

<style scoped>
#header {
  @apply absolute top-0 left-0 right-0 z-2;
  @apply flex justify-start items-center;
  @apply bg-gray-900 bg-opacity-0 hover:bg-opacity-70 backdrop-filter hover:backdrop-blur-md;
  @apply text-transparent hover:text-gray-400;
  height: 30px;
  font-size: 10px;
  -webkit-app-region: drag;
  transition: all 0.3s ease-in;
}

.action-button {
  @apply px-2 py-1 hover:bg-gray-900 rounded-full focus:outline-none;
  cursor: pointer;
}

.action-button:disabled {
  cursor: not-allowed;
}

.window-control {
  @apply w-2 h-2 rounded-full bg-slate-700;
}
</style>
