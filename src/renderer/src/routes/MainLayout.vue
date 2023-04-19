<template>
  <MenuBar />
  <router-view />
  <Toast class="!top-[90px]" group="launch" @close="gamesStore.cancelLaunch" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import MenuBar from '@renderer/components/MenuBar.vue';
import { useMenuStore, useGamesStore } from '@renderer/store';
import Toast from 'primevue/toast';

const menuStore = useMenuStore();
const gamesStore = useGamesStore();

const contextMenu = ref();
const menu = ref();

onMounted(() => {
  menuStore.setContextMenu(contextMenu.value);
  menuStore.setMenu(menu.value);
});
</script>

<style lang="postcss" scoped></style>
