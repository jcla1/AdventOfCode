const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);
const codes = R.split('\n', input);

const charToPos = R.curry((pad, c) => {
  switch (pad) {
    case 'numeric':
      return {
        'A': [2, 0], '0': [1, 0], '1': [0, 1],
        '2': [1, 1], '3': [2, 1], '4': [0, 2],
        '5': [1, 2], '6': [2, 2], '7': [0, 3],
        '8': [1, 3], '9': [2, 3],
      }[c];
    case 'directional':
      return {
        'A': [2, 1], '^': [1, 1], '>': [2, 0], 'v': [1, 0], '<': [0, 0],
      }[c];
  }
});

const onPad = R.curry((pad, [x, y]) => {
  switch (pad) {
    case 'numeric':
      return 0 <= x && x <= 2 && 0 <= y && y <= 3 && !(x == 0 && y == 0);
    case 'directional':
      return 0 <= x && x <= 2 && 0 <= y && y <= 1 && !(x == 0 && y == 1);
    default: return false;
  }
});

const getNeighbours = R.curry((pad, [x, y]) => {
  const candidates = [[x, y+1], [x+1, y], [x, y-1], [x-1, y]];
  return R.filter(onPad(pad), candidates);
});

const getStep = ([x, y], [w, z]) => {
  if (x == w) {
    if (y < z) return '^';
    else return 'v';
  } else {
    if (x < w) return '>';
    else return '<';
  }
};

const getShortestPaths = R.curry((pad, fromChar, toChar) => {
  if (fromChar == toChar) return [['']];

  const fromPos = charToPos(pad, fromChar);
  const toPos = charToPos(pad, toChar);
  const queue = [[fromPos, []]];

  let shortestLen = Infinity;
  const foundPaths = [];

  while (queue.length > 0) {
    const [[x, y], path] = queue.shift();
    if (path.length > shortestLen) continue;
    if (x == toPos[0] && y == toPos[1]) {
      foundPaths.push(path);
      shortestLen = U.minimum(R.map(R.length, foundPaths));
      continue;
    }

    const neighbours = getNeighbours(pad, [x, y]);
    queue.push(...R.map(
        ([w, z]) => [[w, z], [...path, getStep([x, y], [w, z])]], neighbours));
  }

  return R.filter((p) => p.length <= shortestLen, foundPaths);
});

const getShortestSeqs = R.curry(R.memoizeWith(
    (pad, code) => `${pad}-${code}`,
    (pad, code) => {
      const steps = R.aperture(2, ['A', ...code]);
      return R.compose(
          R.map(R.map(R.o(R.join(''), R.append('A')))),
          R.map(R.map(R.join(''))),
          R.map((s) => getShortestPaths(pad, ...s)))(steps);
    }));

const traverseDirectionalDepth = R.memoizeWith(
    (code, depth) => `${code}-${depth}`,
    (code, depth) => {
      if (depth == 0) return code.length;
      const steps = getShortestSeqs('directional', code);

      return R.compose(
          R.sum,
          R.map(R.compose(U.minimum, R.map(
              (c) => traverseDirectionalDepth(c, depth-1)))))(steps);
    });

const getComplexity = (code, depth) => {
  const n = parseInt(R.take(3, code));

  const p = getShortestSeqs('numeric', code);
  const shortestSeqLen = R.compose(
      R.sum,
      R.map(R.compose(U.minimum, R.map(
          (c) => traverseDirectionalDepth(c, depth)))))(p);

  return n * shortestSeqLen;
};

const totalComplexity = (depth = 2) => R.compose(
    R.sum,
    R.map((c) => getComplexity(c, depth)))(codes);

console.log(totalComplexity());
console.log(totalComplexity(25));
