<script setup lang="ts">
</script>

<script lang="ts">
    export default {
        methods: {
            newBoard() {
                //this.$router.push({ path: '/whiteboard' });
            },
            handleUpload(event: any) {
                if(event.target.files[0].type !== 'application/json') return;
                let fileReader = new FileReader();
                fileReader.readAsText(event.target.files[0]);

                fileReader.onload = () => {
                    let data = fileReader.result as string;
                    //this.$router.push({ name: 'whiteboard', params: { data: data } });
                }
            },
            goBack() {
                this.$emit("toggleLayoutEvent", "landing");
            }
        }
    }
</script>

<template>
    <div class="grid grid-cols-1 h-screen w-screen justify-items-center content-center bg-filter">
        <div class="mb-4">
        </div>
        <div class="w-1/4 flex flex-col items-center justify-center">
            <div class="flex flex-col items-center justify-center border border-black rounded-lg mb-4 px-2 py-2">
                <span class="flex flex-row items-center mb-2">
                    <v-icon name="bi-cloud-upload" scale="1.5" class="mr-2"></v-icon> Load UML Diagram
                </span>
                <input
                    class="w-[100px] file:rounded-lg file:border-none file:px-2 file:py-1 file:bg-yellow-100 file:hover:bg-yellow-200 file:hover:cursor-pointer"
                    id="whiteboardLoad" type="file" @change="handleUpload" />
            </div>
            <button
                class="flex justify-center items-center px-2 py-2 border border-gray-700 rounded-lg hover:bg-yellow-200 mb-4"
                @click="newBoard">
                <v-icon name="bi-arrow-right-short" scale="1.5" class="mr-2"></v-icon> New UML Diagram
            </button>
            <button
                class="text-gray-800 hover:text-black"
                @click="goBack()"
            >
                Take me back 
            </button>
        </div>
    </div>
</template>