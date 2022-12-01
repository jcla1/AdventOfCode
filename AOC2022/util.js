// Various (mostly 2D array related) helper functions.
const R = require('ramda');

const isUpperCase = (s) => s === s.toUpperCase();
const isLowerCase = (s) => s === s.toLowerCase();

const sign = (x) => x === 0 ? 0 : (x > 0 ? 1 : -1);
const maximum = R.reduce(R.max, -Infinity);
const minimum = R.reduce(R.min, Infinity);

const toIntArr = R.map((n) => parseInt(n));

// toDict :: (k, v) -> {k: v}
const toDict = (p) => R.fromPairs([p]);

// fromPairsWith :: (v -> v -> v) -> [(k, v)] -> {k: v}
const fromPairsWith = R.curry((f) => R.compose(
    R.reduce(R.mergeWith(f), {}),
    R.map(toDict)));

// fixedPoint :: Eq a => (a -> a) -> a -> a
const fixedPoint = R.curry((f, a) => {
  const next = f(a);
  if (R.equals(next, a)) return next;
  return fixedPoint(f, next);
});

// zerosLike :: Num a => [[b]] -> [[a]]
const zerosLike = (board) => {
  const height = R.length(board);
  if (height === 0) return [];
  const width = R.length(board[0]);

  return R.map((_) => R.repeat(0, width), R.range(0, height));
};

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
  toIntArr,
  toDict, fromPairsWith,
  fixedPoint,
  zerosLike,
  aperture2D,
};
