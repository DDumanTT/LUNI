<template>
  <ContextMenu>
    <Atropos inner-class="rounded-3xl" :active-offset="100" @click="handleClickGame(game)">
      <div class="relative flex h-[16vh] select-none items-center justify-center">
        <img
          v-if="game.hero"
          class="h-full w-full object-cover"
          :src="`appdata://${game.hero}`"
          data-atropos-offset="-1"
        />
        <div v-else class="h-full w-full bg-secondary-3" data-atropos-offset="-1" />
        <img
          v-if="game.logo"
          class="absolute w-2/3 object-scale-down"
          :src="`appdata://${game.logo}`"
          data-atropos-offset="5"
        />
        <span
          v-else
          class="absolute w-10/12 text-center font-pressstart2p text-2xl text-neutral-12"
          data-atropos-offset="5"
          >{{ game.name }}</span
        >
      </div>
    </Atropos>
  </ContextMenu>
</template>

<script lang="ts">
interface GameCardProps {
  game: Game;
}
</script>

<script setup lang="ts">
import Atropos from 'atropos/vue';

import { useGamesStore } from '@renderer/store';
import { Game } from '@shared/types';

const props = defineProps<GameCardProps>();
const emit = defineEmits(['click']);

const gamesStore = useGamesStore();

const handleClickGame = (game: Game) => {
  emit('click');
  console.log(game);
  gamesStore.addRecent(game.id);
};
</script>

<style lang="scss" scoped></style>
