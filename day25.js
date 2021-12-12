const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('day25.input', 'utf8').trim();
const [cardPK, doorPK] = R.compose(R.map(parseInt), R.split('\n'))(input);

const base = 20201227;
const transform = (n, subjectNum = 7) => (n * subjectNum) % base;

const transformPK = (loopSize, subjectNum = 7) => R.reduce(
    (n) => transform(n, subjectNum),
    1,
    R.range(0, loopSize));

const findLoopSize = (pk) => {
  let candidate = 1;
  for (let loopSize = 1; true; loopSize++) {
    candidate = transform(candidate);
    if (candidate === pk) return loopSize;
  }
};

const encryptionKey = transformPK(findLoopSize(doorPK), cardPK);
console.log(encryptionKey);
