<template>
  <ContextMenu :id="`game-menu-${game.id}`" v-slot="apiProps" :items="items" :dropdown="dropdown">
    <slot v-bind="apiProps" />
  </ContextMenu>
</template>

<script lang="ts">
interface GameMenuProps {
  game: Game;
  dropdown?: boolean;
}
</script>

<script setup lang="ts">
import { Game } from '@shared/types';
import ContextMenu, { MenuItems } from './ContextMenu.vue';
import { reactive } from 'vue';
import {
  IconPlay,
  IconHeart,
  IconClose,
  IconContact,
  IconEditBox,
} from '@iconify-prerendered/vue-pixelarticons';
import { useGamesStore } from '@renderer/store';

const store = useGamesStore();

const props = withDefaults(defineProps<GameMenuProps>(), { dropdown: false });

const items = reactive<MenuItems[]>([
  { id: 'play-item', label: 'Play', icon: IconPlay, click: () => console.log(props.game.name) },
  {
    id: 'fav-item',
    label: props.game.isFavorite ? 'Unfavorite' : 'Favorite',
    icon: props.game.isFavorite ? IconClose : IconHeart,
    click: () => store.toggleFavorite(props.game.id),
  },
  {
    id: 'info-item',
    label: 'Information',
    icon: IconContact,
  },
  {
    id: 'settings-item',
    label: 'Settings',
    icon: IconEditBox,
  },
]);
</script>

<style scoped></style>
