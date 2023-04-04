<template>
  <div>
    <div
      class="h-96 w-full bg-center"
      :style="`background-image: url(appdata://${game.hero})`"
    ></div>
  </div>
</template>

<script lang="ts">
interface HeroProps {
  game: Game;
}
</script>

<script lang="ts" setup>
import { Game } from '@shared/types';

const props = defineProps<HeroProps>();
</script>
