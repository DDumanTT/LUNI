import { computed } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

import { Game, LauncherPaths } from '@shared/types';

export const firstStart = useLocalStorage('firstStart', true);

const initialLauncherPaths: LauncherPaths = {
  steam: '',
  epic: '',
  ea: '',
  ubisoft: '',
};

export const launcherPaths = useLocalStorage('launcherPaths', initialLauncherPaths);

export const useGamesStore = defineStore('games', () => {
  const games = useLocalStorage<Game[]>('games', []);
  const recentGamesIds = useLocalStorage<string[]>('recentGamesIds', []);
  const favGamesIds = useLocalStorage<string[]>('favGamesIds', []);

  const recentGames = computed(() =>
    recentGamesIds.value.reduce((recentGames, id) => {
      const game = games.value.find((g) => g.id === id);
      if (!game) return recentGames;
      recentGames.push(game);
      return recentGames;
    }, [] as Game[])
  );
  const favoriteGames = computed(() =>
    favGamesIds.value.reduce((favorites, id) => {
      const game = games.value.find((g) => g.id === id);
      if (!game) return favorites;
      favorites.push(game);
      return favorites;
    }, [] as Game[])
  );

  /**
   * Adds recently played game
   * @param gameId ID of a game to add to recently played
   */
  function addRecent(gameId: string) {
    const existsIndex = recentGamesIds.value.indexOf(gameId);
    if (existsIndex !== -1) recentGamesIds.value.splice(existsIndex, 1);
    recentGamesIds.value.unshift(gameId);
  }
  /**
   * Toggles favorite game status
   * @param gameId ID of a game to mark/unmark favorite
   */
  function markFavorite(gameId: string) {
    const existsIndex = favGamesIds.value.indexOf(gameId);
    if (existsIndex !== -1) {
      favGamesIds.value.splice(existsIndex, 1);
      return;
    }
    recentGamesIds.value.push(gameId);
  }

  return { games, recentGames, favoriteGames, addRecent, markFavorite };
});

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
