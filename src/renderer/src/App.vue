<template>
  <TitleBar />
  <div class="overflow-y-overlay flex-1 overflow-x-hidden">
    <FirstStartPage v-if="firstStart" />
    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';

import TitleBar from './components/TitleBar.vue';
import FirstStartPage from './routes/FirstStartPage.vue';

const firstStart = useLocalStorage('firstStart', true);
</script>

<style></style>
