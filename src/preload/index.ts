import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import { Game, LauncherPaths } from '@shared/types';

// Custom APIs for renderer
export const api = {
  dialog: {
    openDirPicker: (): Promise<string> => ipcRenderer.invoke('dialog:open-dir'),
    openFilePicker: (): Promise<string> => ipcRenderer.invoke('dialog:open-file'),
  },
  scanner: {
    paths: (): Promise<LauncherPaths> => ipcRenderer.invoke('games:paths'),
    games: (paths: LauncherPaths): Promise<Game[]> => ipcRenderer.invoke('games:all', paths),
    launch: (gameId: string, launcher: string, executable?: string) =>
      ipcRenderer.send('games:launch', gameId, launcher, executable),
  },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
