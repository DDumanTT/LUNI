export function getRandom<T>(arr: Array<T>) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getRandomIndex<T>(arr: Array<T>) {
  return Math.floor(Math.random() * arr.length);
}

const colors = [
  'blue',
  'green',
  'yellow',
  'cyan',
  'pink',
  'indigo',
  'teal',
  'orange',
  'bluegray',
  'purple',
  'red',
  'gray',
];

export function randomColor() {
  return getRandom(colors);
}

export const getLauncherName = (name: string) =>
  ({
    steam: 'Steam',
    epic: 'Epic Games',
    ea: 'Electronic Arts',
    ubisoft: 'Ubisoft',
  }[name]);

export const getLauncherIcon = (name: string) =>
  ({
    steam: 'pi-steam',
    epic: 'pi-epic',
    ea: 'pi-ea',
    ubisoft: 'pi-ubisoft',
  }[name]);
