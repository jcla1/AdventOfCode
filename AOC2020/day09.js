const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

const input = fs.readFileSync('inputs/day09.input', 'utf8').trim();

const nums = R.compose(R.map(parseInt), R.split('\n'))(input);

const isSum = (nums, target) => R.compose(
    R.reduce(R.or, false),
    R.chain((a) => R.map((b) => a + b == target, nums)))(nums);
const isSumOfInit = (xs) => {
  const [nums, [target]] = R.splitAt(-1, xs);
  return isSum(nums, target);
};

const firstMisencoded = R.compose(
    R.nth(-1), R.nth(-1),
    R.filter(R.o(R.not, isSumOfInit)),
    R.aperture(25 + 1))(nums);

console.log(firstMisencoded);

const weakness = R.compose(
    R.sum, R.juxt([U.minimum, U.maximum]),
    R.find((xs) => R.sum(xs) === firstMisencoded),
    R.chain((size) => R.aperture(size, nums)),
)(R.range(2, R.length(nums)));

console.log(weakness);
