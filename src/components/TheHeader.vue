<script setup lang="ts">
import { useCesium } from "@/composition/useCesium";
import { useHotkey } from "@/composition/useHotkey";
import VMenu from '@/components/VMenu.vue'
import type { AppMenuItem } from "@/types/AppMenuItem";

const cesium = useCesium();

useHotkey("Ctrl + H", cesium.home);
useHotkey("Ctrl + Backspace", cesium.clear);

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

function log() {
  console.log('got it')
}
</script>

<template>
  <header id="header">
    <div class="w-1/3 px-2 flex items-center space-x-1">
      <VMenu>
        <button class="action-button" @click="cesium.home" title="Return to home location (Ctrl + H)">Home</button>
        <template #popup>
          <ul class="flex flex-col space-y-1 text-xs bg-white rounded p-2 text-gray-500 border border-gray-300">
            <li class="hover:bg-gray-200 px-2 rounded cursor-pointer">Option 1</li>
            <li class="hover:bg-gray-200 px-2 rounded cursor-pointer" @click="log">Option 2</li>
            <li class="hover:bg-gray-200 px-2 rounded cursor-pointer">Option 3</li>
            <li class="hover:bg-gray-200 px-2 rounded cursor-pointer">Option 4</li>
            <li class="hover:bg-gray-200 px-2 rounded cursor-pointer">Option 5</li>
          </ul>
        </template>
      </VMenu>

      <button class="action-button" @click="cesium.clear"
        title="Remove all entities from the globe (Ctrl + Backspace)">Clear</button>
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
  @apply bg-gray-800 text-gray-400;
  height: 30px;
  font-size: 10px;
  -webkit-app-region: drag;
  transition: all 0.3s ease-in;
}

.action-button {
  @apply px-2 py-1 rounded;
  cursor: pointer;
  user-select: none;
  -webkit-app-region: none;
}

.action-button:hover {
  @apply bg-gray-900;
}

.action-button:focus {
  @apply outline-none;
}

.action-button:disabled {
  cursor: not-allowed;
}

.window-control {
  @apply w-2 h-2 rounded-full bg-slate-700;
  -webkit-app-region: none;
}
</style>
