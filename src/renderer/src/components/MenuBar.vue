<template>
  <nav class="nav-wrapper">
    <div class="users">
      <span class="ml-1">
        <Button label="Sign In" rounded outlined />
      </span>
    </div>
    <div class="nav-tabs">
      <TabMenu :model="items" />
    </div>
    <div class="settings">
      <Button class="mr-1" icon="pi pi-cog" plain text rounded />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabMenu from 'primevue/tabmenu';
import { MenuItem } from 'primevue/menuitem';
import Button from 'primevue/button';

const items = ref<MenuItem[]>([
  {
    label: 'Home',
    icon: 'pi pi-fw pi-home',
    to: '/home',
  },
  {
    label: 'Games',
    icon: 'pi pi-fw pi-th-large',
    to: '/games',
  },
  {
    label: 'Social',
    icon: 'pi pi-fw pi-users',
    to: '/friends',
  },
]);
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
.settings {
  display: flex;
  flex: 1;
  justify-content: flex-end;
}
.nav-tabs {
  height: 100%;
}
.users {
  flex: 1;
}
:deep(.p-tabmenu) {
  font-size: var(--font-size);
}
:deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link) {
  background: transparent;
}
</style>
