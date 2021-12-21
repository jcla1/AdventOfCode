const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

const input = fs.readFileSync('inputs/day05.input', 'utf8').trim();

const seatDesc = R.split('\n', input);

const seatIDs = R.map(R.o(
    (s) => parseInt(s, 2),
    R.replace(/F|B|L|R/g, (c) => R.includes(c, 'BR') ? 1 : 0)))(seatDesc);

console.log(U.maximum(seatIDs));

const missingSeat = R.compose(
    R.nth(0),
    R.without(seatIDs),
    R.apply(R.range),
    R.juxt([U.minimum, U.maximum]))(seatIDs);
console.log(missingSeat);
