<template>
  <div>
    <Hero :game="games[gameIndex]" />
    <div class="px-8">
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
        <SwiperSlide v-for="game in games" :key="game.id" class="" @click="handleClickGame(game)">
          <Atropos inner-class="rounded-3xl" :active-offset="100">
            <div class="relative flex h-[16vh] select-none items-center justify-center">
              <img
                class="h-full w-full object-cover"
                :src="`appdata://${game.hero}`"
                data-atropos-offset="-1"
              />
              <img
                class="absolute w-2/3 object-scale-down"
                :src="`appdata://${game.logo}`"
                data-atropos-offset="5"
              />
            </div>
          </Atropos>
        </SwiperSlide>
      </Swiper>
      <Button @click="handlePrev">prev</Button>
      <Button @click="handleNext">next</Button>
      <div class="h-[2000px]"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';
import Atropos from 'atropos/vue';

import { games } from '@renderer/store';
import Hero from '@renderer/components/Hero.vue';
import Button from '@renderer/components/Button.vue';

const gameIndex = ref(0);
const handleNext = () => {
  gameIndex.value += 1;
  console.log(games[gameIndex.value]);
};
const handlePrev = () => {
  gameIndex.value -= 1;
  console.log(games[gameIndex.value]);
};

const handleClickGame = (game: Game) => {
  console.log(game);
};
</script>

<style lang="postcss"></style>
