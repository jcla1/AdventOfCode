const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('inputs/day02.input', 'utf8').trim();

const keypad = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
];
const posToCode = R.curry((pad) =>
  R.reduce((acc, [x, y]) => acc + pad[y][x], ''));

const fancyKeypad = [
  [null, null, '1', null, null],
  [null, '2', '3', '4', null],
  ['5', '6', '7', '8', '9'],
  [null, 'A', 'B', 'C', null],
  [null, null, 'D', null, null],
];

const directions = R.compose(
    R.map(R.split('')),
    R.split('\n'))(input);

const moveNormalKeypad = ([x, y], direction) => {
  switch (direction) {
    case 'U':
      return [x, Math.max(y - 1, 0)];
    case 'D':
      return [x, Math.min(y + 1, 2)];
    case 'L':
      return [Math.max(x - 1, 0), y];
    case 'R':
      return [Math.min(x + 1, 2), y];
  }
};

const moveFancyKeypad = ([x, y], direction) => {
  switch (direction) {
    case 'U':
      return [x, Math.max(y - 1, Math.abs(x - 2))];
    case 'D':
      return [x, Math.min(y + 1, 4 - Math.abs(x - 2))];
    case 'L':
      return [Math.max(x - 1, Math.abs(y - 2)), y];
    case 'R':
      return [Math.min(x + 1, 4 - Math.abs(y - 2)), y];
  }
};

const normalCode = R.compose(
    posToCode(keypad),
    R.drop(1),
    R.scan(R.reduce(moveNormalKeypad), [1, 1]))(directions);
console.log(normalCode);

const fancyCode = R.compose(
    posToCode(fancyKeypad),
    R.drop(1),
    R.scan(R.reduce(moveFancyKeypad), [0, 2]))(directions);
console.log(fancyCode);
