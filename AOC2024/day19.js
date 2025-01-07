const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const [towels, rows] = R.compose(
    ([a, b]) => [R.split(', ', a), R.split('\n', b)],
    R.split('\n\n'))(input);

const getNextTowels = R.curry((row, ss) =>
  R.map(R.concat(ss), R.filter((t) => R.startsWith(ss + t, row), towels)));

const isPossible = (row) => !!U.astar('', row, getNextTowels(row));
const numPossible = R.count(isPossible, rows);
console.log(numPossible);

const countCombinations = R.memoizeWith(R.identity, (substr) => {
  if (substr.length === 0) return 1;
  return R.compose(
      R.sum,
      R.map((t) => {
        if (R.startsWith(t, substr)) {
          return countCombinations(R.drop(t.length, substr));
        }
        return 0;
      }))(towels);
});

const numCombinations = R.compose(
    R.sum,
    R.map(countCombinations))(rows);
console.log(numCombinations);
