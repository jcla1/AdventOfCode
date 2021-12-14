const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('inputs/day11.input', 'utf8').trim();

const mapBoard = (f) => R.map(R.map(f));
const cleanBoard = mapBoard(R.max(0));
const access = (board, [i, j]) => board[i][j];
const boardIndicies = (board) => {
  const height = R.length(board);
  const width = R.length(board[0]);
  return R.chain(
      (i) => R.map((j) => [i, j], R.range(0, width)),
      R.range(0, height));
};

const withinBoard = R.curry((board, [i, j]) => {
  const height = R.length(board);
  const width = R.length(board[0]);
  return 0 <= i && i < height && 0 <= j && j < width;
});

const getNeighbours = R.curry((board, [i, j]) => {
  return R.filter(withinBoard(board),
      [[i-1, j-1], [i-1, j], [i-1, j+1],
        [i, j-1], [i, j+1],
        [i+1, j-1], [i+1, j], [i+1, j+1]]);
});

const willFlash = R.compose(
    R.reduce(R.or, false),
    R.flatten,
    mapBoard(R.lte(10)));

const flash = (board) => {
  const flashPoints = R.filter(
      (p) => access(board, p) >= 10,
      boardIndicies(board));

  board = R.clone(board);
  const newBoard = R.reduce((board, [i, j]) => {
    board[i][j] = -1;
    return board;
  }, board, flashPoints);

  const addList = R.chain(getNeighbours(board), flashPoints);
  addList.forEach((pos) => {
    const [s, t] = pos;
    if (board[s][t] !== -1) board[s][t] += 1;
  });

  return [R.length(flashPoints), newBoard];
};

const doStep = R.compose(
    ([count, board]) => [count, cleanBoard(board)],
    R.until(R.compose(R.not, willFlash, R.nth(1)), ([total, board]) => {
      const [count, newBoard] = flash(board);
      return [total + count, newBoard];
    }),
    (board) => [0, board],
    mapBoard(R.inc));

const board = R.compose(
    R.map(R.map(parseInt)),
    R.map(R.split('')),
    R.split('\n'))(input);

const noFlashes = R.compose(
    R.nth(0),
    R.reduce(([total, board], _) => {
      const [count, newBoard] = doStep(board);
      return [total + count, newBoard];
    }, [0, board]))(R.range(0, 100));

console.log(noFlashes);

const firstAllFlash = R.reduce((board, i) => {
  if (R.all(R.equals(0), R.flatten(board))) return R.reduced(i);
  return doStep(board)[1];
}, board, R.range(0, 100000));

console.log(firstAllFlash);
