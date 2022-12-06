const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('inputs/day06.input', 'utf8').trim();

const signalStart = (n) => R.compose(
    R.add(n),
    R.findIndex((s) => R.length(s) == n),
    R.map(R.uniq),
    R.aperture(n))(input);

console.log(signalStart(4));
console.log(signalStart(14));
