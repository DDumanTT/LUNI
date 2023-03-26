export type LauncherPaths = {
  [key: string]: string;
  steam: string;
  epic: string;
  ea: string;
  ubisoft: string;
};

export interface Game {
  launcher: string;
  id: string;
  name: string;
  path: string;
}
