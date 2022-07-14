<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ message: string }>()

const count = ref(0)
</script>

<template>
    <h1>{{ message }}</h1>

    <h1 class='text-red-600 font-bold' >What up</h1>
</template>

