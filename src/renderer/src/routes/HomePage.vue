<template>
  <div>
    <button class="border border-black" @click="firstStart = true">FIRST START TRUE</button>
    <button class="border border-black" @click="print">print</button>
    <div>appdsasad fargewgraew</div>
    <div>
      <router-link to="test">link</router-link>
    </div>
    <div className="h-[2000px]">tall</div>
  </div>
</template>

<script setup lang="ts">
import { games } from '@renderer/store';
import { useLocalStorage } from '@vueuse/core';

const print = () => {
  console.log(games.value);
};

const firstStart = useLocalStorage('firstStart', true);
</script>

<style lang=""></style>
