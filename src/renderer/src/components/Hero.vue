<template>
  <div class="hero-wrapper">
    <div class="logo-wrapper">
      <img
        v-if="game.logo"
        :src="`appdata://${game.logo}`"
        alt="Game logo"
        class="logo"
        draggable="false"
      />
      <span v-else class="fallback">
        {{ game.name }}
      </span>
    </div>
    <div class="play-btn-wrapper">
      <Button
        class="play-btn"
        label="PLAY"
        icon="pi pi-play"
        severity="info"
        raised
        rounded
        @click="handlePlay"
      />
      <GameMenu v-slot="menuProps" :game="props.game">
        <Button
          v-bind="menuProps"
          type="button"
          class="dropdown-btn"
          label="▾"
          severity="info"
          raised
          rounded
        />
      </GameMenu>
    </div>
  </div>
</template>

<script lang="ts">
interface HeroProps {
  game: Game;
}
</script>

<script lang="ts" setup>
import { computed } from 'vue';
import Button from 'primevue/button';

import { Game } from '@shared/types';
import { useGamesStore } from '@renderer/store';
import { randomColor } from '../utils';
import GameMenu from './GameMenu.vue';

const props = defineProps<HeroProps>();

const gamesStore = useGamesStore();

const heroImage = computed(() => {
  if (props.game.hero) return `url(appdata://${props.game.hero})`;
  const color = randomColor();
  return `radial-gradient(var(--${color}-500), var(--${color}-900))`;
});

const handlePlay = () => {
  gamesStore.launchGame(props.game);
};
</script>

<style lang="postcss" scoped>
.hero-wrapper {
  position: relative;
  display: flex;
  align-items: flex-end;
  height: 32rem;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-image: v-bind(heroImage);
}
.logo-wrapper {
  height: 100%;
  width: 50%;
  margin-inline: auto;
}
.logo {
  width: 100%;
  height: 100%;
  object-fit: scale-down;
  object-position: center;
}
.fallback {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-family: PressStart2P, sans-serif;
  font-size: 3rem;
  color: var(--text-color);
  text-shadow: black 0px 0px 20px;
}
.play-btn-wrapper {
  position: absolute;
  left: 2rem;
  bottom: 2rem;
  font-size: 2rem !important;
}
.play-btn {
  padding-inline: 6rem;
  font-size: inherit;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.dropdown-btn {
  margin-left: 0.25rem;
  font-size: inherit;
  padding-inline: 0.25rem;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
:deep(.p-button-icon) {
  font-size: inherit;
}
</style>
