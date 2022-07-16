<script setup lang="ts">
    import { OhVueIcon } from "oh-vue-icons";
    import Background from '../assets/liquid-cheese.svg'
</script>

<script lang="ts">
    export default {
        components: {
            "v-icon": OhVueIcon,
        },
        methods: {
            newBoard() {
                this.$router.push({ path: '/whiteboard' });
            }
        }
    }
</script>

<template>
    <div class="bg-[url('https://svgshare.com/i/j8n.svg')] bg-no-repeat bg-cover h-screen w-screen">
        <div class="grid grid-cols-1 h-screen w-screen justify-items-center content-center bg-filter">
            <div class="w-1/4 flex flex-col items-center justify-center">
                <button class="flex justify-center items-center px-2 py-2 border border-gray-700 rounded-lg mb-4">
                    <v-icon name="bi-cloud-upload" scale="1.5" class="mr-2"></v-icon> Load Whiteboard
                </button>
                <button 
                    class="flex justify-center items-center px-2 py-2 border border-gray-700 rounded-lg"
                    @click="newBoard"
                >
                    <v-icon name="bi-arrow-right-short" scale="1.5" class="mr-2"></v-icon> New Whiteboard
                </button>
            </div>
        </div>
    </div>
</template>

<style>
    .bg-filter {
        background-color: rgba(0, 0, 0, 0.15);
    }
</style>