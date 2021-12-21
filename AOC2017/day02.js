const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

const input = fs.readFileSync('inputs/day02.input', 'utf8').trim();

const rows = R.compose(
    R.map(R.o(R.map(parseInt), R.split(/\s+/))),
    R.split('\n'))(input);

const checksum = R.compose(
    R.sum,
    R.map(R.o(
        R.apply(R.subtract),
        R.juxt([U.maximum, U.minimum]))))(rows);

console.log(checksum);

const evenQuot = R.compose(
    R.apply(R.divide), R.nth(0),
    R.filter(([a, b]) => a > b && a % b === 0),
    (row) => R.xprod(row, row));

const result = R.compose(
    R.sum,
    R.map(evenQuot))(rows);

console.log(result);

