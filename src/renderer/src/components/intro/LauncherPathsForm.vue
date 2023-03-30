<template>
  <h1 class="mb-8 text-4xl font-bold text-primary-11">Launcher paths</h1>
  <h2 class="mb-4 font-bold">Select game launcher directories.</h2>
  <div v-if="!loading" class="h-full overflow-auto">
    <div class="flex flex-col gap-4">
      <Input
        v-for="key in Object.keys(props.paths.value)"
        :id="key"
        :key="key"
        class="cursor-pointer"
        readonly
        clearable
        required
        :label="launcherNamesMap[key]"
        :value="props.paths.value[key]"
        :icon="launcherIconsMap[key]"
        @click="handlePathChange(key)"
        @clear="handlePathClear(key)"
      />
    </div>
  </div>
  <template v-else>Loading...</template>
</template>

<script lang="ts">
interface PathsFormProps {
  paths: LauncherPaths;
}
</script>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  IconSteam,
  IconEpicgames,
  IconEa,
  IconUbisoft,
} from '@iconify-prerendered/vue-simple-icons';

import Input from '../Input.vue';
import { LauncherPaths } from '@shared/types';

const props = defineProps<PathsFormProps>();
const emit = defineEmits(['update']);

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
  emit('update', key, path);
};

const handlePathClear = (key: string) => {
  emit('update', key, '');
};

const getLauncherPaths = async () => {
  const newPaths = await window.api.scanner.paths();
  Object.keys(props.paths.value).forEach((key) => {
    if (props.paths.value[key] === '' && newPaths[key]) emit('update', key, newPaths[key]);
  });
  loading.value = false;
};
</script>

<style lang=""></style>
