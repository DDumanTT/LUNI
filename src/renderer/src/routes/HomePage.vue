<template>
  <div v-if="gamesStore.games.length !== 0">
    <Hero :game="gamesStore.games[heroGameIndex]" />
    <Panel header="RECENTLY PLAYED" class="game-section" toggleable>
      <GameSlider :games="recent">
        <template #fallback>No recent games</template>
      </GameSlider>
    </Panel>
    <Panel header="FAVORITES" class="game-section" toggleable>
      <GameSlider :games="gamesStore.favoriteGames">
        <template #fallback>No favorite games</template>
      </GameSlider>
    </Panel>
  </div>
  <div v-else class="fallback">
    <h2 class="text-4xl">No games imported</h2>
    <Button severity="info" label="Import" outlined @click="firstStart = true" />
  </div>
  <Button label="click" @click="handleTest" />
  <div class="h-[2000px]"></div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Panel from 'primevue/panel';
import Button from 'primevue/button';

import { firstStart, useFriendsStore, useGamesStore } from '@renderer/store';
import Hero from '@renderer/components/Hero.vue';
import { getRandomIndex } from '@renderer/utils';
import GameSlider from '@renderer/components/GameSlider.vue';

const gamesStore = useGamesStore();
const friendsStore = useFriendsStore();

const heroGameIndex = ref(getRandomIndex(gamesStore.games));

const recent = computed(() =>
  gamesStore.recentGames.filter((game) => game.id !== gamesStore.games[heroGameIndex.value].id)
);

const handleTest = () => {
  console.log(friendsStore.user?.displayName);
};
</script>

<style lang="postcss" scoped>
.game-section {
  margin-inline: 1rem;
  margin-top: 1rem;
  overflow: hidden;
}
:deep(.p-panel-title) {
  font-size: 1.5rem;
}
.fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  height: 100%;
  width: 100%;
}
</style>
