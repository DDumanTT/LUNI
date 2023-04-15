<template>
  <template v-if="context">
    <slot @contextmenu="toggleContextMenu" />
    <ContextMenu ref="menu" :model="menuItems" />
  </template>
  <template v-else>
    <slot @click="toggleMenu" />
    <Menu ref="menu" :model="menuItems" :popup="true">
      <template #item="scope">
        <div>
          {{ scope.item.key }}
        </div>
      </template>
    </Menu>
  </template>
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

const store = useGamesStore();

const props = withDefaults(defineProps<GameMenuProps>(), { context: false });

const favText = computed(() => (props.game.isFavorite ? 'Unfavorite' : 'Favorite'));
const favIcon = computed(() => (props.game.isFavorite ? PrimeIcons.HEART_FILL : PrimeIcons.HEART));

const menu = ref();
const menuItems = ref<MenuItem[]>([
  {
    label: props.game.name,
    items: [
      {
        label: 'Play',
        icon: PrimeIcons.PLAY,
        command: () => {
          console.log(props.game.name);
          store.addRecent(props.game.id);
        },
      },
      {
        key: 'fav',
        label: 'Favorite',
        icon: PrimeIcons.HEART,
        command: () => store.toggleFavorite(props.game.id),
      },
      {
        label: 'Information',
        icon: PrimeIcons.INFO_CIRCLE,
      },
      {
        label: 'Settings',
        icon: PrimeIcons.COG,
        command: () => {
          console.log(store.gameMenu);
        },
      },
    ],
  },
]);

const toggleMenu = (evt) => menu.value.toggle(evt);
const toggleContextMenu = (evt) => menu.value.show(evt);
</script>

<style scoped></style>
