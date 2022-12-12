// Various (mostly 2D array related) helper functions.
const R = require('ramda');

const isUpperCase = (s) => s === s.toUpperCase();
const isLowerCase = (s) => s === s.toLowerCase();

const sign = (x) => x === 0 ? 0 : (x > 0 ? 1 : -1);
const maximum = R.reduce(R.max, -Infinity);
const minimum = R.reduce(R.min, Infinity);

const toIntArr = R.map((n) => parseInt(n));
const multiIntersection = (s) => R.reduce(R.intersection, R.head(s), R.tail(s));

// zerosLike :: Num a => [[b]] -> [[a]]
const zerosLike = (board) => {
  const height = R.length(board);
  if (height === 0) return [];
  const width = R.length(board[0]);

  return R.map((_) => R.repeat(0, width), R.range(0, height));
};

// A cell is its own neighbour.
// neighbours :: (Int, Int) -> [(Int, Int)]
const neighbours = ([x, y]) => [
  [x-1, y-1], [x, y-1], [x+1, y-1],
  [x-1, y], [x, y], [x+1, y],
  [x-1, y+1], [x, y+1], [x+1, y+1]];

// But not its own plus neighbour.
// plusNeighbours :: (Int, Int) -> [(Int, Int)]
const plusNeighbours = ([x, y]) => [[x-1, y], [x+1, y], [x, y-1], [x, y+1]];

// (a -> b) -> [[a]] -> [[b]]
const mapBoard = R.curry((f, board) => R.map(R.map(f), board));

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

// getIndicies :: [[a]] -> [(Int, Int)]
const getIndicies = (board) => {
  const height = R.length(board);
  if (height === 0) return [];
  const width = R.length(board[0]);

  return R.chain((i) => R.map(R.pair(i), R.range(0, width)),
      R.range(0, height));
};

// findIndicies :: (a -> Bool) -> [[a]] -> [(Int, Int)]
const findIndicies = R.curry((f, board) =>
  R.filter((p) => f(get(board, p)), getIndicies(board)));

const aperture2D = R.curry(([n, k], board) => {
  return R.compose(
      R.transpose,
      R.map(R.aperture(n)),
      R.transpose,
      R.map(R.aperture(k)))(board);
});

module.exports = {
  isUpperCase,
  isLowerCase,
  sign, maximum, minimum,
  toIntArr, multiIntersection,
  zerosLike, neighbours, plusNeighbours,
  mapBoard, onBoard, get, set,
  getIndicies, findIndicies,
  aperture2D,
};
