const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

const input = fs.readFileSync('inputs/day01.input', 'utf8').trim();

const valueSum = R.compose(
    R.sum,
    U.toIntArr,
    R.map(R.compose(
        R.join(''),
        (xs) => [R.head(xs), R.last(xs)],
        R.match(/[0-9]/g))),
    R.split('\n'))(input);

console.log(valueSum);

const digitValues = {
  'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9,
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
};

const parseDigit = (x) => digitValues[x];
const lookaheadRegEx = /(?=([0-9]|one|two|three|four|five|six|seven|eight|nine))/g;

const wordValueSum = R.compose(
    R.sum,
    U.toIntArr,
    R.map(R.compose(
        R.join(''),
        R.map(parseDigit),
        (xs) => [R.head(xs), R.last(xs)],
        R.map(R.nth(1)),
        (s) => Array.from(s.matchAll(lookaheadRegEx)))),
    R.split('\n'))(input);

console.log(wordValueSum);
