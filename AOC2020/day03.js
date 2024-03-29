const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

const input = fs.readFileSync('inputs/day03.input', 'utf8').trim();

const forest = R.compose(R.map(R.split('')), R.split('\n'))(input);
const height = R.length(forest);
const width = R.length(forest[0]);

const moveBy = R.curry(([i, j], [s, t]) => [i + s, (j + t) % width]);

const countTreesOnPath = (forest, diff) => {
  let pos = [0, 0];
  let treeCount = 0;

  while (pos[0] < height) {
    if (U.get(forest, pos) === '#') treeCount++;
    pos = moveBy(diff, pos);
  }
  return treeCount;
};

console.log(countTreesOnPath(forest, [1, 3]));

console.log(R.compose(
    R.product,
    R.map((diff) => countTreesOnPath(forest, diff)),
)([[1, 1], [1, 3], [1, 5], [1, 7], [2, 1]]));
