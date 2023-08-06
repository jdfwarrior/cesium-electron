<script setup lang="ts">
import { useCesium } from "@/composition/useCesium";
import { useHotkey } from "@/composition/useHotkey";
import type { MenuItem } from '@/types/MenuItem'

const cesium = useCesium();

useHotkey("Ctrl + H", cesium.home);
useHotkey("Ctrl + Backspace", cesium.clear);

function onMinimize() {
  if (!window?.api) return;
  window.api.minimize();
}

function onMaximize() {
  if (!window?.api) return;
  window.api.maximize();
}

function onExit() {
  if (!window?.api) return;
  window.api.exit();
}

function onFileClick(event: MouseEvent) {
  const menu: MenuItem[] = [
    { type: 'normal', label: 'Open', callback: { context: 'renderer', event: 'openfile', payload: 500 } },
    { type: 'normal', label: 'Open' },
    { type: 'separator' },
    { type: 'normal', label: 'Quit', callback: { context: 'main', event: 'quit' } }
  ]

  const { target } = event
  const rect = (target as HTMLButtonElement).getBoundingClientRect()
  const options = rect ? { x: Math.floor(rect.x), y: Math.floor(rect.bottom + 8) } : {}

  window?.api?.context(menu, options)
}
</script>

<template>
  <header id="header">
    <div class="w-1/3 px-3 flex items-center space-x-1">
      <button @click="onFileClick" class="menu-item">File</button>
      <button @click="onFileClick" class="menu-item">Edit</button>
      <button @click="onFileClick" class="menu-item">Window</button>
      <button @click="onFileClick" class="menu-item">Help</button>
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
  @apply absolute top-0 left-0 right-0 z-20;
  @apply flex justify-start items-center;
  @apply bg-gray-900 text-white bg-opacity-0 backdrop-blur-sm;
  height: 30px;
  font-size: 10px;
  -webkit-app-region: drag;
  transition: all 0.3s ease-in;
}

.menu-item {
  @apply bg-transparent px-2 cursor-pointer;
  -webkit-app-region: none;
}

.menu-item:hover {
  @apply bg-gray-800 rounded;
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
