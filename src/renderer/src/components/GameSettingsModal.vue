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
      <div class="footer">
        <Button
          severity="danger"
          label="Remove game"
          icon="pi pi-times"
          class="ml-auto"
          @click="handleConfirm"
        />
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts">
interface GameSettingsProps {
  game: Game;
}
</script>

<script setup lang="ts">
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { useConfirm } from 'primevue/useconfirm';
import { useGamesStore } from '@renderer/store';
import { Game } from '@shared/types';

const props = defineProps<GameSettingsProps>();
const emit = defineEmits(['close']);

const confirm = useConfirm();
const gamesStore = useGamesStore();

const handleConfirm = (event: Event) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Are you sure you want to remove this game?',
    accept: () => {
      gamesStore.removeGame(props.game.id);
      emit('close');
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
