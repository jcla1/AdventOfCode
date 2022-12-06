const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

const input = fs.readFileSync('inputs/day04.input', 'utf8').trim();

const contained = (l, r) => (l[0] <= r[0] && l[1] >= r[1]) ||
                            (l[0] >= r[0] && l[1] <= r[1]);
const overlap = (l, r) => contained(l, r) ||
                          (r[0] <= l[0] && l[0] <= r[1]) ||
                          (r[0] <= l[1] && l[1] <= r[1]);

const assignments = R.compose(
    R.map(R.compose(
        R.splitAt(2),
        U.toIntArr,
        R.take(4),
        R.drop(1),
        R.match(/([0-9]+)-([0-9]+),([0-9]+)-([0-9]+)/))),
    R.split('\n'))(input);

const numEnclosed = R.compose(
    R.length,
    R.filter(R.apply(contained)))(assignments);

const numOverlap = R.compose(
    R.length,
    R.filter(R.apply(overlap)))(assignments);

console.log(numEnclosed);
console.log(numOverlap);
