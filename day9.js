const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('day9.input', 'utf8').trim();

const board = R.compose(
    R.map(R.o(R.map(parseInt), R.split(''))),
    R.split('\n'))(input);

const noRows = R.length(board);
const noCols = R.length(board[0]);

const neighbours = (i, j) => {
  const candidates = [[i-1, j], [i+1, j], [i, j+1], [i, j-1]];
  return R.filter(
      ([s, t]) => 0 <= s && s < noRows && 0 <= t && t < noCols,
      candidates);
};

const access = (board, [s, t]) => board[s][t];
const lowPoints = R.map((i) => R.map((j) => {
  const curVal = access(board, [i, j]);
  const neighVals = R.map((pos) => access(board, pos), neighbours(i, j));
  return R.allPass(R.map(R.gt, neighVals))(curVal) ? curVal + 1 : 0;
}, R.range(0, noCols)), R.range(0, noRows));

const boardSum = R.o(R.sum, R.map(R.sum));

const risk = boardSum(lowPoints);
console.log(risk);

const justNines = R.map(R.map((v) => v === 9 ? -1 : 0));

const fillBasin = (board, startPos) => {
  // we want to stay functional!
  board = R.clone(board);

  let stack = [startPos]; let size = 0;
  while (R.length(stack) !== 0) {
    [[i, j], ...stack] = stack;

    if (board[i][j] !== 0) continue;

    // mark the current position in the basin as visited.
    board[i][j] = 1; size++;
    stack = R.concat(
        stack,
        R.filter(([s, t]) => board[s][t] !== -1, neighbours(i, j)));
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

