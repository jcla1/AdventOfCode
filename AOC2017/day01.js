const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('inputs/day01.input', 'utf8').trim();

const nums = R.compose(
    R.map(parseInt),
    R.split(''))(input);

const shift = R.curry((n, xs) => R.concat(R.drop(n, xs), R.take(n, xs)));

const findSum = R.compose(
    R.sum,
    R.zipWith((a, b) => a === b ? a : 0));

console.log(findSum(nums, shift(1, nums)));

const n = R.length(nums);
console.log(findSum(nums, shift(n/2, nums)));

