<template>
  <div v-if="gamesStore.games.length !== 0">
    <Hero :game="heroGame" />
    <section class="h-64 px-8 pb-4">
      <div class="flex items-center gap-4">
        <h2 class="my-4 text-2xl font-bold">RECENTLY PLAYED</h2>
        <hr class="flex-1 border-t-2 border-neutral-6" />
      </div>
      <GameSlider :games="recent">
        <template #fallback>No recent games</template>
      </GameSlider>
    </section>
    <section class="h-64 px-8 pb-4">
      <div class="flex items-center gap-4">
        <h2 class="my-4 text-2xl font-bold">FAVORITES</h2>
        <hr class="flex-1 border-t-2 border-neutral-6" />
      </div>
      <GameSlider :games="gamesStore.favoriteGames">
        <template #fallback>No favorite games</template>
      </GameSlider>
    </section>
  </div>
  <div v-else class="flex h-full w-full flex-col items-center justify-center gap-4">
    <h2 class="text-4xl">No games imported</h2>
    <Button color="info" outline @click="firstStart = true">Import</Button>
  </div>
  <div class="h-[2000px]"></div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import { firstStart, useGamesStore } from '@renderer/store';
import Hero from '@renderer/components/Hero.vue';
import Button from '@renderer/components/Button.vue';
import { getRandom } from '@renderer/utils';
import GameSlider from '@renderer/components/GameSlider.vue';

const gamesStore = useGamesStore();

const heroGame = ref(getRandom(gamesStore.games));

const recent = computed(() =>
  gamesStore.recentGames.filter((game) => game.id !== heroGame.value.id)
);
</script>

<style lang="postcss"></style>
