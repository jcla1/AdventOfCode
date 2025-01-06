const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);
const keysOrLocks = R.split('\n\n', input);

const toHorizontal = R.compose(
  R.transpose,
  R.map(R.split('')),
  R.split('\n'));

const isLock = R.compose(
  R.all(R.equals('#')),
  R.map(R.head));

const {true: locks, false: keys} = R.compose(
  R.groupBy(isLock),
  R.map(toHorizontal))(keysOrLocks);

const toPinning = R.map(R.compose(
  R.dec,
  R.count(R.equals('#'))));

const lockPinnings = R.map(toPinning, locks);
const keyPinnings = R.map(toPinning, keys);

const keyFitsLock = R.compose(
  R.all(R.gte(5)),
  R.zipWith(R.add));

const numKeyFits = R.compose(
  R.length,
  R.filter(R.apply(keyFitsLock)),
  R.xprod)(lockPinnings, keyPinnings);

console.log(numKeyFits);
