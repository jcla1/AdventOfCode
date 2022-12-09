const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

//const input = fs.readFileSync('inputs/day08.input', 'utf8').trim();
const input = `30373
25512
65332
33549
35390`;

const rotateR = R.compose(R.map(R.reverse), R.transpose);
const rotateL = R.compose(R.reverse, R.transpose);

const visInLine = (line, maxHeight = 10, strict = true) => {
  if (line.length === 0) return [];
  const visibility = R.repeat(0, line.length);
  // The first tree in line is always visible as it's right in front of us.
  visibility[0] = 1;

  let curMax = line[0]; const i = 1;
  for (let i = 1; i < line.length; i++) {
    if (curMax === maxHeight) break;

    if (line[i] > curMax || (!strict && line[i] >= curMax)) {
      curMax = line[i];
      visibility[i] = 1;
    }
  }

  return visibility;
};

const grid = R.compose(
    R.map(R.compose(
        U.toIntArr,
        R.split(''))),
    R.split('\n'))(input);

const visibleL = R.map(visInLine, grid);
const visibleR = R.compose(
    rotateR, rotateR,
    R.map(visInLine),
    rotateL, rotateL)(grid);
const visibleT = R.compose(
    rotateR, R.map(visInLine), rotateL)(grid);
const visibleB = R.compose(
    rotateL, R.map(visInLine), rotateR)(grid);

const visibleFromOutside = R.compose(
    R.count(R.lt(0)),
    R.map(R.sum),
    R.transpose,
    R.map(R.flatten))([visibleL, visibleR, visibleT, visibleB]);

const viewDistHorizontal = R.compose(
    R.map(R.addIndex(R.map)((t, i, line) => {
      return [
        R.sum(visInLine(R.slice(i+1, line.length, line), t, false)),
        R.sum(visInLine(R.reverse(R.slice(0, i, line)), t, false))];
    })));

const maxScenicScore = R.compose(
    R.transpose,
    R.map((s) => s.flat()))([
  viewDistHorizontal(grid),
  rotateL(viewDistHorizontal(rotateR(grid)))]);

console.log(visibleFromOutside);
console.log(maxScenicScore);
