const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

const input = fs.readFileSync('inputs/day11.input', 'utf8').trim();

const seatBoard = R.compose(
    R.map(R.split('')),
    R.split('\n'))(input);

const stepPart1 = (board) => {
  const seatPos = U.findIndicies(R.o(R.not, R.equals('.')), board);

  const ops = R.reduce((ops, p) => {
    const seatState = U.get(board, p);
    const seatNeighbours = R.map(U.get(board), U.getNeighbours(board, p, true));

    if (seatState === 'L' &&
        R.all((s) => s === '.' || s === 'L', seatNeighbours)) {
      return R.append([p, '#'], ops);
    }

    if (seatState === '#' &&
        4 <= R.o(R.length, R.filter(R.equals('#')))(seatNeighbours)) {
      return R.append([p, 'L'], ops);
    }

    return ops;
  }, [], seatPos);

  R.forEach(R.apply(U.set(board)), ops);
  return board;
};

const stepPart2 = (board) => {
  const seatPos = U.findIndicies(R.o(R.not, R.equals('.')), board);

  const ops = R.reduce((ops, p) => {
    const seatState = U.get(board, p);

    const visibleSeatPos = [];
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]];
    const addP = R.zipWith(R.add);

    for (let i = 0; i < R.length(directions); i++) {
      let pos = addP(p, directions[i]);

      while (U.onBoard(board, pos)) {
        if (U.get(board, pos) !== '.') {
          visibleSeatPos.push(pos);
          break;
        }
        pos = addP(pos, directions[i]);
      }
    }

    const visibleSeats = R.map(U.get(board), visibleSeatPos);

    if (seatState === 'L' &&
        R.all((s) => s === '.' || s === 'L', visibleSeats)) {
      return R.append([p, '#'], ops);
    }

    if (seatState === '#' &&
        5 <= R.o(R.length, R.filter(R.equals('#')))(visibleSeats)) {
      return R.append([p, 'L'], ops);
    }

    return ops;
  }, [], seatPos);

  R.forEach(R.apply(U.set(board)), ops);
  return board;
};


const noOccupiedSeats = R.o(U.sumBoard, U.mapBoard((v) => v === '#' ? 1 : 0));

console.log(noOccupiedSeats(U.fixedPoint(stepPart1, R.clone(seatBoard))));
console.log(noOccupiedSeats(U.fixedPoint(stepPart2, seatBoard)));

