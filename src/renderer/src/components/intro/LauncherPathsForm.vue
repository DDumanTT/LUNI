<template>
  <h1 class="title">Launcher paths</h1>
  <h2 class="subtitle">Select game launcher directories.</h2>
  <div v-if="!loading" class="form">
    <Input
      v-for="key in Object.keys(props.paths)"
      :id="key"
      :key="key"
      class="cursor-pointer"
      readonly
      required
      :label="launcherNamesMap[key]"
      :value="props.paths[key]"
      :icon-left="launcherIconsMap[key]"
      icon-right="pi-times cursor-pointer"
      @click="handlePathChange(key)"
      @click-right="handlePathClear(key)"
    />
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

import Input from '../Input.vue';
import { LauncherPaths } from '@shared/types';

const props = defineProps<PathsFormProps>();
const emit = defineEmits(['update']);

const launcherIconsMap: Record<string, string> = {
  steam: 'pi-steam h-6 w-6 !left-2 !-mt-3',
  epic: 'pi-epic h-6 w-6 !left-2 !-mt-3',
  ea: 'pi-ea h-6 w-6 !left-2 !-mt-3',
  ubisoft: 'pi-ubisoft h-6 w-6 !left-2 !-mt-3',
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
  Object.keys(props.paths).forEach((key) => {
    if (props.paths[key] === '' && newPaths[key]) emit('update', key, newPaths[key]);
  });
  loading.value = false;
};
</script>

<style lang="postcss" scoped>
.title {
  margin-bottom: 2rem;
  font-size: 2.25rem;
  line-height: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
}
.subtitle {
  margin-bottom: 1rem;
  font-weight: 700;
}
.form {
  height: 100%;
  overflow: auto;
  & > * {
    margin-bottom: 1rem;
  }
  & > *:last-child {
    margin-bottom: 0;
  }
}
</style>
