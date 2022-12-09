const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

const input = fs.readFileSync('inputs/day09.input', 'utf8').trim();

const instr = R.compose(
    R.map(R.compose(
        ([d, n]) => [d, parseInt(n)],
        R.split(' '))),
    R.split('\n'))(input);

// A cell is its own neighbour.
const neighbours = ([x, y]) => [
  [x-1, y-1], [x, y-1], [x+1, y-1],
  [x-1, y], [x, y], [x+1, y],
  [x-1, y+1], [x, y+1], [x+1, y+1]];

const step = ([x, y], [u, v]) => [u + U.sign(x - u), v + U.sign(y - v)];

const moveHead = (head, dir) => {
  switch (dir) {
    case 'L': return [head[0] - 1, head[1]];
    case 'U': return [head[0], head[1] + 1];
    case 'R': return [head[0] + 1, head[1]];
    case 'D': return [head[0], head[1] - 1];
  }
};

const tailPositions = (ropeLength) => R.compose(
    R.length,
    R.keys,
    R.last,
    R.reduce(
        ([rope, tailPositions], [dir, n]) => {
          for (let i = 0; i < n; i++) {
            rope[0] = moveHead(rope[0], dir);

            for (let j = 1; j < rope.length; j++) {
              if (!R.includes(rope[j], neighbours(rope[j-1]))) {
                rope[j] = step(rope[j-1], rope[j]);
              }
            }
            tailPositions[R.last(rope)] = 1;
          }
          return [rope, tailPositions];
        },
        [R.times(R.always([0, 0]), ropeLength), {'0,0': 1}]))(instr);

console.log(tailPositions(2));
console.log(tailPositions(10));
