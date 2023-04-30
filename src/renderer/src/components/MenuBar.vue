<template>
  <nav class="nav-wrapper">
    <div class="users">
      <span class="ml-1">
        <template v-if="!authStore.user">
          <Button
            label="Sign In"
            icon="pi pi-sign-in"
            rounded
            outlined
            @click="signInVisible = true"
          />
        </template>
        <template v-else>
          <Avatar
            v-badge.success="friendsStore.receivedRequests.length"
            :label="authStore.user.displayName?.[0] || authStore.user.email!"
            shape="circle"
            class="avatar"
            @click="toggleMenu"
          />
          {{ authStore.user.displayName }}
        </template>
      </span>
    </div>
    <div class="nav-tabs">
      <TabMenu :model="items" />
    </div>
    <div class="settings">
      <Button class="mr-1" icon="pi pi-cog" plain text rounded @click="settingsVisible = true" />
    </div>
    <Menu ref="menu" :model="menuItems" :popup="true">
      <template #item="slotProps">
        <a class="p-menuitem-link !h-10" tabindex="-1">
          <span :class="['p-menuitem-icon', slotProps.item.icon]" />
          <span class="p-menuitem-text">{{ slotProps.item.label }}</span>
          <Badge
            v-if="slotProps.item.badge"
            :value="slotProps.item.badge"
            severity="success"
            class="ml-auto"
          />
        </a>
      </template>
    </Menu>
    <SignInModal v-model:visible="signInVisible" @close="signInVisible = false" />
    <ProfileEditModal v-model:visible="editProfileVisible" @close="editProfileVisible = false" />
    <AlertsModal v-model:visible="alertsVisible" />
    <SettingsModal v-model:visible="settingsVisible" />
  </nav>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import TabMenu from 'primevue/tabmenu';
import { MenuItem } from 'primevue/menuitem';
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';
import Badge from 'primevue/badge';
import Menu from 'primevue/menu';

import SignInModal from './SignInModal.vue';
import ProfileEditModal from './ProfileEditModal.vue';
import SettingsModal from './SettingsModal.vue';
import AlertsModal from './AlertsModal.vue';
import { useAuthStore, useFriendsStore } from '@renderer/store';
import { randomColor } from '@renderer/utils';

const authStore = useAuthStore();
const friendsStore = useFriendsStore();
const theme = useLocalStorage('theme', 'dark');

const menu = ref();
const signInVisible = ref(false);
const editProfileVisible = ref(false);
const alertsVisible = ref(false);
const settingsVisible = ref(false);
const items = computed<MenuItem[]>(() => [
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

const avatarColor = computed(() => `--${randomColor()}-500`);

const menuItems = computed(() => [
  {
    label: 'Alerts',
    icon: 'pi pi-bell',
    command: () => (alertsVisible.value = true),
    badge: friendsStore.receivedRequests.length,
  },
  {
    label: 'Edit profile',
    icon: 'pi pi-user-edit',
    command: () => (editProfileVisible.value = true),
  },
  { separator: true },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: authStore.signOut,
  },
]);

const toggleMenu = (event) => menu.value.toggle(event);
</script>

<style scoped lang="postcss">
.nav-wrapper {
  color: var(--surface-700);
  --font-size: 1.125rem;
  position: sticky;
  top: 0px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid black;
  background: v-bind('theme === "dark" ? "rgb(0 0 0 / 0.6)" : "rgb(255 255 255 / 0.6)"');
  backdrop-filter: blur(10px);
  font-size: var(--font-size);
}
.settings {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  :deep(.pi-button-icon) {
    color: var(--surface-700);
  }
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
:deep(.p-tabmenu-nav) {
  background: transparent;
}
:deep(.p-menuitem-link) {
  background: transparent !important;
}
.avatar {
  background-color: v-bind('`var(${avatarColor})`');
  cursor: pointer;
  :deep(.p-badge) {
    display: v-bind('!friendsStore.receivedRequests.length ? "none" : "inline-block"');
  }
}
</style>
