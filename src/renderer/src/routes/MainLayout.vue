<template>
  <MenuBar />
  <router-view />
  <ContextMenu ref="contextMenu" :model="store.items" />
  <Menu ref="menu" :model="store.items" :popup="true" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import MenuBar from '@renderer/components/MenuBar.vue';
import { useMenuStore } from '@renderer/store';
import ContextMenu from 'primevue/contextmenu';
import Menu from 'primevue/menu';

const store = useMenuStore();

const contextMenu = ref();
const menu = ref();

onMounted(() => {
  store.setContextMenu(contextMenu.value);
  store.setMenu(menu.value);
});
</script>

<style lang=""></style>
