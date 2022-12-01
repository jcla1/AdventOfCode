const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

const input = fs.readFileSync('inputs/day01.input', 'utf8').trim();

const sortedElvesCalories = R.compose(
    R.sort(R.descend(R.identity)),
    R.map(R.compose(
        R.sum,
        U.toIntArr,
        R.split('\n'))),
    R.split('\n\n'))(input);

console.log(sortedElvesCalories[0]);
console.log(R.o(R.sum, R.take(3))(sortedElvesCalories));
