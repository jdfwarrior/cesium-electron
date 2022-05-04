<script setup lang="ts">
import { ref } from 'vue';

const wrapper = ref<HTMLDivElement | null>(null)
const show = ref(false)
const position = ref<{ top: string | undefined, right: string | undefined, bottom: string | undefined, left: string | undefined, 'min-width': string }>({
    top: '',
    right: '',
    bottom: '',
    left: '',
    "min-width": '100px'
})

function outsideHandler(event: MouseEvent) {
    if (!wrapper.value?.contains(event.target as HTMLElement)) {
        show.value = false
        document.removeEventListener('click', outsideHandler)
    }
}

function toggle() {
    if (!show.value) {
        const parentRect = wrapper.value?.getBoundingClientRect()
        if (parentRect) {
            position.value.top = parentRect.height + 5 + 'px'
            position.value.right = undefined
            position.value.bottom = undefined
            position.value.left = '0px'

            show.value = true

            document.addEventListener('click', outsideHandler)
        }
    } else {
        show.value = false
        document.removeEventListener('click', outsideHandler)
    }
}
</script>

<template>
    <div class="relative" ref="wrapper">
        <div class="vmenu-wrapper" @click="toggle">
            <slot></slot>
        </div>

        <span v-if="show" class="absolute z-40" :style="position">
            <slot name="popup"></slot>
        </span>
    </div>
</template>