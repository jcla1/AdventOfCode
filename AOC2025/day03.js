const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const findLargestIndex = (xs) => {
  let largestIndex = 0;
  let largestValue = xs[0];
  for (let i = 1; i < xs.length; i++) {
    if (xs[i] > largestValue) {
      largestValue = xs[i];
      largestIndex = i;
    }
  }
  return largestIndex;
};

const batteries = R.compose(
  R.map(R.o(U.toIntArr, R.split(''))),
  R.split('\n'))(input);

const findJoltage = (n) => (b) => {
  const idx = findLargestIndex(b.slice(0, -1));
  const idx2 = findLargestIndex(b.slice(idx + 1));
  console.log([idx, idx2]);
  return 10 * b[idx] + b[idx + 1 + idx2];
};

const totalJoltage = (n) => R.compose(
  R.sum,
  R.map(findJoltage(n)))(batteries);

console.log(totalJoltage(2));
console.log(totalJoltage(12));
