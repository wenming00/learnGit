<script setup lang="ts">
import { getMessage } from '@/apis/demo'
const props = defineProps<{ msg: string }>()

const handleRequest = async() => {
  const res = await getMessage()
}
</script>

<template>
  <div class="greetings">
    <h1 class="green" @click="handleRequest">{{ msg }}</h1>
  </div>
</template>
