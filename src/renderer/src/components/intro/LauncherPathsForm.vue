<template>
  <h1 class="mb-8 text-4xl font-bold text-primary-11">Launcher paths</h1>
  <template v-if="!loading">
    <h2 class="mb-4 font-bold">Select game launcher directories.</h2>
    <div class="flex flex-col gap-4">
      <Input
        v-for="key in Object.keys(launcherPaths)"
        :id="key"
        :key="key"
        class="cursor-pointer"
        read-only
        clearable
        :label="launcherNamesMap[key]"
        :value="launcherPaths[key]"
        :icon="launcherIconsMap[key]"
      />
    </div>
  </template>
  <template v-else>Loading...</template>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IconSteam,
  IconEpicgames,
  IconEa,
  IconUbisoft,
} from '@iconify-prerendered/vue-simple-icons';

import { launcherPaths } from '@renderer/store';
import Input from '../Input.vue';

const launcherIconsMap: Record<string, SvgComponent> = {
  steam: IconSteam,
  epic: IconEpicgames,
  ea: IconEa,
  ubisoft: IconUbisoft,
};
const launcherNamesMap: Record<string, string> = {
  steam: 'Steam',
  epic: 'Epic Games',
  ea: 'EA App',
  ubisoft: 'Ubisoft',
};

const loading = ref(false);
</script>

<style lang=""></style>
