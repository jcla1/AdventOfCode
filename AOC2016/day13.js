const R = require('ramda');
const U = require('./util.js');

const input = 1362;
const target = [31, 39];

const isNotWall = ([x, y]) => {
  const num = x*x + 3*x + 2*x*y + y + y*y + input;
  const binary = num.toString(2);
  const ones = R.filter(R.equals('1'), R.split('', binary));
  return ones.length % 2 === 0;
};

const possibleMoves = ([x, y]) => {
  const moves = [[x+1, y], [x, y+1], [x-1, y], [x, y-1]];
  const isOnBoard = ([x, y]) => x >= 0 && y >= 0;
  return R.filter(R.allPass([isOnBoard, isNotWall]), moves);
};

const shortestPath = U.astar([1, 1], target, possibleMoves);
console.log(shortestPath.length - 1);

let seen = new Set();
let front = new Set(['[1,1]']);
for (var i = 0; i < 50; i++) {
  let newFront = new Set();
  front.forEach((f) => {
    const p = JSON.parse(f);
    const moves = possibleMoves(p);
    moves.forEach((m) => {
      const s = JSON.stringify(m);
      if (!seen.has(s)) {
        seen.add(s);
        newFront.add(s);
      }
    });
  });
  front = newFront;
}

console.log(seen.size);
