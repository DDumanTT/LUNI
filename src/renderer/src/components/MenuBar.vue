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
          <SignInModal v-model:visible="signInVisible" @close="signInVisible = false" />
          <!-- <Dialog v-model:visible="editProfileVisible" header="Edit profile">
            <ProfileEditForm />
          </Dialog> -->
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
      <Button class="mr-1" icon="pi pi-cog" plain text rounded />
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
    <AlertsModal v-model:visible="alertsVisible" />
  </nav>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import TabMenu from 'primevue/tabmenu';
import { MenuItem } from 'primevue/menuitem';
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';
import Badge from 'primevue/badge';

import SignInModal from './SignInModal.vue';
import { useAuthStore, useFriendsStore } from '@renderer/store';
import { randomColor } from '@renderer/utils';
import Menu from 'primevue/menu';
import AlertsModal from './AlertsModal.vue';

const authStore = useAuthStore();
const friendsStore = useFriendsStore();

const menu = ref();
const signInVisible = ref(false);
const editProfileVisible = ref(false);
const alertsVisible = ref(false);
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
    command: () => {},
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
.avatar {
  background-color: v-bind('`var(${avatarColor})`');
  cursor: pointer;
  :deep(.p-badge) {
    display: v-bind('!friendsStore.receivedRequests.length ? "none" : "inline-block"');
  }
}
</style>
