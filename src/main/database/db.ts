import Dexie, { Table } from 'dexie';

class LuniDatabase extends Dexie {
  constructor() {
    super('LuniDatabase');

    this.version(1).stores({
      games: '++id, ',
    });
  }
}
