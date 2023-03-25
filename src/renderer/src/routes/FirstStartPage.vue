<template>
  <div class="flex h-full flex-col items-center justify-center text-center text-xl">
    <div
      class="relative max-h-[80%] rounded-xl border-4 border-primary-7 bg-primary-3 px-16 py-10 shadow-2xl"
    >
      <div
        class="absolute -top-2 -left-2 -z-50 h-[calc(100%+1rem)] w-[calc(100%+1rem)] rounded-xl border-8 border-primary-7 blur-md"
      />
      <div class="flex h-full flex-col">
        <component :is="steps[step]" />
        <div class="mt-8 flex items-center justify-between gap-4">
          <Button v-if="step <= 0" color="error" @click="firstStart = false"> Skip </Button>
          <Button v-else color="primary" important @click="step--"> Back </Button>
          <div class="flex-1">{{ step }}</div>
          <Button
            v-if="step >= steps.length - 1"
            color="primary"
            important
            @click="firstStart = false"
          >
            Finish
          </Button>
          <Button v-else color="primary" important @click="step++"> Continue </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';

import GameSelection from '@renderer/components/intro/GameSelection.vue';
import LauncherPathsForm from '@renderer/components/intro/LauncherPathsForm.vue';
import Splash from '@renderer/components/intro/Splash.vue';
import Button from '@renderer/components/Button.vue';

const steps = [Splash, LauncherPathsForm, GameSelection];
const step = ref(0);

const firstStart = useLocalStorage('firstStart', true);
</script>

<style lang=""></style>
