const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

const input = fs.readFileSync('inputs/day03.input', 'utf8').trim();

const itemPriority = (L) => {
  if (U.isUpperCase(L)) return L.charCodeAt(0) - 'A'.charCodeAt(0) + 1 + 26;
  return L.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
};

const intersectionScores = R.compose(
    R.sum,
    R.map(R.compose(
        R.compose(itemPriority, R.head),
        U.multiIntersection)));

const rucksackScores = R.compose(
    intersectionScores,
    R.map((s) => R.splitAt(R.length(s) / 2, s)),
    R.split('\n'))(input);

console.log(rucksackScores);

const badgeScores = R.compose(
    intersectionScores,
    R.splitEvery(3),
    R.split('\n'))(input);

console.log(badgeScores);
