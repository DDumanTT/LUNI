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
import { addDoc, collection, doc, setDoc, serverTimestamp, writeBatch } from 'firebase/firestore';

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
        life: LAUNCH_TIMEOUT,
      });
    toast.add({
      severity: 'success',
      summary: 'Launching game...',
      detail: `${game.name} launching in 3 seconds. Close message to cancel.`,
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
  const usersRef = collection(db, 'users');

  const user = useCurrentUser();
  const users = useCollection<UserInfo>(usersRef);
  const chats = useCollection(collection(db, 'chats'));

  const getMessagesCollection = (uid: string) => {
    if (!user.value) return;
    let uid1: string, uid2: string;
    if (user.value?.uid < uid) {
      uid1 = user.value?.uid;
      uid2 = uid;
    } else {
      uid1 = uid;
      uid2 = user.value?.uid;
    }
    return collection(db, 'chats', uid1 + '-' + uid2, 'messages');
  };

  const sendMessage = async (recipientUid: string, message: string) => {
    if (!message) return;
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
      text: message,
    });
  };

  return { users, chats, getMessagesCollection, sendMessage };
});

export const useFriendsStore = defineStore('friendsStore', () => {
  const user = useCurrentUser();

  const ownFriendsCollection = computed(
    () => user.value && collection(db, 'users', user.value.uid, 'friends')
  );
  const ownSentCollection = computed(
    () => user.value && collection(db, 'users', user.value.uid, 'sentRequests')
  );
  const ownReceivedCollection = computed(
    () => user.value && collection(db, 'users', user.value.uid, 'receivedRequests')
  );
  const friendsCollection = (uid: string) => collection(db, 'users', uid, 'friends');
  const sentCollection = (uid: string) => collection(db, 'users', uid, 'sentRequests');
  const receivedCollection = (uid: string) => collection(db, 'users', uid, 'receivedRequests');

  const chatStore = useChatStore();
  const friends = useCollection<UserInfo>(ownFriendsCollection);
  const sentRequests = useCollection<UserInfo>(ownSentCollection);
  const receivedRequests = useCollection<UserInfo>(ownReceivedCollection);

  const toast = useToast();

  const friendUids = computed(() => friends.value.map((user) => user.uid));
  const sentUids = computed(() => sentRequests.value.map((user) => user.uid));

  const users = computed(() =>
    chatStore.users
      .filter((u) => u.uid !== user.value?.uid)
      .map((u) => ({
        ...u,
        isFriend: friendUids.value.includes(u.uid),
        requestSent: sentUids.value.includes(u.uid),
      }))
  );

  const userMap = (user: UserInfo) => ({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  });

  const sendRequest = async (uid: string) => {
    if (!user.value || !ownSentCollection.value) return;
    const otherUser = chatStore.users.find((user) => user.uid === uid);
    if (!otherUser) return;
    if (receivedRequests.value.map((user) => user.uid).includes(uid)) return acceptRequest(uid);
    const batch = writeBatch(db);
    batch.set(doc(ownSentCollection.value, otherUser.uid), otherUser);
    batch.set(doc(receivedCollection(uid), user.value.uid), userMap(user.value));
    await batch.commit();
    toast.add({ severity: 'success', summary: 'Friend request sent', life: 3000 });
  };

  const cancelRequest = async (uid: string) => {
    if (!user.value || !ownSentCollection.value) return;
    const otherUser = sentRequests.value.find((user) => user.uid === uid);
    if (!otherUser) return;
    const batch = writeBatch(db);
    batch.delete(doc(ownSentCollection.value, uid));
    batch.delete(doc(receivedCollection(uid), user.value.uid));
    await batch.commit();
    toast.add({ severity: 'warn', summary: 'Friend request cancelled', life: 3000 });
  };

  const acceptRequest = async (uid: string) => {
    if (!user.value || !ownReceivedCollection.value || !ownFriendsCollection.value) return;
    const otherUser = receivedRequests.value.find((user) => user.uid === uid);
    if (!otherUser) return;
    const batch = writeBatch(db);
    batch.delete(doc(sentCollection(uid), user.value.uid));
    batch.delete(doc(ownReceivedCollection.value, uid));
    batch.set(doc(friendsCollection(uid), user.value.uid), userMap(user.value));
    batch.set(doc(ownFriendsCollection.value, uid), otherUser);
    await batch.commit();
    toast.add({ severity: 'success', summary: 'Friend request accepted', life: 3000 });
  };

  const denyRequest = async (uid: string) => {
    if (!user.value || !ownReceivedCollection.value) return;
    const otherUser = receivedRequests.value.find((user) => user.uid === uid);
    if (!otherUser) return;
    const batch = writeBatch(db);
    batch.delete(doc(sentCollection(uid), user.value.uid));
    batch.delete(doc(ownReceivedCollection.value, uid));
    await batch.commit();
    toast.add({ severity: 'warn', summary: 'Friend request denied', life: 3000 });
  };

  const unfriend = async (uid: string) => {
    if (!user.value || !ownFriendsCollection.value) return;
    const otherUser = friends.value.find((user) => user.uid === uid);
    if (!otherUser) return;
    const batch = writeBatch(db);
    batch.delete(doc(ownFriendsCollection.value, uid));
    batch.delete(doc(friendsCollection(uid), user.value.uid));
    await batch.commit();
    toast.add({ severity: 'warn', summary: 'Friend removed', life: 3000 });
  };

  return {
    user,
    users,
    friends,
    sentRequests,
    receivedRequests,
    sendRequest,
    cancelRequest,
    acceptRequest,
    denyRequest,
    unfriend,
  };
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
