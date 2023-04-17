import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { MenuItem } from 'primevue/menuitem';
import { PrimeIcons } from 'primevue/api';
import { useToast } from 'primevue/usetoast';

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

  const toast = useToast();

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
    if (recentGamesIds.value.length >= 10) recentGamesIds.value.pop();
    recentGamesIds.value.unshift(gameId);
  }
  /**
   * Toggles favorite game status
   * @param gameId ID of a game to mark/unmark favorite
   */
  function toggleFavorite(gameId: string) {
    const game = games.value.find((game) => game.id === gameId);
    if (!game) return;
    const existsIndex = favGamesIds.value.indexOf(gameId);
    if (existsIndex !== -1) {
      favGamesIds.value.splice(existsIndex, 1);
      game.isFavorite = false;
      return;
    }
    game.isFavorite = true;
    favGamesIds.value.push(gameId);
  }

  let timeout: NodeJS.Timeout | undefined;
  const LAUNCH_TIMEOUT = 3000;
  /**
   * Launches game
   * @param gameId ID of a game to launch
   */
  function launchGame(game: Game) {
    if (timeout)
      return toast.add({
        severity: 'error',
        summary: 'You are already launching a game.',
        detail: 'Cancel it to continue.',
        group: 'launch',
        life: LAUNCH_TIMEOUT,
      });
    toast.add({
      severity: 'success',
      summary: 'Launching game...',
      detail: `${game.name} launching in 3 seconds. Close message to cancel.`,
      group: 'launch',
      life: LAUNCH_TIMEOUT,
    });
    timeout = setTimeout(() => {
      addRecent(game.id);
      window.api.scanner.launch(game.id, game.launcher);
      timeout = undefined;
    }, LAUNCH_TIMEOUT);
  }

  /**
   * Cancels game launching
   */
  function cancelLaunch() {
    clearTimeout(timeout);
    timeout = undefined;
  }

  return { games, recentGames, favoriteGames, addRecent, toggleFavorite, launchGame, cancelLaunch };
});

export const useMenuStore = defineStore('menuStore', () => {
  const gamesStore = useGamesStore();

  const contextMenu = ref();
  const menu = ref();
  const items = ref<MenuItem[]>([]);
  const modalVisible = ref(false);
  const modalComponent = ref('');
  const modalProps = ref({});

  const menuGame = ref<Game>();

  const gameMenuItems = computed(() => {
    if (!menuGame.value) return [];
    return [
      {
        label: menuGame.value.name,
        items: [
          {
            label: 'Play',
            icon: PrimeIcons.PLAY,
            command: () => {
              if (menuGame.value) gamesStore.launchGame(menuGame.value);
            },
          },
          {
            label: menuGame.value.isFavorite ? 'Unfavorite' : 'Favorite',
            icon: menuGame.value.isFavorite ? PrimeIcons.HEART_FILL : PrimeIcons.HEART,
            command: () => {
              if (menuGame.value) gamesStore.toggleFavorite(menuGame.value.id);
            },
          },
          {
            label: 'Information',
            icon: PrimeIcons.INFO_CIRCLE,
          },
          {
            label: 'Settings',
            icon: PrimeIcons.COG,
            command: () => {},
          },
        ],
      },
    ];
  });

  const openGameMenu = (evt, game: Game) => {
    menuGame.value = game;
    items.value = gameMenuItems.value;
    contextMenu.value.hide();
    menu.value.toggle(evt);
  };

  const openGameContextMenu = (evt, game: Game) => {
    menuGame.value = game;
    items.value = gameMenuItems.value;
    menu.value.hide();
    contextMenu.value.show(evt);
  };

  const openGameInfoModal = (game: Game) => {
    modalVisible.value = true;
    modalComponent.value = 'GameInfo';
  };

  const setMenu = (element) => {
    menu.value = element;
  };
  const setContextMenu = (element) => {
    contextMenu.value = element;
  };

  return {
    items,
    modalVisible,
    modalComponent,
    openGameMenu,
    openGameContextMenu,
    openGameInfoModal,
    setMenu,
    setContextMenu,
  };
});
