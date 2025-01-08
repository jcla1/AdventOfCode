const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

// 16777216 is 2**24, a power of two
const next = (n) => {
  const m = (n ^ (n << 6)) & 16777215;
  const l = (m ^ (m / 32)) & 16777215;
  return (l ^ (l << 11)) & 16777215;
};

const twoKSteps = (n) => {
  return R.compose(
    R.scan((acc, _) => next(acc), n),
    R.range(0))(2000);
};

const inNums = R.compose(
    U.toIntArr,
    R.split('\n'))(input);

const secretNums = R.map(twoKSteps, inNums);
const twoKSum = R.compose(
    R.sum,
    R.map(R.last))(secretNums);
console.log(twoKSum);

const prices = R.map(R.map(R.modulo(R.__, 10)), secretNums);
const diffs = R.compose(
  U.mergeAllWith(R.add),
  R.map((p) => R.compose(
    R.fromPairs,
    R.reverse,
    R.flip(R.zip)(R.drop(4, p)),
    R.aperture(4),
    R.zipWith(R.flip(R.subtract)))(p, R.drop(1, p))))(prices);

const maxProfit = R.compose(
  R.nth(1),
  U.reduce1(R.maxBy(R.nth(1))),
  R.toPairs)(diffs);
console.log(maxProfit);
