<template>
  <Dialog
    :min-y="24"
    modal
    style="min-width: 32rem"
    dismissable-mask
    append-to="#main"
    header="Alerts"
  >
    <DataView :value="friendsStore.receivedRequests" data-key="received-requests">
      <template #header>
        <div class="header">
          <h3 class="text-xl">Friend requests</h3>
        </div>
      </template>
      <template #list="{ data }">
        <div class="user-item">
          <Avatar :label="data.displayName?.[0] || data.email" shape="circle" size="large" />
          <span class="user-name">{{ data.displayName || data.email }}</span>
          <div class="button-wrapper">
            <Button severity="danger" icon="pi pi-times" @click="handleDeny(data.uid)" />
            <Button severity="success" icon="pi pi-check" @click="handleAccept(data.uid)" />
          </div>
        </div>
      </template>
      <template #empty>
        <h3 class="empty">No friend requests</h3>
      </template>
    </DataView>
    <DataView :value="friendsStore.sentRequests" data-key="sent-requests">
      <template #header>
        <div class="header">
          <h3 class="text-xl">Pending friend requests</h3>
        </div>
      </template>
      <template #list="{ data }">
        <div class="user-item">
          <Avatar :label="data.displayName?.[0] || data.email" shape="circle" size="large" />
          <span class="user-name">{{ data.displayName || data.email }}</span>
          <div class="button-wrapper">
            <Button severity="danger" icon="pi pi-times" @click="handleCancel(data.uid)" />
          </div>
        </div>
      </template>
      <template #empty>
        <h3 class="empty">No pending friend requests</h3>
      </template>
    </DataView>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DataView from 'primevue/dataview';
import Dialog from 'primevue/dialog';
import Avatar from 'primevue/avatar';

import { useFriendsStore } from '@renderer/store';
import { randomColor } from '@renderer/utils';
import Button from 'primevue/button';

const friendsStore = useFriendsStore();

const avatarColor = computed(() => `--${randomColor()}-500`);

const handleAccept = (uid: string) => friendsStore.acceptRequest(uid);
const handleDeny = (uid: string) => friendsStore.denyRequest(uid);
const handleCancel = (uid: string) => friendsStore.cancelRequest(uid);
</script>

<style scoped lang="postcss">
.user-item {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  gap: 0.5rem;
  padding: 1rem;
}
.avatar {
  font-size: 2rem;
  background-color: v-bind('`var(${avatarColor})`');
}
.button-wrapper {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
}
.header {
  display: flex;
  align-items: center;
}
.empty {
  font-size: 1rem;
  padding: 1rem;
}
</style>
