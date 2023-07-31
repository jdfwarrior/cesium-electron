<script setup lang="ts">
import { useProgress } from '@/composition/useProgress'
const { percent, show } = useProgress()
</script>

<template>
    <div class="absolute top-6 left-0 w-full h-0.5 z-20" v-if="show">
        <div class="progress-step h-full bg-blue-400" :style="{ width: percent + '%' }"></div>
    </div>
</template>

<style scoped>
.progress-step {
    width: 0%;
    transition: all 0.5s ease;
}
</style>