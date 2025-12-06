const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const op = (s) => s === '+' ? R.add : R.multiply;
const doRow = (r) => U.reduce1(op(R.last(r)), U.toIntArr(R.init(r)));

const part1 = R.compose(
  R.sum,
  R.map(doRow),
  R.transpose,
  R.map(R.o(R.split(/\s+/), R.trim)),
  R.split('\n'))(input);
console.log(part1);

const [numStr, opsArr] = R.compose(
  (xs) => [R.init(xs), R.last(xs)],
  R.map(R.split('')),
  R.split('\n'))(input);

const ops = R.compose(
  R.reverse,
  R.filter((s) => s !== ' '))(opsArr);
const nums = R.compose(
  R.sum,
  R.zipWith((s, nn) => U.reduce1(op(s), nn), R.reverse(ops)),
  R.map(U.toIntArr),
  R.splitWhenever(R.equals('')),
  R.map(R.o(R.trim, R.join(''))),
  R.transpose)(numStr);

console.log(nums);
