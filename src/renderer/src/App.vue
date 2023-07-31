<script setup lang="ts">
import { onMounted } from "vue";
import { useCesium } from "./composition/useCesium";
import { useProgress } from "./composition/useProgress";

import TheHeader from "./components/TheHeader.vue";
import InfoPanel from "./components/InfoPanel.vue";
import ContextualMenu from "./components/ContextMenu/ContextualMenu.vue";
import AnimationController from "./components/AnimationController.vue";
import TopLeftToolbar from "./components/TopLeftToolbar.vue";
import TopRightToolbar from "./components/TopRightToolbar.vue";
import MouseTracker from "./components/MouseTracker.vue";
import ToastList from "./components/ToastList.vue";
import ProgressIndicator from './components/ProgressIndicator.vue'
import { Cartesian2 } from "cesium";
import type { CameraAndOrientation } from '@/types/Cesium'

const cesium = useCesium();
const { selected, selectById } = cesium;
const progress = useProgress()

onMounted(async () => {
  cesium.init("cesium");
  const defaultCamera = await window.api?.get('app.defaultCamera') as CameraAndOrientation | undefined

  if (defaultCamera) {
    cesium.setCamera(defaultCamera)
  }

  window?.api?.on("czml", (_: any, data: any) => {
    console.log(`received czml`, data);
    cesium.process(data);
  });

  window?.api?.on('save-current-view', () => {
    console.log('got request to save this view')
    const view = cesium.getCamera()
    window?.api?.set('app.defaultCamera', view)
  })

  window?.api?.on('set-progress-total', (_, count) => {
    console.log(`setting progress total to ${count}`)
    progress.setTotal(count)
  })
  window?.api?.on('load', (_, data) => {
    progress.increment()
    cesium.process(data)
  })

  cesium.createTimeline("#timeline");
});

function remove(entities: string[]): void {
  const czml = entities.map((id: string) => ({ id, delete: true }));
  cesium.process(czml);
}

function select(entities: string[]): void {
  const [entity] = entities;
  if (entity) selectById(entity);
}

function createCesiumContext(event: MouseEvent) {
  const cartesian = new Cartesian2(event.clientX, event.clientY);
  const entities = cesium.getPicked(cartesian);
  // const cartographic = cesium.getCartographic(cartesian);

  const hasEntities = !!entities.length;

  const items = [
    {
      id: "select",
      text: "Select",
      click: () => select(entities),
      disabled: !hasEntities
    },
    {
      id: "remove",
      text: "Remove",
      click: () => remove(entities),
      disabled: !hasEntities
    }
  ];

  return items;
}

async function onDrop(event: DragEvent) {
  const files = event.dataTransfer?.files
  if (!files) return

  progress.setTotal(files.length)
  const paths = Array.from(files).map(file => file.path)
  window.api.parse(paths)
}
</script>

<template>
  <the-header />
  <progress-indicator />

  <top-left-toolbar />
  <toast-list />
  <top-right-toolbar />

  <div id="cesium" v-context="{ items: createCesiumContext }" @dragover.prevent.stop @drop="onDrop"></div>

  <info-panel v-if="selected" />
  <contextual-menu />

  <div class="flex justify-start items-center absolute bottom-3 space-x-3 left-3 right-3 h-6">
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
