import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

export const firstStart = useLocalStorage('firstStart', true);

export type LauncherPaths = {
  [key: string]: string;
  steam: string;
  epic: string;
  ea: string;
  ubisoft: string;
};
const initialLauncherPaths: LauncherPaths = {
  steam: '',
  epic: '',
  ea: '',
  ubisoft: '',
};

export const launcherPaths = useLocalStorage('launcherPaths', initialLauncherPaths);

export const useStore = defineStore('store', () => {});
