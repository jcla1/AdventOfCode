const {sum, map} = require('ramda');
const input = require('./lib/utils').parseFileAsNumbers('01');

// double bitwise NOT is a faster and shorter alternative
// to the Math.floor function.
const fuel = (m) => ~~(m / 3) - 2;
const totalFuel = (m) => m <= 6 ? 0 : fuel(m) + totalFuel(fuel(m));

module.exports = {
  a: sum(map(fuel, input)),
  b: sum(map(totalFuel, input)),
};
