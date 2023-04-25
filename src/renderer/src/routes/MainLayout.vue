<template>
  <MenuBar />
  <router-view />
  <Toast class="!top-[90px]" @close="gamesStore.cancelLaunch" />
</template>

<script setup lang="ts">
import MenuBar from '@renderer/components/MenuBar.vue';
import { useGamesStore } from '@renderer/store';
import Toast from 'primevue/toast';

const gamesStore = useGamesStore();
</script>

<style lang="postcss" scoped></style>
