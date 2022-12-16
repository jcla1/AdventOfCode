const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

const input = fs.readFileSync('inputs/day14.input', 'utf8').trim();

const toCoord = R.compose(U.toIntArr, R.split(','));
const transCoord = R.curry(([[u, v], _], [x, y]) => [x - u, y - v]);

const drawLine = (board, [[x1, y1], [x2, y2]]) => {
  const len = R.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
  for (let i = 0; i <= len; i++) {
    if (x1 === x2) {
      board[x1][R.min(y1, y2) + i] = '#';
    } else {
      board[R.min(x1, x2) + i][y1] = '#';
    }
  }
};

const drawAllLines = (b, l, lines) => {
  for (let i = 0; i < lines.length; i++) {
    drawLine(b, R.map(transCoord(l), lines[i]));
  }
};

const dropSandGrain = (b, l) => {
  const offBoard = ([x, y]) =>
    x < l[0][0] ||
    x > l[1][0] ||
    y < l[0][1] ||
    y > l[1][1];
  const isFree = (cc) =>
    offBoard(cc) ||
    U.get(b, transCoord(l, cc)) === '.';

  let x = 500; let y = 0;
  while (!offBoard([x, y])) {
    if (isFree([x, y+1])) {
      y++; continue;
    } else if (isFree([x-1, y+1])) {
      x--; y++; continue;
    } else if (isFree([x+1, y+1])) {
      x++; y++; continue;
    }
    if (x === 500 && y === 0) return 'full';
    break;
  }

  const pos = [x, y];
  if (!offBoard(pos)) {
    U.set(b, transCoord(l, pos), 'o');
    return pos;
  }

  return 'full';
};

const fillWithSand = (board, l) => {
  let pos; let count = -1;
  do {
    count++;
    pos = dropSandGrain(board, l);
  } while (pos !== 'full');
  return count;
};

const getLimits = (lines) => {
  const l = R.compose(
      R.transpose,
      R.map((xs) => [U.minimum(xs), U.maximum(xs)]),
      R.transpose,
      (ls) => ls.flat())(lines);

  // We need the board to go to the top, because the sand can stack upto there.
  l[0][1] = 0;
  return l;
};

const getBoardSize = (l) => [l[1][0] - l[0][0] + 1, l[1][1] - l[0][1] + 1];
const makeBoard = (size) => R.times((_) => R.repeat('.', size[1]), size[0]);

const lines = R.compose(
    (ls) => ls.flat(),
    R.map(R.compose(
        R.aperture(2),
        R.map(toCoord),
        R.split(' -> '))),
    R.split('\n'))(input);

const limits = getLimits(lines);
const board = makeBoard(getBoardSize(limits));
drawAllLines(board, limits, lines);

const grainCount = fillWithSand(board, limits);
console.log(grainCount);

const ylim = limits[1][1] + 2;
const linesAndFloor = R.append([
  [500 - ylim, ylim],
  [500 + ylim, ylim]], lines);

const caveLimits = getLimits(linesAndFloor);
const cave = makeBoard(getBoardSize(caveLimits));
drawAllLines(cave, caveLimits, linesAndFloor);

// We add an extra grain since the one at the 'spout' is missing.
const caveGrainCount = fillWithSand(cave, caveLimits) + 1;
console.log(caveGrainCount);
