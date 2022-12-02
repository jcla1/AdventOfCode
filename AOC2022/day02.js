const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('inputs/day02.input', 'utf8').trim();

const scoreFn = ([o, m]) => {
  if (o == 'A' && m == 'X') return 1 + 3;
  if (o == 'A' && m == 'Y') return 2 + 6;
  if (o == 'A' && m == 'Z') return 3 + 0;

  if (o == 'B' && m == 'X') return 1 + 0;
  if (o == 'B' && m == 'Y') return 2 + 3;
  if (o == 'B' && m == 'Z') return 3 + 6;

  if (o == 'C' && m == 'X') return 1 + 6;
  if (o == 'C' && m == 'Y') return 2 + 0;
  if (o == 'C' && m == 'Z') return 3 + 3;
};

const rounds = R.compose(R.map(R.split(' ')), R.split('\n'))(input);
const totalScore = R.compose(R.sum, R.map(scoreFn))(rounds);

console.log(totalScore);

const chooseShape = ([o, m]) => {
  if (o == 'A' && m == 'X') return [o, 'Z'];
  if (o == 'A' && m == 'Y') return [o, 'X'];
  if (o == 'A' && m == 'Z') return [o, 'Y'];

  if (o == 'B' && m == 'X') return [o, 'X'];
  if (o == 'B' && m == 'Y') return [o, 'Y'];
  if (o == 'B' && m == 'Z') return [o, 'Z'];

  if (o == 'C' && m == 'X') return [o, 'Y'];
  if (o == 'C' && m == 'Y') return [o, 'Z'];
  if (o == 'C' && m == 'Z') return [o, 'X'];
};

const scoreForActualStrategy = R.compose(
    R.sum,
    R.map(R.compose(
        scoreFn,
        chooseShape)))(rounds);

console.log(scoreForActualStrategy);
