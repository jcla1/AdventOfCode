const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const findLargestIndex = (xs, left, right) => left + xs.findIndex(Math.max(...xs.slice(left, right));

const batteries = R.compose(
  R.map(R.o(U.toIntArr, R.split(''))),
  R.split('\n'))(input);

const findJoltage = (n) => (b) => {
  let joltage = [];

  let i = 0;
  while (joltage.length < n) {
    const idxOfLargest = findLargestIndex(b, i, b.length - (n - joltage.length - 1));
    joltage.push(b[idxOfLargest]);
    i = idxOfLargest + 1;
  }

  return parseInt(joltage.join(''));
};

const totalJoltage = (n) => R.compose(
  R.sum,
  R.map(findJoltage(n)))(batteries);

console.log(totalJoltage(2));
console.log(totalJoltage(12));
