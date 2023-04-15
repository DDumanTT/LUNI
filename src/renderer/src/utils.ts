export function getRandom<T>(arr: Array<T>) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getRandomIndex<T>(arr: Array<T>) {
  return Math.floor(Math.random() * (arr.length - 1));
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
