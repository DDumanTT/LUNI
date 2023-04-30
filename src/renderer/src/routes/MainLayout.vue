<template>
  <MenuBar />
  <router-view />
  <Toast class="!top-[90px]" @close="gamesStore.cancelLaunch" />
  <ConfirmPopup />
</template>

<script setup lang="ts">
import Toast from 'primevue/toast';
import ConfirmPopup from 'primevue/confirmpopup';

import MenuBar from '@renderer/components/MenuBar.vue';
import { useGamesStore } from '@renderer/store';

const gamesStore = useGamesStore();
</script>

<style lang="postcss" scoped></style>
