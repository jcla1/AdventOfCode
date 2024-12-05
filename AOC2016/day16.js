const R = require('ramda');
const U = require('./util.js');

const input = '11110010111001001';
const smallDiskSize = 272;
const largeDiskSize = 35651584;

const startData = R.compose(U.toIntArr, R.split(''))(input);

const calcChecksum = (dd) => {
  if (dd.length % 2 === 1) return dd;
  return R.compose(
    calcChecksum,
    R.map(([a, b]) => a === b ? 1 : 0),
    R.splitEvery(2))(dd);
};

const fillDisk = (a, size) => {
  const flipBit = (x) => x === 0 ? 1 : 0;

  let dd = a;
  while (dd.length < size) {
    dd = [...dd, 0, ...R.compose(
      R.map(flipBit),
      R.reverse)(dd)];
  }
  return R.take(size, dd);
};

const solve = (ds) => console.log(R.compose(
  R.join(''),
  calcChecksum,
  fillDisk)(startData, ds));

solve(smallDiskSize);
// the naive way is still fast enough for me
solve(largeDiskSize);
