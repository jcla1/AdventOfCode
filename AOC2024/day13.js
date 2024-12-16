const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const clawRegEx = /Button A: X\+(\d+), Y\+(\d+)\nButton B: X\+(\d+), Y\+(\d+)\nPrize: X=(\d+), Y=(\d+)/

const solve2x2 = ([a, c], [b, d], [y1, y2]) => {
  const det = a * d - b * c;
  if (det == 0) return null;
  return [(y1*d -b*y2)/det, (a*y2 - y1*c)/det];
}

const clawMachines = R.compose(
  R.map(R.compose(
    R.splitEvery(2),
    U.toIntArr,
    R.drop(1),
    R.match(clawRegEx))),
  R.split('\n\n'))(input);

const isInt = (n) => Number.isInteger(n);
const buttonPresses = R.compose(
  R.filter(([y1, y2]) => isInt(y1) && isInt(y2)),
  R.map(R.apply(solve2x2)))(clawMachines);

const totalCost = R.compose(
  R.sum,
  R.map(([x, y]) => 3*x + y))(buttonPresses);
console.log(totalCost);


const correctedButtonPresses = R.compose(
  R.filter(([y1, y2]) => isInt(y1) && isInt(y2)),
  R.map(R.apply(solve2x2)),
  R.map(([a, b, [y1, y2]]) => [a, b, [10000000000000 + y1, 10000000000000 + y2]]))(clawMachines);

const correctedTotalCost = R.compose(
  R.sum,
  R.map(([x, y]) => 3*x + y))(correctedButtonPresses);
console.log(correctedTotalCost);
