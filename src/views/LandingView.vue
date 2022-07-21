<script setup lang="ts">
</script>

<script lang="ts">
    export default {
        methods: {
            toggleLayout(newLayout: string) {
                this.$emit("toggleLayoutEvent", newLayout);
            }
        }
    }
</script>

<template>
    <div class="grid grid-cols-1 h-screen w-screen justify-items-center content-center bg-filter">
        <div class="mb-4">
            <h1 class="font-medium text-2xl">Hello there 👋🏽</h1>
        </div>
        <div class="w-1/4 flex flex-col items-center justify-center">
            <button
                class="flex justify-center items-center px-2 py-2 border border-gray-700 rounded-lg hover:bg-yellow-200 mb-4 w-[175px]"
                @click="toggleLayout('whiteboardSelect')">
                <v-icon name="bi-arrow-right-short" scale="1.5" class="mr-2"></v-icon> Whiteboard 
            </button>
            <button
                class="flex justify-center items-center px-2 py-2 border border-gray-700 rounded-lg hover:bg-yellow-200 w-[175px]"
                @click="toggleLayout('umlSelect')">
                <v-icon name="bi-arrow-right-short" scale="1.5" class="mr-2"></v-icon> UML diagram
            </button>
        </div>
    </div>
</template>