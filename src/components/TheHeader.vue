<script setup lang="ts">
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
    <div class="w-1/3"></div>
    <div class="flex-grow text-center"></div>
    <div class="w-1/3 flex space-x-2 justify-end items-center px-3">
      <button
        title="Minimize"
        @click="onMinimize"
        class="window-control hover:bg-amber-300"
      ></button>
      <button
        title="Maximize"
        @click="onMaximize"
        class="window-control hover:bg-green-300"
      ></button>
      <button
        title="Exit"
        @click="onExit"
        class="window-control hover:bg-red-500"
      ></button>
    </div>
  </header>
</template>

<style scoped>
#header {
  @apply absolute top-0 left-0 right-0 z-2;
  @apply flex justify-start items-center;
  @apply bg-gray-900 bg-opacity-10 hover:bg-opacity-70 border-b border-transparent hover:border-gray-900;
  height: 30px;
  font-size: 10px;
  -webkit-app-region: drag;
}

.window-control {
  @apply w-2 h-2 rounded-full bg-slate-700;
}
</style>
