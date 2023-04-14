export function getRandom<T>(arr: Array<T>) {
  return arr[Math.floor(Math.random() * arr.length)];
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
