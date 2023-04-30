<template>
  <Dialog
    :min-y="24"
    modal
    :breakpoints="{ '1536px': '60%', '1024px': '80%', '860px': '100%' }"
    class="h-[80vh] w-1/2 overflow-hidden"
    content-class="min-h-[24rem]"
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
        <template v-for="(message, index) of sortedMessages" :key="message.id">
          <div
            v-if="
              !sortedMessages[index + 1] ||
              sortedMessages[index + 1].sender !== sortedMessages[index].sender
            "
            class="message first"
          >
            <Avatar :label="getName(message.sender)?.[0]" shape="circle" class="avatar" />
            <div class="message-header">
              <span :class="['font-bold', isSelf(message.sender) ? 'self' : 'other']">
                {{ getName(message.sender) }}
              </span>
              <span class="date">{{ formatDate(message.createdAt) }}</span>
            </div>
            <div>{{ message.text }}</div>
          </div>
          <div v-else class="message">{{ message.text }}</div>
        </template>
      </div>
      <div>
        <Input
          :value="enteredMessage"
          icon-right="pi pi-send cursor-pointer"
          placeholder="Send a message..."
          :class="{ 'p-invalid': invalid }"
          area
          @input="handleInput"
          @click-right="handleSendMessage"
          @keydown.enter="handleSendMessage"
        />
        <small v-if="invalid" class="p-error">Max length is 255 characters.</small>
      </div>
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
const invalid = ref(false);

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

const handleInput = (event: Event) => {
  enteredMessage.value = (event.target as HTMLInputElement).value;
  invalid.value = enteredMessage.value.length > 255;
};
const handleSendMessage = (event: KeyboardEvent) => {
  if (event) {
    event.preventDefault();
    if (event.code !== 'Enter') return;
    if (event.shiftKey) {
      enteredMessage.value += '\n';
      return;
    }
  }
  if (invalid.value) return;
  if (!enteredMessage.value) return;
  chatStore.sendMessage(props.user.uid, enteredMessage.value.trim());
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
  width: 100%;
  flex-grow: 1;
  padding-inline: 0.5rem;
  display: flex;
  flex-direction: column-reverse;
  gap: 0.5rem;
}
.message {
  padding-left: 2.5rem;
  word-break: break-all;
  white-space: pre-wrap;
  .self {
    color: var(--primary-color);
  }
  .other {
    color: var(--red-400);
  }
  &:hover {
    background-color: var(--surface-50);
  }
}
.first {
  position: relative;
}
.avatar {
  position: absolute;
  left: 0;
  margin: 0.5rem;
  margin-left: 0;
  /* background-color: v-bind('`var(${avatarColor})`'); */
}
.message-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.date {
  font-size: 0.75rem;
  color: var(--surface-400);
}
</style>
