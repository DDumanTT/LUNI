<template>
  <template v-if="currentUser">
    <DataView :value="recommendedUsers" layout="grid" data-key="recommended-users">
      <template #header>
        <div class="header">
          <h2 class="title">Recommended users</h2>
          <div class="p-input-filled w-1/3">
            <Input
              :value="recommendedSearch"
              class="!rounded-full"
              icon-left="pi pi-search cursor-pointer"
              icon-right="pi pi-times cursor-pointer"
              placeholder="Search recommended users..."
              @input="($event) => (recommendedSearch = ($event.target as HTMLInputElement).value)"
              @click-right="recommendedSearch = ''"
            />
          </div>
        </div>
      </template>
      <template #grid="slotProps">
        <UserCard :user="slotProps.data" />
      </template>
      <template #empty>
        <h3 class="text-xl">No recommendations found</h3>
      </template>
    </DataView>
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
        <UserCard :user="slotProps.data" />
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
  <template v-else>
    <div class="not-logged-in">You have to be logged in to view socials</div>
  </template>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import DataView from 'primevue/dataview';
import { HttpsCallableResult } from 'firebase/functions';
import { UserInfo } from 'firebase/auth';
import { useCurrentUser } from 'vuefire';

import { useFriendsStore } from '@renderer/store';
import UserCard from '@renderer/components/UserCard.vue';
import Input from '@renderer/components/Input.vue';
import { getRecommendedUsers } from '@renderer/firebase/functions';

const friendsStore = useFriendsStore();
const currentUser = useCurrentUser();

const userSearch = ref('');
const friendSearch = ref('');
const recommendedSearch = ref('');
const recommendedUsers = ref<UserInfo[]>([]);

onMounted(() => {
  getRecommended();
});

watch(currentUser, (value) => {
  if (value) getRecommended();
});

const filteredUsers = computed(() =>
  friendsStore.users.filter(
    (user) =>
      userSearch.value === '' ||
      user.displayName?.toLowerCase().includes(userSearch.value.toLowerCase()) ||
      user.email!.toLowerCase().includes(userSearch.value.toLowerCase())
  )
);
const filteredFriends = computed(() =>
  friendsStore.friends
    .filter(
      (friend) =>
        friendSearch.value === '' ||
        friend.displayName?.toLowerCase().includes(friendSearch.value.toLowerCase()) ||
        friend.email!.toLowerCase().includes(friendSearch.value.toLowerCase())
    )
    .map((friend) => ({ ...friend, isFriend: true }))
);

const getRecommended = async () => {
  if (!currentUser.value) return;
  const res = (await getRecommendedUsers()) as HttpsCallableResult<UserInfo[]>;
  recommendedUsers.value = res.data.filter((user) => user.uid !== currentUser.value?.uid);
};
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
.not-logged-in {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
