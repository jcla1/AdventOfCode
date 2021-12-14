const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('inputs/day10.input', 'utf8').trim();

const maximum = R.reduce(R.max, -Infinity);
const ratings = R.compose(
    R.sortBy(R.identity),
    (xs) => R.concat([0, maximum(xs) + 3], xs),
    R.map(parseInt),
    R.split('\n'))(input);

const diffTallies = R.compose(
    R.map(R.length),
    R.groupBy(R.identity),
    R.map(R.apply(R.flip(R.subtract))),
    R.aperture(2))(ratings);

console.log(diffTallies[1] * diffTallies[3]);

const findArrangements = R.compose(
    R.reduce((acc, n) => acc * (Math.pow(2, n) - (n === 3 ? 1 : 0)), 1),
    R.filter(R.lte(1)),
    R.map(R.o(R.dec, R.length)),
    R.split('3'),
    R.join(''),
    R.map(R.apply(R.flip(R.subtract))),
    R.aperture(2));


console.log(findArrangements(ratings));
