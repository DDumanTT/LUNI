<template>
  <DataView :value="filteredGames" :layout="layout" data-key="all-games">
    <template #header>
      <div class="flex items-center">
        <div class="flex-1">
          <Button label="Filter" icon="pi pi-filter" @click="handleOpenFilterMenu" />
          <OverlayPanel ref="filterMenu">
            <div class="flex flex-col gap-2">
              <div class="flex items-center">
                <Checkbox v-model="launchersFilter" input-id="steam" name="steam" value="steam" />
                <label for="steam" class="pl-2">Steam</label>
              </div>
              <div class="flex items-center">
                <Checkbox v-model="launchersFilter" input-id="epic" name="epic" value="epic" />
                <label for="epic" class="pl-2">Epic Games</label>
              </div>
              <div class="flex items-center">
                <Checkbox v-model="launchersFilter" input-id="ea" name="ea" value="ea" />
                <label for="ea" class="pl-2">EA</label>
              </div>
              <div class="flex items-center">
                <Checkbox
                  v-model="launchersFilter"
                  input-id="ubisoft"
                  name="ubisoft"
                  value="ubisoft"
                />
                <label for="ubisoft" class="pl-2">Ubisoft</label>
              </div>
            </div>
          </OverlayPanel>
        </div>
        <div class="p-input-filled w-1/3">
          <Input
            :value="search"
            class="!rounded-full"
            icon-left="pi pi-search cursor-pointer"
            icon-right="pi pi-times cursor-pointer"
            placeholder="Search..."
            @input="($event) => (search = ($event.target as HTMLInputElement).value)"
            @click-right="search = ''"
          />
        </div>
        <DataViewLayoutOptions v-model="layout" class="flex flex-1 justify-end" />
      </div>
    </template>
    <template #list="slotProps">
      <div class="flex items-center gap-4 py-4 px-4 lg:px-48 xl:px-72">
        <div>
          <img
            v-if="slotProps.data.icon"
            :src="`appdata://${slotProps.data.icon}`"
            :alt="`${slotProps.data.name} icon`"
          />
          <span v-else class="inline-block !w-8 text-center">-</span>
        </div>
        <div>{{ slotProps.data.name }}</div>
        <div class="flex flex-1 items-center justify-end gap-2">
          <i :class="`pi ${getLauncherIcon(slotProps.data.launcher)}`" />
          <span>{{ getLauncherName(slotProps.data.launcher) }}</span>
        </div>
        <div class="flex justify-end gap-1">
          <Button label="Play" severity="info" raised rounded />
          <Button
            icon="pi pi-ellipsis-h"
            plain
            text
            rounded
            @click="menuStore.openGameMenu($event, slotProps.data)"
          />
        </div>
      </div>
    </template>
    <template #grid="slotProps">
      <GameCard :game="slotProps.data" aspect-ratio="3/4" />
    </template>
  </DataView>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import DataView from 'primevue/dataview';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions';
import Button from 'primevue/button';
import OverlayPanel from 'primevue/overlaypanel';
import Checkbox from 'primevue/checkbox';

import GameCard from '@renderer/components/GameCard.vue';
import { useGamesStore, useMenuStore } from '@renderer/store';
import Input from '@renderer/components/Input.vue';
import { getLauncherName, getLauncherIcon } from '@renderer/utils';
import { useLocalStorage } from '@vueuse/core';

const layout = useLocalStorage<'grid' | 'list' | undefined>('gamesPageLayout', 'grid');
const search = ref('');
const filterMenu = ref();
const launchersFilter = ref(['steam', 'epic', 'ea', 'ubisoft']);

const gamesStore = useGamesStore();
const menuStore = useMenuStore();

const filteredGames = computed(() => {
  return gamesStore.games
    .filter(
      (game) => search.value === '' || game.name.toLowerCase().includes(search.value.toLowerCase())
    )
    .filter((game) => launchersFilter.value.includes(game.launcher));
});

const handleOpenFilterMenu = (evt) => {
  filterMenu.value.toggle(evt);
};
</script>

<style lang="postcss" scoped>
:deep(.p-grid) {
  margin: v-bind("layout === 'grid' ? '2rem': ''");
  display: v-bind(layout);
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 3rem;
}
:deep(.p-dataview-content) {
  background: transparent;
}
.games-grid {
  margin: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 3rem;
}
</style>
