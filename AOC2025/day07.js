const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const [initState, ...lines] = R.compose(
  R.addIndex(R.filter)((_, i) => i % 2 === 0),
  R.map(R.split('')),
  R.split('\n'))(input);

const lineWidth = initState.length;
const startLoc = R.findIndex(R.equals('S'), initState);

// urgh, global state
let noSplits = 0;
const processLine = (row, splits) => {
  const newRow = new Array(lineWidth).fill(0);
  for (let i = 0; i < row.length; i++) {
    if (row[i] === 0) continue;
    if (splits[i] === '.') newRow[i] += row[i];
    if (splits[i] === '^') {
      noSplits++;
      newRow[i - 1] += row[i];
      newRow[i + 1] += row[i];
    }
  }
  return newRow;
};

const firstRow = new Array(lineWidth).fill(0);
firstRow[startLoc] = 1;

const finalRow = R.reduce(processLine, firstRow, lines);
console.log(noSplits);
console.log(R.sum(finalRow));
