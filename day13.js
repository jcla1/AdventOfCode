const R = require('ramda');
const fs = require('fs');

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

const sign = (x) => x === 0 ? 0 : (x > 0 ? 1 : -1);
const addBoards = R.zipWith(R.zipWith(R.add));
const boardToString = R.compose(
    R.join('\n'),
    R.map(R.join('')),
    R.map(R.map((n) => n > 0 ? '#' : '.')));

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
  const foldedBoard = addBoards(top, R.reverse(R.drop(1, bottom)));

  return transformFn[dir](foldedBoard);
};

const board = R.reduce(markBoard, [], boardPos);
const foldedBoard = R.reduce(doFold, board, folds);

console.log(R.compose(
    R.sum,
    R.map(sign),
    R.flatten)(doFold(board, folds[0])));

console.log(boardToString(foldedBoard));
