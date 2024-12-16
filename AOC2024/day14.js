const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const boardSize = [101, 103];

const initialStates = R.compose(
  R.map(R.compose(
    R.splitEvery(2),
    U.toIntArr,
    R.drop(1),
    R.match(/p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/))),
  R.split('\n'))(input);

// because JS's modulo operator does not quite work as intended we must add the
// size of the grid in each step to ensure we land in the smallest _positive_
// range.
const advanceRobot = R.curry(([sx, sy], [[x, y], [dx, dy]]) => [[(x + dx + sx) % sx, (y + dy + sy) % sy], [dx, dy]]);

let robotState = R.clone(initialStates);
for (let i = 0; i < 100; i++) {
  robotState = R.map(advanceRobot(boardSize), robotState);
}

const getSafetyFactor = (states) => {
  const q1 = R.filter(([[x, y], _]) => x <= boardSize[0]/2 - 1 && y <= boardSize[1]/2 - 1, states);
  const q2 = R.filter(([[x, y], _]) => x > boardSize[0]/2 && y <= boardSize[1]/2 - 1, states);
  const q3 = R.filter(([[x, y], _]) => x <= boardSize[0]/2 - 1 && y > boardSize[1]/2, states);
  const q4 = R.filter(([[x, y], _]) => x > boardSize[0]/2 && y > boardSize[1]/2, states);
  return q1.length * q2.length * q3.length * q4.length;
};
console.log(getSafetyFactor(robotState));

robotState = R.clone(initialStates);
let minEntropy = Infinity;
let minEntropyIdx = -1;
let minEntropyState = null;

for (let i = 0; i < 10000; i++) {
  robotState = R.map(advanceRobot(boardSize), robotState);
  const entropy = getSafetyFactor(robotState);

  if (entropy < minEntropy) {
    minEntropy = entropy;
    minEntropyIdx = i + 1;
    minEntropyState = R.clone(robotState);
  }
}

console.log(minEntropyIdx);
