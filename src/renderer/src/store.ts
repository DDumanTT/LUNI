import { computed, readonly, ref } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

import { Game, LauncherPaths } from '@shared/types';
import { db } from './database/db';

export const firstStart = useLocalStorage('firstStart', true);

const initialLauncherPaths: LauncherPaths = {
  steam: '',
  epic: '',
  ea: '',
  ubisoft: '',
};

export const launcherPaths = useLocalStorage('launcherPaths', initialLauncherPaths);

export const games = useLocalStorage<Game[]>('games', []);

// export const useGamesStore = defineStore('games', () => {
//   const _games = ref<Game[]>([]);

//   const games = computed(async () => {
//     if (!_games.value.length) _games.value = await db.games.toArray();
//     return _games.value;
//   });

//   async function set(newGame: Game) {
//     const index = _games.value.findIndex((game) => game.id === newGame.id);
//     if (!index) _games.value.push(newGame);
//     _games.value[index] = newGame;
//     await db.games.put(newGame);
//   }

//   async function bulkSet(newGames: Game[]) {
//     _games.value = newGames;
//     await db.games.clear();
//     await db.games.bulkAdd(newGames);
//   }

//   return { games, set, bulkSet };
// });
