const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

const input = fs.readFileSync('inputs/day05.input', 'utf8').trim();

const [seedString, ...almanacDesc] = R.compose(
    R.split('\n\n'))(input);

const seeds = R.compose(
    U.toIntArr,
    R.drop(1),
    R.split(' '))(seedString);

const parseTranslation = R.compose(
    U.toIntArr,
    R.split(' '));

// in the format: [dst, src, len]
const almanac = R.map(R.compose(
    R.map(parseTranslation),
    R.drop(1),
    R.split('\n')))(almanacDesc);

const feedThrough = (input, page) => {
  for (let i = 0; i < R.length(page); i++) {
    if (page[i][1] <= input && input < page[i][1] + page[i][2]) {
      return page[i][0] + (input - page[i][1]);
    }
  }
  return input;
};

const lookupLoc = R.reduce(feedThrough);

const lookupLowestLoc = R.compose(
    U.minimum,
    R.map((s) => lookupLoc(s, almanac)));

console.log(lookupLowestLoc(seeds));

// ugly, I know
const splitInterval = R.curry((A, B) => {
  if (A[0] < B[0]) {
    if (B[0] > A[0] + A[1]) return [A];
    if (B[0] + B[1] < A[0] + A[1]) return [[A[0], B[0] - A[0]], B, [B[0] + B[1], A[0] + A[1] - B[0] - B[1]]];
    return [[A[0], B[0] - A[0]], [B[0], A[1] + (A[0] - B[0])]];
  } else {
    if (A[0] + A[1] <= B[0] + B[1] || A[0] >= B[0] + B[1]) return [A];
    return [[A[0], B[1] - (A[0] - B[0])], [B[0] + B[1], A[0] + A[1] - B[0] - B[1]]];
  }
});

// [start, len] -> Almanac -> [[start, len]]
const feedThroughInterval = (input, page) => {
  R.reduce((as, B) => R.chain(A => splitInterval(A, B), as), [[0,10]], [[-1, 1], [9, 10]])
};





const lookupLocForIntervals = R.reduce(R.chain(feedThroughInterval));

const seedRng = R.splitEvery(2, seeds);

// console.log(lookupLowestLoc(seedRng));
