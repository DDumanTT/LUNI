<template>
  <div class="h-[60vh]">
    <DataTable
      :selection="selected"
      :value="games"
      scrollable
      removable-sort
      scroll-height="flex"
      table-style="min-width: 50rem"
      @update:selection="emit('update:selection', $event)"
    >
      <Column selection-mode="multiple" header-style="width: 3rem"></Column>
      <template #header>
        <h1 class="title">Select games to import</h1>
      </template>
      <Column field="icon" header="Icon" header-style="width: 3rem">
        <template #body="slotProps">
          <img
            v-if="slotProps.data.icon"
            :src="`appdata://${slotProps.data.icon}`"
            :alt="`${slotProps.data.name} icon`"
          />
          <span v-else>-</span>
        </template>
      </Column>
      <Column field="name" header="Name" sortable></Column>
      <Column field="launcher" header="Launcher" sortable>
        <template #body="slotProps">
          <div class="flex items-center gap-2">
            <i :class="`pi ${getLauncherIcon(slotProps.data.launcher)}`" />
            <span>{{ getLauncherName(slotProps.data.launcher) }}</span>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script lang="ts">
interface GameSelectProps {
  games: Game[];
  paths: LauncherPaths;
  selected: Game[];
}
</script>

<script setup lang="ts">
import { onMounted, ref, toRaw } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import { Game, LauncherPaths } from '@shared/types';
import { getLauncherName, getLauncherIcon } from '@renderer/utils';

const props = defineProps<GameSelectProps>();
const emit = defineEmits(['update:games', 'update:selection']);

const loading = ref(true);

onMounted(() => {
  getGames();
});

const getGames = async () => {
  const res: Game[] = await window.api.scanner.games(toRaw(props.paths));
  emit('update:games', res);
  loading.value = false;
};
</script>

<style lang="postcss" scoped>
:deep(.p-datatable-header),
:deep(.p-datatable-wrapper) {
  background: transparent;
}
.title {
  margin-bottom: 2rem;
  font-size: 2.25rem;
  line-height: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
}
</style>
