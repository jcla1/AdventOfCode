const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const addUpMuls = R.compose(
    R.sum,
    R.map(R.compose(
        R.apply(R.multiply),
        U.toIntArr,
        R.match(/\d{1,3}/g))),
    R.match(/mul\((\d{1,3}),(\d{1,3})\)/g));

console.log(addUpMuls(input));

const conditionalRes = R.compose(
    R.sum,
    R.map(addUpMuls),
    R.unnest,
    R.map(R.drop(1)),
    R.map(R.split('do()')),
    R.split('don\'t()'),
    R.concat('do()'))(input);
console.log(conditionalRes);
