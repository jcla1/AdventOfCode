// Various (mostly 2D array related) helper functions.
const R = require('ramda');

// onBoard :: [[a]] -> (Int, Int) -> Bool
const onBoard = R.curry((board, [i, j]) => {
  const height = R.length(board);
  if (height === 0) return false;
  const width = R.length(board[0]);

  return 0 <= i && i < height && 0 <= j && j < width;
});

const get = R.curry((board, p) => board[p[0]][p[1]]);
// WARNING: set is not pure - it mutates!
const set = R.curry((board, p, v) => {
  board[p[0]][p[1]] = v;
});

const mapBoard = (f, board) => R.map(R.map(f), board);
const boardToString = (board, sep = '') => R.o(
    R.join('\n'),
    R.map(R.join(sep)))(board);
const printBoard = (board, sep = '') => console.log(boardToString(board, sep));

const zerosLike = (board) => {
  const height = R.length(board);
  if (height === 0) return [];
  const width = R.length(board[0]);

  return R.map((_) => R.repeat(0, width), R.range(0, height));
};

const getIndicies = (board) => {
  const height = R.length(board);
  if (height === 0) return [];
  const width = R.length(board[0]);

  return R.chain((i) => R.map(R.pair(i), R.range(0, width)),
      R.range(0, height));
};

const getNeighbours = R.curry((board, [i, j], diag = false) =>
  R.filter(onBoard(board),
      R.concat([[i-1, j], [i, j-1], [i, j+1], [i+1, j]],
            diag ? [[i-1, j-1], [i-1, j+1], [i+1, j-1], [i+1, j+1]] : [])));

module.exports = {
  get, set,
  onBoard, mapBoard, zerosLike,
  boardToString, printBoard,
  getIndicies, getNeighbours};
