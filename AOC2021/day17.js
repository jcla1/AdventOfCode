const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

const input = fs.readFileSync('inputs/day17.input', 'utf8').trim();

const targetArea = R.compose(
    ([x1, x2, y1, y2]) => [[x1, y1], [x2, y2]],
    R.map(parseInt),
    R.slice(1, 5),
    R.match(/target area: x=(-?\d+)\.\.(-?\d+), y=(-?\d+)\.\.(-?\d+)/))(input);

const isInArea = ([[x1, y1], [x2, y2]], [x, y]) =>
  x1 <= x && x <= x2 && y1 <= y && y <= y2;
const isRightOrBelow = ([[, y1], [x2]], [x, y]) => x2 < x || y < y1;

const doesTrajHit = R.curry((target, [dx, dy], p = [0, 0]) => {
  if (isRightOrBelow(target, p)) return false;
  if (isInArea(target, p)) return true;

  const [x, y] = p;
  return doesTrajHit(
      target,
      [R.max(0, dx - U.sign(dx)), dy - 1],
      [x + dx, y + dy]);
});

const [[, y1], [x2]] = targetArea;
const maxHeight = y1 * (y1 + 1) / 2;
console.log(maxHeight);

const possibleVelocities = R.compose(
    R.filter(doesTrajHit(targetArea)),
    R.xprod)(R.range(1, x2 + 1), R.range(y1, 2 - y1));

console.log(R.length(possibleVelocities));
