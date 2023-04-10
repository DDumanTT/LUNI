<template>
  <div v-if="gamesStore.games.length !== 0">
    <Hero :game="heroGame" />
    <section class="px-8 pb-4">
      <div class="flex items-center gap-4">
        <h2 class="my-4 text-2xl font-bold">RECENT GAMES</h2>
        <hr class="flex-1 border-t-2 border-neutral-6" />
      </div>
      <Swiper
        class="overflow-visible"
        :slides-per-view="2"
        :space-between="32"
        :breakpoints="{
          860: { slidesPerView: 3 },
          1248: { slidesPerView: 4 },
          1536: { slidesPerView: 5 },
        }"
        :modules="[Scrollbar]"
      >
        <template v-if="recent.length !== 0">
          <SwiperSlide v-for="game in recent" :key="game.id">
            <GameCard :game="game" />
          </SwiperSlide>
        </template>
        <div v-else>No recent games</div>
      </Swiper>
    </section>
    <section class="px-8">
      <div class="flex items-center gap-4">
        <h2 class="my-4 text-2xl font-bold">FAVORITES</h2>
        <hr class="flex-1 border-t-2 border-neutral-6" />
      </div>
      <Swiper
        class="overflow-visible"
        :slides-per-view="2"
        :space-between="32"
        :breakpoints="{
          860: { slidesPerView: 3 },
          1248: { slidesPerView: 4 },
          1536: { slidesPerView: 5 },
        }"
        :modules="[Scrollbar]"
      >
        <template v-if="gamesStore.favoriteGames.length !== 0">
          <SwiperSlide v-for="game in gamesStore.favoriteGames" :key="game.id">
            <GameCard :game="game" />
          </SwiperSlide>
        </template>
        <div v-else>No favorite games</div>
      </Swiper>
    </section>
  </div>
  <div v-else class="flex h-full w-full flex-col items-center justify-center gap-4">
    <h2 class="text-4xl">No games imported</h2>
    <Button color="info" outline @click="firstStart = true">Import</Button>
  </div>
  <Button @click="handlePrev">prev</Button>
  <Button @click="handleNext">next</Button>
  <div class="h-[2000px]"></div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';

import { firstStart, useGamesStore } from '@renderer/store';
import Hero from '@renderer/components/Hero.vue';
import Button from '@renderer/components/Button.vue';
import GameCard from '@renderer/components/GameCard.vue';
import { getRandom } from '@renderer/utils';

const gamesStore = useGamesStore();

const heroGame = ref(getRandom(gamesStore.games));
const gameIndex = ref(0);

const recent = computed(() =>
  gamesStore.recentGames.filter((game) => game.id !== heroGame.value.id)
);

const handleNext = () => {
  gameIndex.value += 1;
  console.log(gamesStore.games[gameIndex.value]);
};
const handlePrev = () => {
  gameIndex.value -= 1;
  console.log(gamesStore.games[gameIndex.value]);
};
</script>

<style lang="postcss"></style>
