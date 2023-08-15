<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.metaKey && event.shiftKey && event.key.toLowerCase() === 'k') {
            const ele = document.querySelector('#command-palette') as HTMLDialogElement
            if (ele) ele.showModal()

        }
    })
})

function hide() {
    const ele = document.querySelector('#command-palette') as HTMLDialogElement
    if (ele) ele.close()
}
</script>

<template>
    <dialog id="command-palette" class="bg-transparent relative" @click="hide">
        <div class="fixed top-24 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white rounded p-3 w-1/2 shadow-lg">
            <fa-icon icon="magnifying-glass" fixed-width class="mr-4" />
            <input type="text" placeholder="Search" class="bg-transparent focus:outline-none" />
        </div>
    </dialog>
</template>