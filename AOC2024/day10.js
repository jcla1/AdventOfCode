const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const board = R.compose(
  R.map(R.compose(
    U.toIntArr,
    R.split(''))),
  R.split('\n'))(input);

const generateCoords = R.compose(
  R.apply(R.xprod),
  R.map(R.range(0)),
  (b) => [b.length, b[0].length]);

const allCoords = generateCoords(board);

const isTH = (p) => board[p[0]][p[1]] == 0;
const isPeak = (p) => board[p[0]][p[1]] == 9;
const trailHeads = R.filter(isTH, allCoords);

const getValidNeighbours = (board, [i, j]) => {
  const height = board.length;
  const width = board[0].length;

  return R.filter(([k, l]) =>
       k >= 0
    && k < height
    && l >= 0
    && l < width
    && board[k][l] == board[i][j] + 1,
      [[i-1, j], [i, j-1], [i, j+1], [i+1, j]]);
};

const getTHPaths = (p) => {
  let toExplore = [[p]];
  let foundPeaks = [];

  while (toExplore.length > 0) {
    const p = toExplore.pop();
    const neighbours = getValidNeighbours(board, p[0]);

    for (let n of neighbours) {
      if (isPeak(n)) {
        foundPeaks.push([n, ...p]);
      } else {
        toExplore.push([n, ...p]);
      }
    }
  }

  return foundPeaks;
};

const thPaths = R.map(getTHPaths, trailHeads);

const totalScore = R.compose(
  R.sum,
  R.map(R.compose(
    R.length,
    R.uniq,
    R.map(R.head))))(thPaths);
console.log(totalScore);

const totalRating = R.compose(
  R.sum,
  R.map(R.length))(thPaths);
console.log(totalRating);
