<template>
  <Dialog
    :min-y="24"
    modal
    style="min-width: 32rem"
    dismissable-mask
    append-to="#main"
    header="Settings"
  >
    <div class="wrapper">
      <div class="input">
        <label for="theme">Theme</label>
        <div class="switch">
          <i class="pi pi-sun" />
          <InputSwitch
            id="theme"
            v-model="theme"
            true-value="dark"
            false-value="light"
            class="!w-12"
          />
          <i class="pi pi-moon" />
        </div>
      </div>
      <div class="footer">
        <Button
          severity="danger"
          label="Reset library"
          icon="pi pi-ban"
          class="ml-auto"
          @click="handleConfirm"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputSwitch from 'primevue/inputswitch';
import { useConfirm } from 'primevue/useconfirm';
import { useGamesStore } from '@renderer/store';

const confirm = useConfirm();

const gamesStore = useGamesStore();

const theme = useLocalStorage('theme', 'dark');
const firstStart = useLocalStorage('firstStart', true);

const handleConfirm = (event: Event) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Are you sure you want to reset?\nThis will require you to import games again.',
    accept: () => {
      gamesStore.games = [];
      gamesStore.recentGamesIds = [];
      gamesStore.favGamesIds = [];
      firstStart.value = true;
    },
  });
};
</script>

<style scoped lang="postcss">
:deep(.input) {
  margin-bottom: 1rem;
  label {
    display: block;
    & + * {
      width: 100%;
    }
  }
  input {
    width: 100%;
  }
}
.toggle {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.footer {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
.switch {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
