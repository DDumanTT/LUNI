<template>
  <h1 class="mb-8 text-4xl font-bold text-primary-11">Select games</h1>
  <div class="z-40 h-full overflow-auto rounded-xl">
    <table class="z-50">
      <thead>
        <tr>
          <td></td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="game in games"
          :key="`${game.launcher}-${game.id}`"
          :class="[
            'p-2',
            game.selected ? 'bg-success-3 hover:bg-success-4' : 'bg-error-3 hover:bg-error-4',
          ]"
          @click="handleToggle(game)"
        >
          <td class="p-2">
            <component :is="launcherIconsMap[game.launcher]" />
          </td>
          <td class="pl-2 text-left">{{ game.name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
interface GameSelectProps {
  games: GameListItem[];
  paths: LauncherPaths;
}
interface GameListItem extends Game {
  selected?: boolean;
}
</script>

<script setup lang="ts">
import { onMounted, ref, toRaw } from 'vue';
import {
  IconSteam,
  IconEpicgames,
  IconEa,
  IconUbisoft,
} from '@iconify-prerendered/vue-simple-icons';

import { Game, LauncherPaths } from '@shared/types';

const props = defineProps<GameSelectProps>();
const emit = defineEmits(['update:games', 'update:toggle']);

const launcherIconsMap: Record<string, SvgComponent> = {
  steam: IconSteam,
  epic: IconEpicgames,
  ea: IconEa,
  ubisoft: IconUbisoft,
};

const loading = ref(true);

onMounted(() => {
  getGames();
});

const getGames = async () => {
  const res: GameListItem[] = await window.api.scanner.games(toRaw(props.paths));
  res.forEach((game) => (game.selected = true));
  emit('update:games', res);
  loading.value = false;
};

const handleToggle = (game: GameListItem) => {
  emit('update:toggle', game);
};
</script>

<style lang=""></style>
