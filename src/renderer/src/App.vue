<template>
  <TitleBar />
  <div id="main">
    <FirstStartPage v-if="firstStart" />
    <template v-else-if="authStore.isUserLoaded">
      <MenuBar />
      <router-view />
    </template>
    <Toast class="!top-[90px]" @close="gamesStore.cancelLaunch" />
    <ConfirmPopup class="whitespace-pre-wrap" />
  </div>
</template>

<script lang="ts">
interface PrimeVue extends ReturnType<typeof usePrimeVue> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  changeTheme(currentTheme: string, newTheme: string, linkElementId: string, callback: Function);
}
</script>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { usePrimeVue } from 'primevue/config';
import Toast from 'primevue/toast';
import ConfirmPopup from 'primevue/confirmpopup';

import MenuBar from '@renderer/components/MenuBar.vue';
import TitleBar from './components/TitleBar.vue';
import FirstStartPage from './routes/FirstStartPage.vue';
import { useAuthStore } from './store';
import { useGamesStore } from '@renderer/store';

const gamesStore = useGamesStore();
const authStore = useAuthStore();
const firstStart = useLocalStorage('firstStart', true);
const theme = useLocalStorage('theme', 'dark');
const primeVue = usePrimeVue() as PrimeVue;

onMounted(() => changeTheme(theme.value));

watch(theme, (value) => changeTheme(value));

const changeTheme = (value: string) => {
  if (value === 'dark') primeVue.changeTheme('viva-light', 'viva-dark', 'theme-link', () => {});
  else if (value === 'light')
    primeVue.changeTheme('viva-dark', 'viva-light', 'theme-link', () => {});
};
</script>

<style>
body {
  background: radial-gradient(ellipse at top, var(--surface-card), var(--surface-ground));
}
</style>

<style scoped lang="postcss">
#main {
  overflow-y: overlay;
  overflow-x: hidden;
  flex: 1;
}
</style>
