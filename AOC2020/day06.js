const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('inputs/day06.input', 'utf8').trim();

const alphabet = 'abcdefghijklmnopqrstuvwxyz';

const answers = R.compose(
    R.map(R.split('\n')),
    R.split('\n\n'))(input);

const answerUnion = R.map(R.reduce(R.union, []), answers);
const answerIntersection = R.map(R.reduce(R.intersection, alphabet), answers);

const sumOfCounts = R.o(R.sum, R.map(R.length));
console.log(sumOfCounts(answerUnion));
console.log(sumOfCounts(answerIntersection));
