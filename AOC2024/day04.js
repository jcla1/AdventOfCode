const R = require('ramda');
const U = require('./util.js');

//const input = U.getInput(__filename);
const input = `.M.S......
..A..MSMS.
.M.S.MAA..
..A.ASMSM.
.M.S.M....
..........
S.S.S.S.S.
.A.A.A.A..
M.M.M.M.M.
..........`;

const matrixDiagonals = (matrix) => {
  const height = matrix.length;
  const width = matrix[0].length;
  const diagonalLength = height + width - 1;
  const diagonals = Array.from({length: diagonalLength}, () => []);
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      diagonals[i + j].push(matrix[i][j]);
    }
  }
  return diagonals;
}

const letterGrid = R.compose(
  R.map(R.split('')),
  R.split('\n'))(input);

const countHorizontalXMAS = R.compose(
    R.sum,
    R.map(R.compose(
        R.length,
        R.match(/XMAS/g))),
    R.map(R.join('')));

const xmasCount = R.compose(
  R.sum,
  R.map(countHorizontalXMAS))([
    letterGrid,
    R.map(R.reverse, letterGrid),
    R.transpose(letterGrid),
    R.map(R.reverse, R.transpose(letterGrid)),
    matrixDiagonals(letterGrid),
    matrixDiagonals(R.transpose(letterGrid)),
    matrixDiagonals(R.map(R.reverse, letterGrid)),
    matrixDiagonals(R.transpose(R.map(R.reverse, letterGrid))),
  ]);
console.log(xmasCount);
