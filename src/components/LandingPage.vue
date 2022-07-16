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
            },
            handleUpload(event: any) {
                if(event.target.files[0].type !== 'application/json') return;
                let fileReader = new FileReader();
                fileReader.readAsText(event.target.files[0]);

                fileReader.onload = () => {
                    let data = fileReader.result as string;
                    this.$router.push({ name: 'whiteboard', params: { data: data } });
                }
            }
        }
    }
</script>

<template>
    <div class="bg-[url('https://svgshare.com/i/j8n.svg')] bg-no-repeat bg-cover h-screen w-screen">
        <div class="grid grid-cols-1 h-screen w-screen justify-items-center content-center bg-filter">
            <div class="w-1/4 flex flex-col items-center justify-center">
                <div class="flex flex-col items-center justify-center mb-2 border border-black rounded-lg px-2 py-2">
                    <span class="flex flex-row items-center mb-2">
                        <v-icon name="bi-cloud-upload" scale="1.5" class="mr-2"></v-icon> Load Whiteboard
                    </span>
                    <input 
                        class="w-[100px] file:rounded-lg file:border-none file:px-2 file:py-1 file:bg-yellow-100 file:hover:bg-yellow-200 file:hover:cursor-pointer" 
                        id="whiteboardLoad" 
                        type="file" 
                        @change="handleUpload"
                    />
                </div>
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
        background-color: rgba(0, 0, 0, 0.05);
    }
</style>