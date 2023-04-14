<template>
  <Swiper
    v-if="props.games.length !== 0"
    class="overflow-visible"
    :slides-per-view="2"
    :space-between="32"
    :breakpoints="{
      860: { slidesPerView: 3 },
      1248: { slidesPerView: 4 },
      1536: { slidesPerView: 5 },
    }"
    :modules="[Scrollbar]"
    grab-cursor
  >
    <SwiperSlide v-for="game in props.games" :key="game.id">
      <GameCard :game="game" />
    </SwiperSlide>
  </Swiper>
  <div v-else class="flex h-44 w-full items-center justify-center text-4xl text-secondary-11">
    <slot name="fallback">No games</slot>
  </div>
</template>

<script lang="ts">
interface SliderProps {
  games: Game[];
}
</script>

<script setup lang="ts">
import { Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';

import GameCard from '@renderer/components/GameCard.vue';
import { Game } from '@shared/types';
const props = defineProps<SliderProps>();
</script>

<style scoped></style>
