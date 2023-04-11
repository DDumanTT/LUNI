export type LauncherPaths = {
  [key: string]: string;
  steam: string;
  epic: string;
  ea: string;
  ubisoft: string;
};

export interface Game {
  id: string;
  launcher: string;
  name: string;
  path: string;
  isFavorite: boolean;
  icon?: string;
  logo?: string;
  cover?: string;
  hero?: string;
}
