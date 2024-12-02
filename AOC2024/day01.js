const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);
const nums = R.compose(
    R.transpose,
    R.map(R.map((n) => parseInt(n))),
    R.map(R.split(/\s+/)),
    R.split('\n'))(input);

const total = R.compose(
    R.sum,
    R.apply(R.zipWith((a, b) => Math.abs(a - b))),
    R.map(R.sort((a, b) => a - b)))(nums);

console.log(total);

const freq = R.compose(
    R.map(R.length),
    R.groupBy(R.identity),
    R.nth(1))(nums);

const sum = R.compose(
    R.sum,
    R.map((n) => freq[n] ? freq[n] * n : 0),
    R.nth(0))(nums);

console.log(sum);
