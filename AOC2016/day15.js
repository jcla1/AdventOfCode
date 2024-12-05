const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

// this puzzle is just an application of the Chinese Remainder Theorem
const discConfigs = R.compose(
    R.map(R.compose(
        R.adjust(1, R.negate),
        U.toIntArr,
        R.drop(1),
        R.match(/^Disc #\d+ has (\d+) positions; at time=0, it is at position (\d+)\.$/))),
    R.split('\n'))(input);

const adjustedConfigs = discConfigs.map(([a, b], i) => [a, b - i - 1] );

// not even sieving is necessary here, brute force is fast enough.
const solveCongruences = (cc) => {
  const N = R.reduce(R.multiply, 1, R.map(R.head, cc));
  for (let x = 0; x < N; x++) {
    if (R.all(([a, b]) => (x - b) % a === 0, cc)) return x;
  }
  console.error('No solution found');
};

console.log(solveCongruences(adjustedConfigs));

adjustedConfigs.push([11, -adjustedConfigs.length -1]);
console.log(solveCongruences(adjustedConfigs));
