const R = require('ramda');
const path = require('path');
const fs = require('fs');

const getInput = (f) => {
  const inputPath = 'inputs/' + path.basename(f).replace('.js', '.input');
  return fs.readFileSync(inputPath, 'utf8').trim();
};

const isUpperCase = (s) => s === s.toUpperCase();
const isLowerCase = (s) => s === s.toLowerCase();

const sign = (x) => x === 0 ? 0 : (x > 0 ? 1 : -1);
const maximum = R.reduce(R.max, -Infinity);
const minimum = R.reduce(R.min, Infinity);

const toIntArr = R.map((n) => parseInt(n));
const reduce1 = R.curry((f, xs) => R.reduce(f, R.head(xs), R.tail(xs)));

const aperture2D = R.curry(([n, k], grid) => {
  return R.compose(
      R.transpose,
      R.map(R.aperture(n)),
      R.transpose,
      R.map(R.aperture(k)))(grid);
});

module.exports = {
  getInput,
  isUpperCase,
  isLowerCase,
  sign, maximum, minimum,
  toIntArr, reduce1,
  aperture2D,
};
