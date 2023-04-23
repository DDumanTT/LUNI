<template>
  <div v-for="user of chatStore.users" :key="user.uid">
    {{ user.displayName }}
    <Button label="sendmsg" @click="chatStore.sendMessage(user.uid, 'test')" />
  </div>
  <h2>chats:</h2>
  <div v-for="chat of chatStore.chats" :key="chat.id">{{ chat.id }}</div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';

import { useChatStore } from '@renderer/store';

const chatStore = useChatStore();
</script>

<style lang=""></style>
