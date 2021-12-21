const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('inputs/day06.input', 'utf8').trim();

const initialFish = R.compose(
    R.map((p) => [parseInt(p[0]), R.length(p[1])]),
    R.toPairs,
    R.groupBy(R.identity),
    R.split(','))(input);

const spawnFish = (p) => {
  const maturityDays = parseInt(p[0]);
  return maturityDays === 0 ?
    [[6, p[1]], [8, p[1]]] : [[maturityDays - 1, p[1]]];
};

const combineFish = R.compose(
    R.map(([m, counts]) => [parseInt(m), R.o(R.sum, R.map(R.nth(1)))(counts)]),
    R.toPairs,
    R.groupBy(R.nth(0)));

const finalFishes = R.compose(
    R.sum,
    R.map(R.nth(1)),
    R.reduce(
        R.compose(combineFish, R.chain(spawnFish)),
        initialFish),
    R.range(0));

console.log(finalFishes(80));
console.log(finalFishes(256));
