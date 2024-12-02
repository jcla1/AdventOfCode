const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

const input = fs.readFileSync('inputs/day01.input', 'utf8').trim();
const nums = R.compose(
  R.map(U.toIntArr),
  R.map(R.split(/\s+/)),
  R.split('\n'))(input);

const allSafe = R.compose()(nums);
