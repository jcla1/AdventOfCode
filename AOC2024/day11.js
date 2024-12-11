const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const hasEvenNumDigits = (n) => n.toString().length % 2 === 0;

const applyRule = (n) => {
  if (n === 0) return [1];
  if (hasEvenNumDigits(n)) {
    const digits = n.toString();
    const len = digits.length;

    return [parseInt(digits.slice(0, len / 2)), parseInt(digits.slice(len / 2, len))];
  }
  return [2024 * n];
};

const blink = R.chain(applyRule);

const initialLine = R.compose(U.toIntArr, R.split(' '))(input);
let line = R.clone(initialLine);
for (let i = 0; i < 25; i++) {
  line = blink(line);
}
console.log(line.length);

const betterBlink = (n, line) => {
  let lineM = R.fromPairs(R.map((x) => [x, 1], line));
  for (let i = 0; i < n; i++) {
    lineM = R.compose(
      R.map(R.compose(R.sum, R.map(R.nth(1)))),
      R.groupBy(R.head),
      R.unnest,
      R.map(([stone, num]) => R.map((i) => [i, num], applyRule(parseInt(stone)))),
      R.toPairs)(lineM)
  }
  return lineM;
};

console.log(R.compose(R.sum, R.values)(betterBlink(75, initialLine)));
