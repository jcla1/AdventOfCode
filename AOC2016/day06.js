const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const byFreq = R.compose(
  R.map(R.head),
  R.sortBy(R.nth(1)),
  R.toPairs,
  R.countBy(R.identity));

const sortedChars = R.compose(
  R.map(byFreq),
  R.transpose,
  R.map(R.split('')),
  R.split('\n'))(input);

const messageMostFreq = R.compose(
  R.join(''),
  R.map(R.last))(sortedChars);
console.log(messageMostFreq);

const messageLeastFreq = R.compose(
  R.join(''),
  R.map(R.head))(sortedChars);
console.log(messageLeastFreq);
