<template>
  <nav class="nav-wrapper">
    <div class="search">
      <Input
        :value="search"
        wrapper-class="w-64"
        icon-left="pi pi-search cursor-pointer"
        icon-right="pi pi-times cursor-pointer"
        @input="($event) => (search = ($event.target as HTMLInputElement).value)"
        @click-right="search = ''"
        @click-left="handleSearch"
        @keydown.enter="handleSearch"
      />
    </div>
    <div class="nav-tabs">
      <TabMenu :model="items" />
    </div>
    <div class="users">user</div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabMenu from 'primevue/tabmenu';
import { MenuItem } from 'primevue/menuitem';
import Input from './Input.vue';

const search = ref('');

const items = ref<MenuItem[]>([
  {
    label: 'Home',
    icon: 'pi pi-fw pi-home',
    to: '/home',
  },
  {
    label: 'Games',
    icon: 'pi pi-fw pi-home',
    to: '/games',
  },
  {
    label: 'Friends',
    icon: 'pi pi-fw pi-home',
    to: '/friends',
  },
]);

const handleSearch = () => {
  console.log(search.value);
};
</script>

<style scoped lang="postcss">
.nav-wrapper {
  --font-size: 1.125rem;
  position: sticky;
  top: 0px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid black;
  background: rgb(0 0 0 / 0.6);
  backdrop-filter: blur(10px);
  font-size: var(--font-size);
}
.search {
  flex: 1;
}
.nav-tabs {
  height: 100%;
}
.users {
  display: flex;
  flex: 1;
  justify-content: flex-end;
}
:deep(.p-tabmenu) {
  font-size: var(--font-size);
}
:deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link) {
  background: transparent;
}
</style>
