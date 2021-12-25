const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

const input = fs.readFileSync('inputs/day25.input', 'utf8').trim();

const board = R.compose(
    R.map(R.split('')),
    R.split('\n'))(input);

const pre = (board, [i, j]) => {
  const height = R.length(board);
  const width = R.length(board[0]);
  return [i % height, j % width];
};

const moveEasters = (board, cucumber = '>') => {
  const idxs = U.getIndicies(board);
  const eastMovers = R.filter(([i, j]) => {
    return U.get(board, [i, j]) === cucumber &&
           U.get(board, pre(board, [i, j + 1])) === '.';
  }, idxs);

  R.forEach(([i, j]) => {
    U.set(board, [i, j], '.');
    U.set(board, pre(board, [i, j + 1]), cucumber);
  }, eastMovers);

  return eastMovers.length > 0;
};

const stepThru = (board) => {
  const anyEast = moveEasters(board);
  board = R.transpose(board);
  const anySouth = moveEasters(board, 'v');
  board = R.transpose(board);

  // returns if the board has been modified
  return [board, anyEast || anySouth];
};

let modBoard = board;
let noSteps = 1;
let mod = true;
while (([modBoard, mod] = stepThru(modBoard)) && mod) noSteps++;
console.log(noSteps);
