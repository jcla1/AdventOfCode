import * as R from 'ramda';
import * as path from 'path';
import * as fs from 'fs';

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

export {
  getInput,
  isUpperCase,
  isLowerCase,
  sign, maximum, minimum,
  toIntArr, reduce1,
};
