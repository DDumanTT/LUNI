<template>
  <template v-if="context">
    <slot @contextmenu="toggleContextMenu" />
    <ContextMenu ref="menu" :model="menuItems" />
  </template>
  <template v-else>
    <slot ref="asd" @click="toggleMenu" />
    <Menu ref="menu" :model="menuItems" :popup="true" />
  </template>
  <GameInfoModal :game="props.game" :visible="modalVisible" @hide="modalVisible = false" />
</template>

<script lang="ts">
interface GameMenuProps {
  game: Game;
  context?: boolean;
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Menu from 'primevue/menu';
import ContextMenu from 'primevue/contextmenu';
import { MenuItem } from 'primevue/menuitem';
import { PrimeIcons } from 'primevue/api';

import { Game } from '@shared/types';
import { useGamesStore } from '@renderer/store';
import GameInfoModal from './GameInfoModal.vue';

const store = useGamesStore();

const props = withDefaults(defineProps<GameMenuProps>(), { context: false });

const modalVisible = ref(false);
const menu = ref();
const menuItems = computed<MenuItem[]>(() => [
  {
    label: props.game.name,
    items: [
      {
        label: 'Play',
        icon: PrimeIcons.PLAY,
        command: () => {
          store.launchGame(props.game);
        },
      },
      {
        label: props.game.isFavorite ? 'Unfavorite' : 'Favorite',
        icon: props.game.isFavorite ? PrimeIcons.HEART_FILL : PrimeIcons.HEART,
        command: () => {
          store.toggleFavorite(props.game.id);
        },
      },
      {
        label: 'Information',
        icon: PrimeIcons.INFO_CIRCLE,
        command: () => {
          modalVisible.value = true;
        },
      },
      {
        label: 'Settings',
        icon: PrimeIcons.COG,
        command: () => {},
      },
    ],
  },
]);

const toggleMenu = (evt) => menu.value.toggle(evt);
const toggleContextMenu = (evt) => menu.value.show(evt);
</script>

<style scoped></style>
