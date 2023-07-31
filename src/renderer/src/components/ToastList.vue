<script setup lang="ts">
import Toast from './Toast.vue'
import { useToast } from '@/composition/useToast'

const { toasts, remove } = useToast()
</script>

<template>
    <section id="toast-list" class="absolute top-10 left-1/2 -translate-x-1/2 z-20 flex flex-col space-y-1">
        <toast v-for="toast in toasts" :key="toast.id" v-bind="toast" @remove="remove" />
    </section>
</template>