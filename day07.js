const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('inputs/day07.input', 'utf8').trim();

const crabPos = R.compose(
    R.map(parseInt),
    R.split(','))(input);

const maximum = R.reduce(R.max, -Infinity);
const minimum = R.reduce(R.min, Infinity);

const costToMedian = (crabs) => {
  // The median of the crab positions if of course the minimizer
  // of distances, duh. But only if the cost is linear in distance.
  const median = R.median(crabs);
  return R.compose(R.sum, R.map((c) => Math.abs(median - c)))(crabs);
};

// I'm surprised this is actually fast enough.
const lowestCost = (costFn, crabs) => R.compose(
    minimum,
    R.map((pos) =>
    // It would be nice to remove the `crabs` dependency on this
    // line so that the function can be more point-free.
      R.reduce((s, c) => s + costFn(Math.abs(pos - c)), 0, crabs)),
    R.apply(R.range),
    R.juxt([minimum, R.compose(R.inc, maximum)]))(crabs);

console.log(costToMedian(crabPos));
// console.log(R.identity, crabPos));
console.log(lowestCost((n) => n * (n+1) / 2, crabPos));
