import Dexie, { Table } from 'dexie';

import { Game } from '@shared/types';

export class LuniDatabase extends Dexie {
  games!: Table<Game>;

  constructor() {
    super('LuniDatabase');

    this.version(1).stores({
      games: 'id, name, launcher',
    });
  }
}

export const db = new LuniDatabase();
