const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

const input = fs.readFileSync('inputs/day09.input', 'utf8').trim();

const board = R.compose(
    R.map(R.o(R.map(parseInt), R.split(''))),
    R.split('\n'))(input);

const noRows = R.length(board);
const noCols = R.length(board[0]);

const lowPoints = R.map((i) => R.map((j) => {
  const curVal = U.get(board, [i, j]);
  const neighVals = R.map((pos) => U.get(board, pos),
      U.getNeighbours(board, [i, j]));
  return R.allPass(R.map(R.gt, neighVals))(curVal) ? curVal + 1 : 0;
}, R.range(0, noCols)), R.range(0, noRows));


const risk = U.sumBoard(lowPoints);
console.log(risk);

const justNines = R.map(R.map((v) => v === 9 ? -1 : 0));

const fillBasin = (board, startPos) => {
  // we want to stay functional!
  board = R.clone(board);

  let stack = [startPos]; let size = 0;
  while (R.length(stack) !== 0) {
    [[i, j], ...stack] = stack;

    if (U.get(board, [i, j]) !== 0) continue;

    // mark the current position in the basin as visited.
    board[i][j] = 1; size++;
    stack = R.concat(
        stack,
        R.filter(([s, t]) => U.get(board, [s, t]) !== -1,
            U.getNeighbours(board, [i, j])));
  }

  return [board, size];
};

const getBasinSizes = (board) => {
  const basinSizes = [];
  for (let i = 0; i < R.length(board); i++) {
    for (let j = 0; j < R.length(board[i]); j++) {
      if (board[i][j] === 0) {
        [board, size] = fillBasin(board, [i, j]);
        basinSizes.push(size);
      }
    }
  }
  return basinSizes;
};

const basinSizes = getBasinSizes(justNines(board));
console.log(R.compose(
    R.product,
    R.takeLast(3),
    R.sortBy(R.identity))(basinSizes));

