const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('inputs/day03.input', 'utf8').trim();

const nums = R.compose(
    R.map(R.pipe(R.split(''), R.map(parseInt))),
    R.split('\n'))(input);

const majorityBits = (nums) => {
  const noRows = R.length(nums);
  const noCols = R.length(nums[0]);

  return R.compose(
      R.map((n) => 1 * R.lte(1 / 2, n / noRows)),
      R.reduce(R.zipWith(R.add), R.repeat(0, noCols)))(nums);
};

// Given an array of binary digits return as decimal.
const toNum = (xs) => parseInt(R.join('', xs), 2);

const gamma = toNum(majorityBits(nums));
const epsilon = toNum(R.map((n) => (1 - n + 2) % 2, majorityBits(nums)));

console.log(gamma * epsilon);

const getRating = (cmp) => {
  const noCols = R.length(nums[0]);

  return R.compose(
      toNum,
      R.nth(0),
      R.reduceWhile(
          R.o(R.lt(1), R.length),
          (xs, n) => {
            const mb = majorityBits(xs)[n];
            return R.filter((x) => cmp(x[n], mb), xs);
          }, nums))(R.range(0, noCols));
};

const oxygen = getRating(R.equals);
const co2 = getRating(R.compose(R.not, R.equals));

console.log(oxygen * co2);
