<script setup lang="ts">
    import { OhVueIcon } from "oh-vue-icons";
    import Landing from "../views/LandingView.vue";
    import Whiteboard from "../views/WhiteboardView.vue";
    import UML from "../views/UMLView.vue";
</script>

<script lang="ts">
    export default {
        components: {
            "v-icon": OhVueIcon,
        },
        data() {
            return {
                currentLayout: "landing"
            }
        },
        methods: {
            toggleLayout(newLayout: string) {
                this.currentLayout = newLayout;
            }
        }
    }
</script>

<template>
    <div class="bg-[url('https://svgshare.com/i/j8n.svg')] bg-no-repeat bg-cover h-screen w-screen">
        <Landing v-if="currentLayout === 'landing'" @toggleLayoutEvent="toggleLayout"></Landing>
        <Whiteboard v-if="currentLayout === 'whiteboardSelect'" @toggleLayoutEvent="toggleLayout"></Whiteboard>
        <UML v-if="currentLayout === 'umlSelect'" @toggleLayoutEvent="toggleLayout"></UML>
    </div>
</template>

<style>
    .bg-filter {
        background-color: rgba(0, 0, 0, 0.05);
    }
</style>