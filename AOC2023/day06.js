const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

const input = fs.readFileSync('inputs/day06.input', 'utf8').trim();

const [Ts, Ds] = R.compose(
    R.map(R.compose(
        U.toIntArr,
        R.drop(1),
        R.split(/\s+/),
        R.nth(0), R.drop(1),
        R.match(/\w+:(.*)$/))),
    R.split('\n'))(input);

const numOpportunities = (T, D) => 1 + Math.floor(T/2 + Math.sqrt(T*T/4 - D)) - Math.ceil(T/2 - Math.sqrt(T*T/4 - D))

const totalCount = R.product(R.zipWith(numOpportunities, Ts, Ds))
console.log(totalCount)

const T = parseInt(R.join('', Ts));
const D = parseInt(R.join('', Ds));

console.log(numOpportunities(T, D));
