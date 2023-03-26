import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

import { LauncherPaths } from '@shared/types';

export const firstStart = useLocalStorage('firstStart', true);

const initialLauncherPaths: LauncherPaths = {
  steam: '',
  epic: '',
  ea: '',
  ubisoft: '',
};

export const launcherPaths = useLocalStorage('launcherPaths', initialLauncherPaths);

export const useStore = defineStore('store', () => {});
