import { readdir, readFile, access, mkdir, copyFile } from 'node:fs/promises';
import { join } from 'node:path';
import { app } from 'electron';
import { enumerateValues, HKEY } from 'registry-js';

import { Game } from '@shared/types';
import { Directory } from '../types';

export default class Epic implements Directory<Game> {
  name: string;
  path: string;
  private manifestsPath: string;

  constructor(path?: string) {
    this.name = 'epic';
    if (path) this.path = path;
    else this.path = this.getPath();
  }

  getPath(): string {
    if (this.path) return this.path;
    const regList = enumerateValues(HKEY.HKEY_CURRENT_USER, 'SOFTWARE\\Epic Games\\EOS');
    const path = regList.find((reg) => reg.name === 'ModSdkCommand')?.data as string;
    this.manifestsPath = regList.find((reg) => reg.name === 'ModSdkMetadataDir')?.data as string;
    if (!path) throw new Error('Epic path not found');
    return join(path, '..', '..', '..', '..', '..');
  }

  async getContent(): Promise<Game[]> {
    const games: Game[] = [];
    try {
      let files = await readdir(this.manifestsPath);
      files = files.filter((file) => file.endsWith('.item'));
      const gamePromises: Promise<Game>[] = [];
      files.forEach((file) => {
        gamePromises.push(
          new Promise((resolve, reject) => {
            readFile(join(this.manifestsPath, file), {
              encoding: 'utf-8',
            })
              .then(this.parseItem.bind(this))
              .then((game) => resolve(game))
              .catch((err) => reject(err));
          })
        );
      });
      (await Promise.allSettled(gamePromises)).forEach((settledPromise) => {
        if (settledPromise.status === 'rejected') return;
        games.push(settledPromise.value);
      });
    } catch {
      return games;
    }
    return games;
  }

  private parseItem(content: string): Game {
    const item: Record<string, string> = JSON.parse(content);
    return {
      launcher: 'epic',
      id: item.AppName,
      name: item.DisplayName,
      isFavorite: false,
      path: item.InstallLocation,
    };
  }
}
