const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const find = (board, target) => {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === target) {
        return [i, j];
      }
    }
  }
};

const getNeighbours = R.curry((board, [x, y]) => {
  const candidates = [[x-1, y], [x+1, y], [x, y-1], [x, y+1]];
  return R.filter(([i, j]) =>
    i >= 0 && i < board.length &&
    j >= 0 && j < board[i].length && board[i][j] !== '#', candidates);
});

const dist = ([x1, y1], [x2, y2]) => Math.abs(x1 - x2) + Math.abs(y1 - y2);

const getShortcutCount = (path, minToSave, cheatDistance) => {
  const shortcuts = [];
  for (let s = 0; s < path.length - minToSave; s++) {
    for (let e = s + minToSave; e < path.length; e++) {
      if (e - s - dist(path[s], path[e]) >= minToSave &&
          dist(path[s], path[e]) <= cheatDistance) {
        shortcuts.push([s, e]);
      }
    }
  }
  return shortcuts.length;
};

const board = R.compose(
  R.map(R.split('')),
  R.split('\n'))(input);

const startPos = find(board, 'S');
const endPos = find(board, 'E');

const path = U.astar(startPos, endPos, getNeighbours(board));

console.log(getShortcutCount(path, 100, 2));
console.log(getShortcutCount(path, 100, 20));
