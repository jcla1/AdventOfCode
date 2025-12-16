const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const area = ([x1, y1], [x2, y2]) => (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);

const points = R.compose(
  R.map(R.o(U.toIntArr, R.split(','))),
  R.split('\n'))(input);

const maxArea = R.compose(
  U.maximum,
  R.map(R.apply(area)),
  R.xprod)(points, points);
console.log(maxArea);

const sortCoords = ([[x1, y1], [x2, y2]]) => [[R.min(x1, x2), R.min(y1, y2)], [R.max(x1, x2), R.max(y1, y2)]];

const sides = R.compose(
  R.map(sortCoords),
  R.aperture(2))(points);

const isInEnclosed = ([[x1, y1], [x2, y2]]) => R.none(([[ex1, ey1], [ex2, ey2]]) =>
    x1 < ex2 && ex1 < x2 && y1 < ey2 && ey1 < y2, sides);

const squares = R.compose(
  U.maximum,
  R.map(R.apply(area)),
  R.filter(isInEnclosed),
  R.map(sortCoords),
  R.xprod)(points, points);
console.log(squares);
