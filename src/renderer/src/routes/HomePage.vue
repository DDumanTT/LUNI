<template>
  <div>
    <button class="border border-black" @click="firstStart = true">FIRST START TRUE</button>
    <div>appdsasad fargewgraew</div>
    <div>
      <router-link to="test">link</router-link>
    </div>
    <div className="h-[2000px]">tall</div>
  </div>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';

const firstStart = useLocalStorage('firstStart', true);
</script>

<style lang=""></style>
