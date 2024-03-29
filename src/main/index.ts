import { app, shell, BrowserWindow, Menu, ipcMain, IpcMainInvokeEvent, protocol } from 'electron';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { electronApp, optimizer, is, devTools } from '@electron-toolkit/utils';

import icon from '../../resources/icon.png?asset';

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minHeight: 600,
    minWidth: 800,
    frame: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Disable native menu
Menu.setApplicationMenu(null);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Register appdata:// protocol for serving
  // local files from the appdata folder
  protocol.registerFileProtocol('appdata', (request, callback) => {
    const filePath = fileURLToPath('file://' + request.url.slice('appdata://'.length));
    callback(filePath);
  });

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  devTools.install('VUEJS3_DEVTOOLS', { allowFileAccess: true });

  optimizer.registerFramelessWindowIpc();

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
import { exec } from 'child_process';

import { GameScanner } from './scanner/GameScanner';
import { LauncherPaths } from '@shared/types';
import { openDirPicker, openFilePicker } from './dialog';

const gameScanner = new GameScanner();
ipcMain.handle('games:paths', gameScanner.getPaths);
ipcMain.handle('games:all', async (_: IpcMainInvokeEvent, paths: LauncherPaths) => {
  gameScanner.setPaths(paths);
  const games = await gameScanner.scan();
  return games.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
});
ipcMain.on(
  'games:launch',
  (_: IpcMainInvokeEvent, gameId: string, launcher: string, executable?: string) => {
    let command = '';
    switch (launcher) {
      case 'steam':
        command = `start "" "steam://rungameid/${gameId}"`;
        break;
      case 'epic':
        command = `start "" "com.epicgames.launcher://apps/${gameId}?action=launch&silent=true"`;
        break;
      case 'custom':
        if (executable) command = `start "" "${executable}"`;
        break;
      default:
        throw new Error('Game launcher is invalid or not implemented.');
    }
    exec(command);
  }
);

ipcMain.handle('dialog:open-dir', openDirPicker);
ipcMain.handle('dialog:open-file', openFilePicker);
