<template>
  <Dialog
    :min-y="24"
    modal
    content-class="min-h-[24rem] h-0"
    style="min-width: 32rem"
    dismissable-mask
    append-to="#main"
  >
    <template #header>
      <div class="header">
        <Avatar :label="props.user.displayName?.[0] || props.user.email!" shape="circle" />
        <span>{{ props.user.displayName || props.user.email! }}</span>
      </div>
    </template>
    <div class="messages-wrapper">
      <div class="messages">
        <div
          v-for="message of sortedMessages"
          :key="message.id"
          :class="{ 'text-right': isSelf(message.sender) }"
        >
          <div>{{ getName(message.sender) }} - {{ formatDate(message.createdAt) }}</div>
          <div>{{ message.text }}</div>
        </div>
      </div>
      <Input
        :value="enteredMessage"
        icon-right="pi pi-send cursor-pointer"
        placeholder="Send a message..."
        @input="($event) => (enteredMessage = ($event.target as HTMLInputElement).value)"
        @click-right="handleSendMessage"
        @keydown.enter="handleSendMessage"
      />
    </div>
  </Dialog>
</template>

<script lang="ts">
interface ChatModalProps {
  user: UserInfo;
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { UserInfo } from 'firebase/auth';
import Dialog from 'primevue/dialog';
import Avatar from 'primevue/avatar';
import { useCollection } from 'vuefire';

import { useChatStore, useAuthStore } from '@renderer/store';
import { Message } from '@shared/types';
import Input from './Input.vue';

const props = defineProps<ChatModalProps>();

const chatStore = useChatStore();
const authStore = useAuthStore();
const messages = useCollection<Message>(chatStore.getMessagesCollection(props.user.uid));

const enteredMessage = ref('');

const sortedMessages = computed(() =>
  [...messages.value].sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
);

const formatDate = (timestamp: Message['createdAt']) =>
  new Date(timestamp.seconds * 1000).toISOString().replace(/T/, ' ').replace(/\..+/, '');
const isSelf = (uid: string) => uid === authStore.user?.uid;
const getName = (uid: string) => {
  if (uid === authStore.user?.uid) return authStore.user?.displayName || authStore.user?.email;
  return props.user.displayName || props.user.email;
};

const handleSendMessage = () => {
  if (!enteredMessage.value) return;
  chatStore.sendMessage(props.user.uid, enteredMessage.value);
  enteredMessage.value = '';
};
</script>

<style scoped lang="postcss">
.header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.messages-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.messages {
  overflow-y: auto;
  flex-grow: 1;
  padding-inline: 0.5rem;
  display: flex;
  flex-direction: column-reverse;
  gap: 0.5rem;
}
</style>
