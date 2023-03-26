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
        readonly
        clearable
        required
        :label="launcherNamesMap[key]"
        :value="launcherPaths[key]"
        :icon="launcherIconsMap[key]"
        @click="handlePathChange(key)"
        @clear="handlePathClear(key)"
      />
    </div>
  </template>
  <template v-else>Loading...</template>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
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

onMounted(() => {
  getLauncherPaths();
});

const handlePathChange = async (key: string) => {
  const path = await window.api.dialog.openDirPicker();
  if (!path) return;
  launcherPaths.value[key] = path;
};

const handlePathClear = (key: string) => {
  launcherPaths.value[key] = '';
};

const getLauncherPaths = async () => {
  const newPaths = await window.api.scanner.paths();
  Object.keys(launcherPaths.value).forEach((key) => {
    if (launcherPaths.value[key] === '' && newPaths[key]) launcherPaths.value[key] = newPaths[key];
  });
  loading.value = false;
};
</script>

<style lang=""></style>
