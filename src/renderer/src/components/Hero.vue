<template>
  <div
    :class="[
      'relative flex h-[50vh] w-full items-end bg-cover bg-center',
      { 'bg-secondary-3': !!game.hero },
    ]"
    :style="game.hero ? `background-image: url(appdata://${game.hero})` : ''"
  >
    <img
      v-if="game.logo"
      :src="`appdata://${game.logo}`"
      alt="Game logo"
      class="absolute left-1/4 h-full w-1/2 object-scale-down object-center"
      draggable="false"
    />
    <span
      v-else
      class="absolute left-1/4 top-1/2 h-full w-1/2 object-scale-down object-center text-center font-pressstart2p text-4xl text-neutral-12"
      data-atropos-offset="5"
      >{{ game.name }}</span
    >
    <div class="z-10 h-fit text-4xl font-medium">
      <Button
        class="mb-8 ml-8 mr-0.5 rounded-r-none !px-20"
        color="success"
        important
        @click="handlePlay"
      >
        PLAY
      </Button>
      <DropdownMenu v-slot="apiProps" class="inline">
        <Button v-bind="apiProps" class="rounded-l-none px-0" color="success" important>▾</Button>
      </DropdownMenu>
    </div>
  </div>
</template>

<script lang="ts">
interface HeroProps {
  game: Game;
}
</script>

<script lang="ts" setup>
import { Game } from '@shared/types';
import { useGamesStore } from '@renderer/store';
import Button from './Button.vue';
import DropdownMenu from './DropdownMenu.vue';

const props = defineProps<HeroProps>();

const gamesStore = useGamesStore();

const handlePlay = () => {
  gamesStore.addRecent(props.game.id);
  console.log(props.game);
};
</script>
