<template>
  <DataView :value="filteredFriends" layout="grid" data-key="all-friends">
    <template #header>
      <div class="header">
        <h2 class="title">Friends</h2>
        <div class="p-input-filled w-1/3">
          <Input
            :value="friendSearch"
            class="!rounded-full"
            icon-left="pi pi-search cursor-pointer"
            icon-right="pi pi-times cursor-pointer"
            placeholder="Search friends..."
            @input="($event) => (friendSearch = ($event.target as HTMLInputElement).value)"
            @click-right="friendSearch = ''"
          />
        </div>
      </div>
    </template>
    <template #grid="slotProps">
      <UserCard :user="slotProps.data" :is-friend="true" />
    </template>
    <template #empty>
      <h3 class="text-xl">No friends found</h3>
    </template>
  </DataView>
  <DataView :value="filteredUsers" layout="grid" data-key="all-users">
    <template #header>
      <div class="header">
        <h2 class="title">Users</h2>
        <div class="p-input-filled w-1/3">
          <Input
            :value="userSearch"
            class="!rounded-full"
            icon-left="pi pi-search cursor-pointer"
            icon-right="pi pi-times cursor-pointer"
            placeholder="Search users..."
            @input="($event) => (userSearch = ($event.target as HTMLInputElement).value)"
            @click-right="userSearch = ''"
          />
        </div>
      </div>
    </template>
    <template #grid="slotProps">
      <UserCard :user="slotProps.data" />
    </template>
    <template #empty>
      <h3 class="text-xl">No users found</h3>
    </template>
  </DataView>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Button from 'primevue/button';
import DataView from 'primevue/dataview';

import { useAuthStore, useChatStore, useFriendsStore } from '@renderer/store';
import UserCard from '@renderer/components/UserCard.vue';
import Input from '@renderer/components/Input.vue';

const chatStore = useChatStore();
const friendsStore = useFriendsStore();
const authStore = useAuthStore();

const userSearch = ref('');
const friendSearch = ref('');

const filteredUsers = computed(() =>
  friendsStore.users.filter(
    (user) =>
      userSearch.value === '' ||
      user.displayName?.toLowerCase().includes(userSearch.value.toLowerCase()) ||
      user.email!.toLowerCase().includes(userSearch.value.toLowerCase())
  )
);
const filteredFriends = computed(() =>
  friendsStore.friends.filter(
    (friend) =>
      friendSearch.value === '' ||
      friend.displayName?.toLowerCase().includes(friendSearch.value.toLowerCase()) ||
      friend.email!.toLowerCase().includes(friendSearch.value.toLowerCase())
  )
);
</script>

<style lang="postcss" scoped>
:deep(.p-grid) {
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 3rem;
  border-bottom: 2px solid var(--surface-border);
}
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.title {
  font-size: 2rem;
  position: absolute;
  left: 0;
}
</style>
