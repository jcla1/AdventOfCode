const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('inputs/day11.input', 'utf8').trim();

const seatBoard = R.compose(
    R.map(R.split('')),
    R.split('\n'))(input);

// fixedPoint :: Eq a => (a -> a) -> a -> a
const fixedPoint = R.curry((f, a) => {
  while (true) {
    const prev = R.clone(a);
    const next = f(a);
    if (R.equals(next, prev)) return next;
  }
});

const printBoard = R.compose(console.log, R.join('\n'), R.map(R.join('')));

// access :: [[a]] -> (Int, Int) -> a
const access = R.curry((board, p) => board[p[0]][p[1]]);

// WARNING: the function `set` mutates the board.
// set :: [[a]] -> (Int, Int) -> a -> [[a]]
const set = R.curry((board, p, val) => { board[p[0]][p[1]] = val; return board});

const indicies = (board) => {
  const height = R.length(board);
  if (height === 0) return [];
  const width = R.length(board[0]);

  return R.chain(i => R.map(R.pair(i), R.range(0, width)), R.range(0, height));
};

const mapBoard = R.curry((f) => R.map(R.map(f)));

// findIndiciesOnBoard :: (a -> Bool) -> [[a]] -> [(Int, Int)]
const findIndiciesOnBoard = R.curry((f, board) =>
    R.filter(p => f(access(board, p)), indicies(board)));

// onBoard :: [[a]] -> (Int, Int) -> Bool
const onBoard = R.curry((board, [i, j]) => {
  const height = R.length(board);
  if (height === 0) return false;
  const width = R.length(board[0]);

  return 0 <= i && i < height && 0 <= j && j < width;
});

const getNeighbours = R.curry((board, [i, j]) => R.filter(onBoard(board), [
  [i-1, j-1], [i-1, j], [i-1, j+1],
  [i,   j-1],           [i,   j+1],
  [i+1, j-1], [i+1, j], [i+1, j+1]
]));

const stepPart1 = (board) => {
  const seatPos = findIndiciesOnBoard(R.o(R.not, R.equals('.')), board);

  const ops = R.reduce((ops, p) => {
    const seatState = access(board, p);
    const seatNeighbours = R.map(access(board), getNeighbours(board, p));

    if (seatState === 'L' &&
        R.all(s => s === '.' || s === 'L', seatNeighbours)) {
      return R.append([p, '#'], ops);
    }

    if (seatState === '#' &&
        4 <= R.o(R.length, R.filter(R.equals('#')))(seatNeighbours)) {
      return R.append([p, 'L'], ops);
    }

    return ops;
  }, [], seatPos);

  R.forEach(R.apply(set(board)), ops);
  return board;
};

const stepPart2 = (board) => {
  const seatPos = findIndiciesOnBoard(R.o(R.not, R.equals('.')), board);

  const ops = R.reduce((ops, p) => {
    const seatState = access(board, p);

    let visibleSeatPos = [];
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [ 0, -1],          [ 0, 1],
        [ 1, -1], [ 1, 0], [ 1, 1]];
    const addP = R.zipWith(R.add);

    for (let i = 0; i < R.length(directions); i++) {
      let pos = addP(p, directions[i]);

      while (onBoard(board, pos)) {
        if (access(board, pos) !== '.') {
          visibleSeatPos.push(pos);
          break;
        }
        pos = addP(pos, directions[i]);
      }
    }

    const visibleSeats = R.map(access(board), visibleSeatPos);

    if (seatState === 'L' &&
        R.all(s => s === '.' || s === 'L', visibleSeats)) {
      return R.append([p, '#'], ops);
    }

    if (seatState === '#' &&
        5 <= R.o(R.length, R.filter(R.equals('#')))(visibleSeats)) {
      return R.append([p, 'L'], ops);
    }

    return ops;
  }, [], seatPos);

  R.forEach(R.apply(set(board)), ops);
  return board;
};


const noOccupiedSeats = R.compose(R.sum, R.unnest, mapBoard((v) => v === '#' ? 1 : 0));

console.log(noOccupiedSeats(fixedPoint(stepPart1, R.clone(seatBoard))));
console.log(noOccupiedSeats(fixedPoint(stepPart2, seatBoard)));

