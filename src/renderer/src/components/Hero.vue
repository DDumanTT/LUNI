<template>
  <div
    class="relative flex h-[50vh] w-full items-end bg-cover bg-center"
    :style="`background-image: url(appdata://${game.hero})`"
  >
    <img
      :src="`appdata://${game.logo}`"
      alt="Game logo"
      class="absolute left-1/4 h-full w-1/2 object-scale-down object-center"
      draggable="false"
    />
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
import Button from './Button.vue';
import DropdownMenu from './DropdownMenu.vue';

const props = defineProps<HeroProps>();

const handlePlay = () => {
  console.log(props.game);
};
</script>
