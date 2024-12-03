const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const height = 6; const width = 50;

let screen = new Array(height).fill(0).map(() => R.repeat('.', width));
const screenToString = R.compose(R.join('\n'), R.map(R.join('')));

const rect = (x, y) => {
  for (let i = 0; i < y; i++) {
    for (let j = 0; j < x; j++) {
      screen[i][j] = '#';
    }
  }
};

const rotate = (arr, by) => R.concat(
    R.drop(arr.length - by, arr),
    R.take(arr.length - by, arr));

const rotateRow = (y, by) => {
  screen[y] = rotate(screen[y], by);
};

const rotateColumn = (x, by) => {
  const tmp = R.transpose(screen);
  tmp[x] = rotate(tmp[x], by);
  screen = R.transpose(tmp);
};

const countLit = R.compose(
    R.length,
    R.filter(R.equals('#')),
    R.flatten);

const processInstruction = (instruction) => {
  const instrType = R.match(/^\w+/g, instruction)[0];
  if (instrType === 'rect') {
    const [x, y] = R.compose(
        U.toIntArr,
        R.take(2), R.drop(1),
        R.match(/^rect ([0-9]+)x([0-9]+)$/))(instruction);
    rect(x, y);
  } else if (instrType === 'rotate') {
    const [type, idx, by] = R.compose(
        ([type, _, idx, by]) => [type, parseInt(idx), parseInt(by)],
        R.take(4), R.drop(1),
        R.match(/^rotate (row|column) (x|y)=([0-9]+) by ([0-9]+)$/))(instruction);

    if (type === 'row') {
      rotateRow(idx, by);
    } else if (type === 'column') {
      rotateColumn(idx, by);
    }
  } else {
    console.error('Unknown instruction:', instruction);
  }
};

const instructions = R.split('\n', input);
R.forEach(processInstruction, instructions);

console.log(countLit(screen));
console.log(screenToString(screen));
