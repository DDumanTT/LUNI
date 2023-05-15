import { useGamesStore } from '../src/store';

describe('useGamesStore', () => {
  let store;

  beforeEach(() => {
    store = useGamesStore();
  });

  afterEach(() => {
    store.games.value = [];
    store.recentGamesIds.value = [];
    store.favGamesIds.value = [];
    store.customGamesCount.value = 0;
  });

  it('adds a recent game when calling addRecent', () => {
    const gameId = 'game1';
    store.addRecent(gameId);

    expect(store.recentGamesIds.value).toContain(gameId);
  });

  it('toggles the favorite status of a game when calling toggleFavorite', () => {
    const game1 = { id: 'game1', isFavorite: false };
    const game2 = { id: 'game2', isFavorite: true };
    store.games.value = [game1, game2];

    store.toggleFavorite('game1');
    expect(store.favGamesIds.value).toContain('game1');
    expect(game1.isFavorite).toBe(true);

    store.toggleFavorite('game2');
    expect(store.favGamesIds.value).not.toContain('game2');
    expect(game2.isFavorite).toBe(false);
  });

  it('updates favorites when calling updateFavorites', () => {
    store.user.value = { uid: 'user1' };

    const game1 = { id: 'game1', name: 'Game 1' };
    const game2 = { id: 'game2', name: 'Game 2' };
    store.games.value = [game1, game2];
    store.favGamesIds.value = ['game1', 'game2'];

    store.updateFavorites();

    expect(updateDoc).toHaveBeenCalledWith({
      favoriteGames: ['Game 1', 'Game 2'],
    });
  });

  it('launches a game when calling launchGame', () => {
    window.api = {
      scanner: {
        launch: vi.fn(),
      },
    };

    const game = { id: 'game1', name: 'Game 1', launcher: 'launcher1', executable: 'game1.exe' };

    store.launchGame(game);

    expect(store.timeout).toBeDefined();

    vi.advanceTimersByTime(store.LAUNCH_TIMEOUT);

    expect(store.timeout).toBeUndefined();
    expect(window.api.scanner.launch).toHaveBeenCalledWith(game.id, game.launcher, game.executable);
  });

  it('cancels game launching when calling cancelLaunch', () => {
    store.timeout = setTimeout(() => {}, 3000);
    store.cancelLaunch();

    expect(store.timeout).toBeUndefined();
  });

  it('adds a new custom game when calling addCustomGame', () => {
    const customGame = {
      name: 'Custom Game',
      executable: 'custom.exe',
      cover: 'cover.png',
      hero: 'hero.png',
      icon: 'icon.png',
      logo: 'logo.png',
    };

    store.addCustomGame(customGame);

    expect(store.games.value).toHaveLength(1);
    expect(store.games.value[0]).toMatchObject({
      name: 'Custom Game',
      executable: 'custom.exe',
      cover: 'cover.png',
      hero: 'hero.png',
      icon: 'icon.png',
      logo: 'logo.png',
      launcher: 'custom',
      isFavorite: false,
      path: 'custom.exe',
    });
  });
  it('removes a game when calling removeGame', () => {
    const game1 = { id: 'game1' };
    const game2 = { id: 'game2' };
    const game3 = { id: 'game3' };
    store.games.value = [game1, game2, game3];
    store.recentGamesIds.value = ['game1', 'game3'];
    store.favGamesIds.value = ['game2', 'game3'];

    store.removeGame('game2');

    expect(store.games.value).toHaveLength(2);
    expect(store.games.value).toEqual([game1, game3]);
    expect(store.recentGamesIds.value).toEqual(['game1', 'game3']);
    expect(store.favGamesIds.value).toEqual(['game3']);
  });

  it('updates favorites when removing a favorite game', () => {
    store.user.value = { uid: 'user1' };

    const game1 = { id: 'game1', name: 'Game 1' };
    const game2 = { id: 'game2', name: 'Game 2' };
    store.games.value = [game1, game2];
    store.favGamesIds.value = ['game1', 'game2'];

    store.removeGame('game1');

    expect(updateDoc).toHaveBeenCalledWith({
      favoriteGames: ['Game 2'],
    });
  });
});
