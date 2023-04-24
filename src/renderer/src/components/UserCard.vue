<template>
  <div class="card">
    <div class="flex w-full justify-end">
      <Tag v-if="user.isFriend" value="Friend" icon="pi pi-check" severity="success" rounded />
    </div>
    <div class="card-content">
      <Avatar
        :label="user.displayName?.[0] || user.email!"
        shape="circle"
        size="xlarge"
        class="avatar"
      />
      <span class="name">{{ user.displayName || user.email }}</span>
    </div>
    <div class="flex w-full justify-between">
      <Button
        :severity="user.requestSent || user.isFriend ? 'danger' : 'success'"
        :icon="`pi ${user.requestSent || user.isFriend ? 'pi-user-minus' : 'pi-user-plus'}`"
        @click="handleAddFriend"
      />
      <div>
        <Button icon="pi pi-comment" severity="help" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
interface User extends UserInfo {
  isFriend: boolean;
  requestSent: boolean;
}
interface UserCardProps {
  user: User;
}
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { UserInfo } from 'firebase/auth';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

import { randomColor } from '@renderer/utils';
import { useFriendsStore } from '@renderer/store';

const props = defineProps<UserCardProps>();

const friendsStore = useFriendsStore();

const avatarColor = computed(() => `--${randomColor()}-500`);

const handleAddFriend = () => {
  if (props.user.isFriend) friendsStore.unfriend(props.user.uid);
  else if (props.user.requestSent) friendsStore.cancelRequest(props.user.uid);
  else friendsStore.sendRequest(props.user.uid);
};
</script>

<style scoped lang="postcss">
.card {
  aspect-ratio: 2/3;
  background-color: var(--surface-card);
  border-radius: var(--border-radius);
  border-color: var(--surface-border);
  border-width: 1px;
  box-shadow: 1rem;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}
.card-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}
.avatar {
  font-size: 2rem;
  background-color: v-bind('`var(${avatarColor})`');
}
.name {
  margin-top: 0.5rem;
  font-size: 1.5rem;
  text-align: center;
}
</style>
