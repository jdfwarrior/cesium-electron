<script setup lang="ts">
const props = defineProps<{ id: number, type: 'error' | 'warn' | 'info' | 'success', text: string }>()
const emit = defineEmits<{
    remove: [id: number]
}>()
</script>

<template>
    <div class="px-2 py-1 text-white flex justify-center" v-if="true">
        <div class="toast py-1" :class="[`toast-${type}`]">
            <p class="px-2">{{ props.text }}</p>

            <button class="px-2 transform hover:scale-125" @click="emit('remove', props.id)">&times;</button>
        </div>
    </div>
</template>

<style scoped>
.toast {
    @apply flex rounded;
}

.toast-error {
    @apply bg-red-500;
}

.toast-warn {
    @apply bg-yellow-500;
}

.toast-info {
    @apply bg-blue-500;
}

.toast-success {
    @apply bg-green-500;
}
</style>