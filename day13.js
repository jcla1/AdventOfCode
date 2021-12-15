const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

const input = fs.readFileSync('inputs/day13.input', 'utf8').trim();

const [boardInfo, foldDirections] = R.compose(
    R.map(R.split('\n')),
    R.split('\n\n'))(input);

const folds = R.compose(R.map(R.compose(
    ([dir, idx]) => [dir, parseInt(idx)],
    R.slice(1, 3),
    R.match(/^fold along (.)=(\d+)$/))))(foldDirections);

const boardPos = R.compose(R.map(R.compose(
    R.map(parseInt),
    R.split(','))))(boardInfo);

const extendBoard = (board, size) => {
  if (R.equals(board, [])) return R.map((_) => [0], R.range(0, size + 1));
  const height = R.length(board);
  const width = R.length(board[0]);

  return R.concat(board, R.map((_) => R.repeat(0, width),
      R.range(0, size - height + 1)));
};

// WARNING: potentially mutates the board
const markBoard = (board, p) => {
  const height = R.length(board);
  if (height <= p[1]) board = extendBoard(board, p[1]);

  const width = R.length(board[0]);
  if (width <= p[0]) board = R.transpose(extendBoard(R.transpose(board), p[0]));

  board[p[1]][p[0]] += 1;

  return board;
};

const doFold = (board, [dir, idx]) => {
  const transformFn = {'y': R.identity, 'x': R.transpose};
  board = transformFn[dir](board);

  const [top, bottom] = R.splitAt(idx, board);
  const foldedBoard = U.addBoards(top, R.reverse(R.drop(1, bottom)));

  return transformFn[dir](foldedBoard);
};

const board = R.reduce(markBoard, [], boardPos);
const foldedBoard = R.reduce(doFold, board, folds);

console.log(R.compose(
    R.sum,
    R.map(U.sign),
    R.flatten)(doFold(board, folds[0])));

console.log(R.o(
    U.boardToString,
    U.mapBoard((n) => n > 0 ? '#' : '.'))(foldedBoard));
