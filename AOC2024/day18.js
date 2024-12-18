const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const [maxX, maxY] = [70, 70];
const initialTake = 1024;

const corruptedLocations = R.compose(
  R.map(R.compose(
    U.toIntArr,
    R.split(','))),
  R.split('\n'))(input);

const numCorrupted = corruptedLocations.length;
const [startPos, endPos] = [[0, 0], [maxX, maxY]];

const isCorrupted = R.curry((toTake, pos) => R.any(R.equals(pos), R.take(toTake, corruptedLocations)));

const getNeighbours = R.curry((toTake, [x, y]) => R.filter(
    ([x, y]) => x >= 0 && x <= maxX && y >= 0 && y <= maxY && !isCorrupted(toTake, [x, y]),
    [[x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y]]));

const shortestPath = U.astar(startPos, endPos, getNeighbours(initialTake));
console.log(shortestPath.length - 1);

const hasPath = (toTake) => !!U.astar(startPos, endPos, getNeighbours(toTake));

let curPath = [];
let [l, r] = [initialTake, numCorrupted];
let m;
while (l <= r) {
  m = Math.floor((l + r) / 2);

  if (hasPath(m)) l = m + 1;
  else r = m - 1;
}
console.log(corruptedLocations[m]);
