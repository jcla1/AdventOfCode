// Various (mostly 2D array related) helper functions.
const R = require('ramda');

const isUpperCase = (s) => s === s.toUpperCase();
const isLowerCase = (s) => s === s.toLowerCase();

const sign = (x) => x === 0 ? 0 : (x > 0 ? 1 : -1);
const maximum = R.reduce(R.max, -Infinity);
const minimum = R.reduce(R.min, Infinity);

// toDict :: (k, v) -> {k: v}
const toDict = (p) => R.fromPairs([p]);

// fromPairsWith :: (v -> v -> v) -> [(k, v)] -> {k: v}
const fromPairsWith = R.curry((f) => R.compose(
    R.reduce(R.mergeWith(f), {}),
    R.map(toDict)));

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

// (a -> b) -> [[a]] -> [[b]]
const mapBoard = R.curry((f, board) => R.map(R.map(f), board));

const addBoards = R.zipWith(R.zipWith(R.add));

// sumBoard :: Num a => [[a]] -> a
const sumBoard = R.o(R.sum, R.unnest);

const boardToString = (board, sep = '') => R.o(
    R.join('\n'),
    R.map(R.join(sep)))(board);
const printBoard = (board, sep = '') => console.log(boardToString(board, sep));

// zerosLike :: Num a => [[b]] -> [[a]]
const zerosLike = (board) => {
  const height = R.length(board);
  if (height === 0) return [];
  const width = R.length(board[0]);

  return R.map((_) => R.repeat(0, width), R.range(0, height));
};

// getIndicies :: [[a]] -> [(Int, Int)]
const getIndicies = (board) => {
  const height = R.length(board);
  if (height === 0) return [];
  const width = R.length(board[0]);

  return R.chain((i) => R.map(R.pair(i), R.range(0, width)),
      R.range(0, height));
};

// getNeighbours :: [[a]] -> (Int, Int) (-> Bool) -> [(Int, Int)]
const getNeighbours = R.curry((board, [i, j], diag = false) =>
  R.filter(onBoard(board),
      R.concat([[i-1, j], [i, j-1], [i, j+1], [i+1, j]],
            diag ? [[i-1, j-1], [i-1, j+1], [i+1, j-1], [i+1, j+1]] : [])));

const pad = (img, n = 2, item = '.') => {
  const height = R.length(img);
  const width = R.length(img[0]);
  const topBottom = R.map((_) => R.repeat(item, width + 2*n), R.range(0, n));

  return R.unnest([
      R.clone(topBottom),
      R.map((r) => R.unnest([R.repeat(item, n), r, R.repeat(item, n)]), img),
      R.clone(topBottom),
  ]);
};

const aperture2D = R.curry(([n, k], board) => {
  return R.compose(
    R.transpose,
    R.map(R.aperture(n)),
    R.transpose,
    R.map(R.aperture(k)))(board);
});

module.exports = {
  isUpperCase, isLowerCase,
  sign, maximum, minimum,
  toDict, fromPairsWith,
  get, set,
  onBoard, mapBoard, addBoards, sumBoard, zerosLike,
  boardToString, printBoard,
  getIndicies, getNeighbours,
  pad, aperture2D,
};
