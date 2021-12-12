const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('day1.input', 'utf8').trim();

const nums = R.compose(
    R.map(parseInt),
    R.split('\n'))(input);

// Find number of increases in list.
const noInc = R.compose(
    R.length,
    R.filter(R.gt(0)),
    R.map(R.apply(R.subtract)),
    R.aperture(2));


console.log(noInc(nums));

const part2 = R.compose(
    noInc,
    R.map(R.sum),
    R.aperture(3))(nums);

console.log(part2);
