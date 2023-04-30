<template>
  <GameMenu v-slot="menuProps" :game="props.game" context>
    <Atropos
      v-bind="menuProps"
      inner-class="rounded-3xl"
      :active-offset="100"
      @click="handleClickGame(game)"
    >
      <div class="card">
        <img
          v-if="game.hero"
          class="cover"
          :src="`appdata://${game.hero}`"
          data-atropos-offset="-1"
          draggable="false"
        />
        <div v-else class="cover fallback-cover" data-atropos-offset="-1" />
        <img
          v-if="game.logo"
          :src="`appdata://${game.logo}`"
          class="logo"
          data-atropos-offset="5"
          draggable="false"
        />
        <span v-else class="fallback-logo" data-atropos-offset="5">{{ game.name }}</span>
      </div>
    </Atropos>
  </GameMenu>
</template>

<script lang="ts">
interface GameCardProps {
  game: Game;
  aspectRatio?: string;
}
</script>

<script setup lang="ts">
import { computed } from 'vue';
import Atropos from 'atropos/vue';

import { useGamesStore } from '@renderer/store';
import { Game } from '@shared/types';
import { randomColor } from '../utils';
import GameMenu from './GameMenu.vue';

const props = withDefaults(defineProps<GameCardProps>(), { aspectRatio: '16/9' });

const gamesStore = useGamesStore();

const coverImageFallback = computed(() => {
  const color = randomColor();
  return `radial-gradient(var(--${color}-500), var(--${color}-900))`;
});

const handleClickGame = (game: Game) => {
  gamesStore.launchGame(game);
};
</script>

<style lang="postcss" scoped>
.card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  user-select: none;
  aspect-ratio: v-bind(aspectRatio);
}
.cover {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
.fallback-cover {
  background-image: v-bind(coverImageFallback);
}
.logo {
  position: absolute;
  width: 66%;
  object-fit: scale-down;
}
.fallback-logo {
  position: absolute;
  width: 83.333333%;
  text-align: center;
  font-family: PressStart2P, sans-serif;
  font-size: 1.5rem;
  color: var(--bluegray-100);
  text-shadow: black 0px 0px 20px;
}
</style>
