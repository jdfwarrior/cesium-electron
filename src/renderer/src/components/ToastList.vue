<script setup lang="ts">
import Toast from './Toast.vue'
import { useToast } from '@/composition/useToast'

const { toasts, remove } = useToast()
</script>

<template>
    <section id="notification-list" class="absolute top-10 left-1/2 -translate-x-1/2 z-20 flex flex-col space-y-1">
        <TransitionGroup name="slide" tag="div">
            <toast v-for="toast in toasts" :key="toast.id" v-bind="toast" @remove="remove" />
        </TransitionGroup>
    </section>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: opacity 1s ease;
}

.slide-enter-from,
.slide-leave-to {
    opacity: 0;
}
</style>