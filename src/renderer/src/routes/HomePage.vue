<template>
  <div>
    <Hero :game="games[1]" />
  </div>
</template>

<script setup lang="ts">
import { games } from '@renderer/store';
import Hero from '@renderer/components/Hero.vue';
</script>

<style lang=""></style>
