const R = require('ramda');
const U = require('./util.js');

//const input = U.getInput(__filename);
const input = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`;

const points = R.compose(
  R.map(R.o(U.toIntArr, R.split(','))),
  R.split('\n'))(input);

const area = ([x1, y1], [x2, y2]) => (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);

const maxArea = R.compose(
  U.maximum,
  R.map(R.apply(area)),
  R.xprod)(points, points);
console.log(maxArea);

const pointInInterior = ([[x1, y1], [x2, y2]]) => ([px, py]) =>
  (px > Math.min(x1, x2) && px < Math.max(x1, x2) &&
   py > Math.min(y1, y2) && py < Math.max(y1, y2));

const isInEnclosed = ([[x1, y1], [x2, y2]]) =>

const squares = R.compose(
  R.map((sq) => [...sq, area(...sq), isInEnclosed(sq)]),
  R.xprod)(points, points);

console.log(squares);
