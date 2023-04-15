<template>
  <Swiper
    v-if="props.games.length !== 0"
    class="h-48 overflow-visible"
    :slides-per-view="2"
    :space-between="32"
    :breakpoints="{
      860: { slidesPerView: 3 },
      1248: { slidesPerView: 4 },
      1536: { slidesPerView: 5 },
    }"
    :modules="[Scrollbar]"
    :scrollbar="{ draggable: true }"
    grab-cursor
  >
    <SwiperSlide v-for="game in props.games" :key="game.id" class="h-44">
      <GameCard :game="game" />
    </SwiperSlide>
  </Swiper>
  <div v-else>
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

<style scoped lang="postcss"></style>
