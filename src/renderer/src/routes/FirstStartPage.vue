<template>
  <div class="main-panel-wrapper">
    <div class="main-panel">
      <div class="glow" />
      <div class="content">
        <Splash v-if="step === 0" />
        <LauncherPathsForm v-if="step === 1" :paths="launcherPaths" @update="handleUpdatePath" />
        <GameSelection
          v-if="step === 2"
          :games="gamesList"
          :paths="launcherPaths"
          :selected="selectedGames"
          @update:games="handleUpdateGames"
          @update:selection="handleUpdateSelection"
        />
        <div class="buttons">
          <Button
            v-if="step <= 0"
            label="Skip"
            severity="danger"
            outlined
            @click="firstStart = false"
          />
          <Button v-else label="Back" important @click="step--" />
          <div class="flex-1">{{ step }}</div>
          <Button v-if="step >= 2" label="Finish" severity="success" @click="handleFinish" />
          <Button v-else label="Continue" @click="step++" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import Button from 'primevue/button';

import GameSelection from '@renderer/components/intro/GameSelection.vue';
import LauncherPathsForm from '@renderer/components/intro/LauncherPathsForm.vue';
import Splash from '@renderer/components/intro/Splash.vue';
import { useGamesStore, launcherPaths } from '@renderer/store';
import { Game } from '@shared/types';

const firstStart = useLocalStorage('firstStart', true);
const gamesStore = useGamesStore();

const step = ref(0);
const gamesList = ref<Game[]>([]);
const selectedGames = ref<Game[]>([]);

const handleUpdatePath = (key: string, value: string) => {
  launcherPaths.value[key] = value;
};

const handleUpdateGames = (games: Game[]) => {
  gamesList.value = games;
};

const handleUpdateSelection = (games: Game[]) => {
  selectedGames.value = games;
};

const handleFinish = async () => {
  gamesStore.games = selectedGames.value;
  firstStart.value = false;
};
</script>

<style lang="postcss" scoped>
.main-panel-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  font-size: 1.25rem;
}
.main-panel {
  position: relative;
  max-height: 80%;
  border-radius: var(--border-radius);
  border-width: 4px;
  border-color: var(--indigo-700);
  background-color: var(--indigo-900);
  padding-inline: 4rem;
  padding-block: 2.5rem;
}
.glow {
  position: absolute;
  top: -1rem;
  left: -1rem;
  height: calc(100% + 2rem);
  width: calc(100% + 2rem);
  border-radius: var(--border-radius);
  border-width: 1rem;
  border-color: var(--indigo-700);
  pointer-events: none;
  filter: blur(1rem);
}
.content {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.buttons {
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
</style>
