const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const isValidTriangle = ([a, b, c]) => a + b > c && a + c > b && b + c > a;

const numValidTriangles = R.compose(
  R.length,
  R.filter(isValidTriangle),
  R.map(R.compose(U.toIntArr, R.match(/\d+/g))),
  R.split('\n'))(input);

console.log(numValidTriangles);

const numColTriangles = R.compose(
  R.length,
  R.filter(isValidTriangle),
  R.unnest,
  R.map(R.splitEvery(3)),
  R.transpose,
  R.map(R.compose(U.toIntArr, R.match(/\d+/g))),
  R.split('\n'))(input);

console.log(numColTriangles);
