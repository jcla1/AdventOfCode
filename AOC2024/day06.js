const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const countXs = R.compose(
    R.length,
    R.filter(R.equals('X')),
    R.unnest);

const rotateAnticlock = (matrix) => R.reverse(R.transpose(matrix));
const rotateClock = (matrix) => R.transpose(R.reverse(matrix));

const guardPosition = (map) => {
  const a = R.findIndex(R.includes('^'), map);
  if (a === -1) return [-1, -1];
  const b = R.indexOf('^', map[a]);
  return [a, b];
};

const moveGuardInLine = (line) => {
  const guardIdx = R.indexOf('^', line);
  const nextWallIdx = R.indexOf('#', R.drop(guardIdx, line));

  if (nextWallIdx === -1) {
    return [
      ...R.take(guardIdx, line),
      'X',
      ...R.repeat('X', line.length - guardIdx - 1)];
  }

  return [
    ...R.take(guardIdx, line),
    ...R.repeat('X', nextWallIdx - 1),
    '^',
    ...R.drop(guardIdx + nextWallIdx, line),
  ];
};
const advanceHorizontally = (map) => R.adjust(
    R.findIndex(R.includes('^'), map),
    moveGuardInLine,
    map);

const getMap = R.compose(
    rotateClock,
    R.map(R.split('')),
    R.split('\n'));

let map = getMap(input);
const initialPos = guardPosition(map);

while (R.any(R.includes('^'), map)) {
  map = advanceHorizontally(map);
  map = rotateAnticlock(map);
}
console.log(countXs(map));


const endsInLoop = (map) => {
  const seen = new Set();
  let prevSize = seen.size;
  let i = 0;

  while (R.any(R.includes('^'), map)) {
    map = advanceHorizontally(map);
    map = rotateAnticlock(map);
    seen.add(guardPosition(map).join(',') + ',' + i % 4);
    if (prevSize === seen.size) return true;

    i++;
    prevSize = seen.size;
  }
  return false;
};

const cleanMap = getMap(input);
const n = map.length;
const m = map[0].length;

const numLoops = R.compose(
    R.length,
    R.filter(R.identity),
    R.map(([a, b]) => endsInLoop(R.set(R.lensPath([a, b]), '#', cleanMap))),
    R.filter(([a, b]) => map[a][b] === 'X' && !(a == initialPos[0] && b == initialPos[1])),
    R.xprod)(R.range(0, n), R.range(0, m));
console.log(numLoops);
