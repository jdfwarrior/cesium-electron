<script setup lang="ts">
import { onMounted } from 'vue'
import { useCesium } from './composition/useCesium'

const cesium = useCesium()

onMounted(() => {
  cesium.init('cesium')

  window?.electron?.on('czml', (_: any, data: any) => {
    console.log(`received czml`, data)
    cesium.process(data)
  })
})
</script>

<template>
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
</style>
