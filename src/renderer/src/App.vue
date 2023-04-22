<template>
  <TitleBar />
  <div id="main">
    <FirstStartPage v-if="firstStart" />
    <router-view v-else-if="authStore.isUserLoaded" />
  </div>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';

import TitleBar from './components/TitleBar.vue';
import FirstStartPage from './routes/FirstStartPage.vue';
import { useAuthStore } from './store';

const authStore = useAuthStore();
const firstStart = useLocalStorage('firstStart', true);
</script>

<style scoped lang="postcss">
#main {
  overflow-y: overlay;
  overflow-x: hidden;
  flex: 1;
}
</style>
