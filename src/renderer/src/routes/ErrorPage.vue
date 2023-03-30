<template>
  <div class="flex h-full flex-col items-center justify-center text-xl">
    <div class="mb-4 text-4xl">😥</div>
    <div>Uh Oh!</div>
    <div>Something unexpected happened!</div>
    <Button color="error" outline class="mt-8" @click="router.back">Go back</Button>
  </div>
</template>

<script setup lang="ts">
import Button from '@renderer/components/Button.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<style lang=""></style>
