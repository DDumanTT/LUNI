import { readdir, readFile, access, mkdir, copyFile } from 'node:fs/promises';
import { join } from 'node:path';
import { app } from 'electron';
import { enumerateValues, HKEY } from 'registry-js';

import { Game } from '@shared/types';
import { Directory } from '../types';

export default class Steam implements Directory<Game> {
  name: string;
  path: string;
  private images?: string[];
  private libraryCachePath: string;
  private imagesPath: string;

  constructor(path?: string) {
    this.name = 'steam';
    if (path) this.path = path;
    else this.path = this.getPath();
    this.libraryCachePath = join(this.path, 'appcache', 'librarycache');
    this.imagesPath = join(app.getPath('userData'), 'ImagesCache');
  }

  getPath(): string {
    if (this.path) return this.path;
    const regList = enumerateValues(HKEY.HKEY_CURRENT_USER, 'SOFTWARE\\Valve\\Steam');
    const path = regList.find((reg) => reg.name === 'SteamPath')?.data as string;
    if (!path) throw new Error('Steam path not found');
    return path;
  }

  async getContent(): Promise<Game[]> {
    const games: Game[] = [];
    const gamesPath = join(this.path, 'steamapps');
    try {
      let files = await readdir(gamesPath);
      files = files.filter((file) => file.endsWith('.acf'));
      const gamePromises: Promise<Game>[] = [];
      files.forEach((file) => {
        gamePromises.push(
          new Promise((resolve, reject) => {
            readFile(join(gamesPath, file), {
              encoding: 'utf-8',
            })
              .then(this.parseAcf.bind(this))
              .then(this.getGameImages.bind(this))
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

  private parseAcf(content: string): Game {
    const re = /"([^"]+(?="))"\t\t"([^"]+(?="))"/g;
    const matches = [...content.matchAll(re)];
    if (!matches || !matches.length) throw new Error('Game data not found.');
    const game: Game = {
      launcher: 'steam',
      id: '',
      name: '',
      isFavorite: false,
      path: join(this.path, 'steamapps', 'common'),
    };
    matches.forEach((match) => {
      switch (match[1]) {
        case 'appid':
          game.id = match[2];
          break;
        case 'name':
          game.name = match[2];
          break;
        case 'installdir':
          game.path = join(game.path, match[2]);
          break;
        default:
          return;
      }
    });
    return game;
  }

  private async readImages() {
    try {
      await access(this.imagesPath);
    } catch {
      await mkdir(this.imagesPath);
    }
    return await readdir(this.libraryCachePath);
  }

  private async copyImage(image: string) {
    const srcPath = join(this.libraryCachePath, image);
    const destPath = join(this.imagesPath, image);
    try {
      await access(destPath);
    } catch {
      await copyFile(srcPath, destPath);
    }
    return destPath.replace(/\\/g, '/');
  }

  private async getGameImages(game: Game) {
    const heroRe = /(.+)_library_hero\.(jpg|png)/g;
    const iconRe = /(.+)_icon\.(jpg|png)/g;
    const coverRe = /(.+)_library_600x900\.(jpg|png)/g;
    const logoRe = /(.+)_logo\.(jpg|png)/g;
    if (!this.images) this.images = await this.readImages();
    await Promise.all(
      this.images.map(async (image) => {
        if (game.cover && game.hero && game.logo) return;
        if (image.startsWith(game.id)) {
          if (heroRe.test(image)) game.hero = await this.copyImage(image);
          else if (coverRe.test(image)) game.cover = await this.copyImage(image);
          else if (logoRe.test(image)) game.logo = await this.copyImage(image);
          else if (iconRe.test(image)) game.icon = await this.copyImage(image);
        }
      })
    );
    return game;
  }
}
