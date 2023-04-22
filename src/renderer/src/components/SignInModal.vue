<template>
  <Dialog :min-y="24" modal style="min-width: 32rem" dismissable-mask append-to="#main">
    <template #header>
      <div class="p-dialog-header-icons h-8 w-8">
        <Button
          v-if="register"
          class="p-dialog-header-icon p-dialog-header-close p-link"
          @click="register = false"
        >
          <span class="p-dialog-header-close-icon pi pi-arrow-left"></span>
        </Button>
      </div>
      <div class="title-wrapper">
        <h2 class="title">LUNI</h2>
      </div>
    </template>
    <RegisterForm v-if="register" @success="emit('close')" />
    <SignInForm v-else @click-register="register = true" @success="emit('close')" />
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

import SignInForm from './SignInForm.vue';
import RegisterForm from './RegisterForm.vue';

const emit = defineEmits(['close']);

const register = ref(false);
</script>

<style scoped lang="postcss">
.title-wrapper {
  width: 100%;
}
.title {
  width: min-content;
  text-align: center;
  margin-inline: auto;
  background-image: linear-gradient(to right, var(--indigo-500), var(--red-500));
  background-clip: text;
  font-family: PressStart2P, sans-serif;
  font-size: 2rem;
  line-height: 1;
  color: transparent;
}
</style>
