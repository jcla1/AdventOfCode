const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const ranges = R.compose(
  R.map(U.toIntArr),
  R.map(R.split('-')),
  R.split(','))(input);

const isInvalidID = (re) => R.compose(
  R.test(re),
  R.toString);

const countInvalidIDs = (re) => R.compose(
  R.sum,
  R.map(R.compose(
  R.sum,
  R.filter(isInvalidID(re)),
  ([a, b]) => R.range(a, b + 1))))(ranges);

console.log(countInvalidIDs(/^(\d+)\1$/));
console.log(countInvalidIDs(/^(\d+)\1+$/));
