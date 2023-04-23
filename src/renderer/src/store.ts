import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { updateCurrentUserProfile, useCurrentUser, useFirebaseAuth, useCollection } from 'vuefire';
import { useLocalStorage } from '@vueuse/core';
import { useToast } from 'primevue/usetoast';
import {
  UserInfo,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { addDoc, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

import { Game, LauncherPaths } from '@shared/types';
import { db } from './firebase';

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
  const customGamesCount = ref(0);

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
      window.api.scanner.launch(game.id, game.launcher, game.executable);
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

  /**
   * Adds a new custom game
   * @param game custom game
   */
  const addCustomGame = (
    game: Pick<Game, 'name' | 'executable' | 'cover' | 'hero' | 'icon' | 'logo'>
  ) => {
    const customGame = {
      ...game,
      id: 'custom' + customGamesCount.value,
      launcher: 'custom',
      isFavorite: false,
      path: game.executable,
    } as Game;
    games.value.push(customGame);
  };

  return {
    games,
    recentGames,
    favoriteGames,
    addRecent,
    toggleFavorite,
    launchGame,
    cancelLaunch,
    addCustomGame,
  };
});

export const useChatStore = defineStore('chatStore', () => {
  const users = useCollection<UserInfo>(collection(db, 'users'));
  const chats = useCollection(collection(db, 'chats'));
  const user = useCurrentUser();

  const sendMessage = async (recipientUid: string, message: string) => {
    if (!user.value) return;
    const recipient = users.value.find((user) => user.uid === recipientUid);
    if (!recipient) throw new Error('Recipient not found');
    let user1: UserInfo, user2: UserInfo;
    if (user.value?.uid < recipientUid) {
      user1 = user.value;
      user2 = recipient;
    } else {
      user1 = recipient;
      user2 = user.value;
    }
    await setDoc(doc(db, 'chats', user1.uid + '-' + user2.uid), {
      user1: {
        uid: user1.uid,
        displayName: user1.displayName,
        photoURL: user1.photoURL,
      },
      user2: {
        uid: user2.uid,
        displayName: user2.displayName,
        photoURL: user2.photoURL,
      },
    });
    return addDoc(collection(db, 'chats', user1.uid + '-' + user2.uid, 'messages'), {
      sender: user.value.uid,
      createdAt: serverTimestamp(),
      message,
    });
  };

  return { users, chats, sendMessage };
});

interface UserUpdateInfo {
  displayName?: string;
  photoURL?: string;
}

export const useAuthStore = defineStore('authStore', () => {
  const auth = useFirebaseAuth()!;
  const user = useCurrentUser();

  // const users = useCollection(collection(db, 'users'));

  const isUserLoaded = computed(() => user.value !== undefined);

  const signIn = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

  const signOut = () => auth.signOut();

  const createAccount = async (username: string, email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { uid, photoURL } = userCredential.user;
    const update = updateAccount({ displayName: username });
    const addToDb = setDoc(doc(db, 'users', userCredential.user.uid), {
      displayName: username,
      uid,
      email,
      photoURL,
    });
    await Promise.all([update, addToDb]);
    return userCredential;
  };

  const updateAccount = (userInfo: UserUpdateInfo) => updateCurrentUserProfile(userInfo);

  return { auth, user, isUserLoaded, signIn, signOut, createAccount, updateAccount };
});
