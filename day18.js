const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

const input = fs.readFileSync('inputs/day18.input', 'utf8').trim();

// Parses the first snail number found in the given string and returns the
// unconsumed rest of the string. We assume that there is in fact a snail number
// to be consumed at the start of the string.
// parseSnailNum :: String -> (SnailNum, String)
const parseSnailNum = (s) => {
  if (R.isEmpty(s)) return [0, ''];
  if (s[0] === '[') {
    // our snail number is an actual tree.
    let rest = s;

    // start with removing the leading '['
    rest = R.drop(1, rest);
    let left; let right;
    [left, rest] = parseSnailNum(rest);

    // get rid of the middle comma
    rest = R.drop(1, rest);

    [right, rest] = parseSnailNum(rest);

    // remove the trailing ']'
    rest = R.drop(1, rest);
    return [[left, right], rest];
  } else {
    // or the snail number is just a plain old integer
    const [, num, rest] = R.match(/^(\d+)(.*)/, s);
    return [parseInt(num), rest];
  }
};

const isSimpleNum = (n) => typeof(n) === 'number';
const view = (p, n) => R.view(R.lensPath(p), n);

// eslint-disable-next-line no-unused-vars
const snailNumToString = (n) => {
  if (isSimpleNum(n)) return R.toString(n);
  return '[' + snailNumToString(n[0]) + ',' + snailNumToString(n[1]) + ']';
};

const decend = (n, dir, path) => {
  if (isSimpleNum(view(path, n))) return path;
  return decend(n, dir, [...path, dir]);
};

// dir specifies the direction to look for the neighbour
const getNeighbour = (n, path, dir) => {
  if (R.nth(-1, path) === 1 - dir) {
    return decend(n, 1 - dir, [...R.dropLast(1, path), dir]);
  }

  path = R.dropLastWhile(R.equals(dir), path);
  if (R.equals(path, [])) return [];

  return decend(n, 1 - dir, [...R.dropLast(1, path), dir]);
};

const isStub = (tree) => {
  if (!tree || isSimpleNum(tree)) return false;
  return isSimpleNum(tree[0]) && isSimpleNum(tree[1]);
};

const split = (num) => [Math.floor(num / 2), Math.ceil(num / 2)];
const explode = (n, path) => {
  const leftNeighbourNum = getNeighbour(n, path, 0);
  const rightNeighbourNum = getNeighbour(n, path, 1);

  const ep = view(path, n);
  // zero out the stub we are exploding
  n = R.set(R.lensPath(path), 0, n);

  if (!R.equals(leftNeighbourNum, [])) {
    n = R.over(R.lensPath(leftNeighbourNum), R.add(ep[0]), n);
  }
  if (!R.equals(rightNeighbourNum, [])) {
    n = R.over(R.lensPath(rightNeighbourNum), R.add(ep[1]), n);
  }

  return n;
};

const simplifyByExplosion = (n, path = []) => {
  if (isSimpleNum(view(path, n))) return n;

  if (path.length >= 4 && isStub(view(path, n))) {
    return explode(n, path);
  }

  // decend into the other branches of the tree
  const nextN = simplifyByExplosion(n, [...path, 0]);
  if (!R.equals(n, nextN)) return nextN;
  return simplifyByExplosion(n, [...path, 1]);
};

const simplifyBySplit = (n, path = []) => {
  const curNum = view(path, n);

  if (isSimpleNum(curNum)) {
    if (curNum >= 10) return R.set(R.lensPath(path), split(curNum), n);
    return n;
  }

  // decend into the other branches of the tree
  const nextN = simplifyBySplit(n, [...path, 0]);
  if (!R.equals(n, nextN)) return nextN;
  return simplifyBySplit(n, [...path, 1]);
};

const simplifyNum = U.fixedPoint(
    R.compose(
        simplifyBySplit,
        U.fixedPoint(simplifyByExplosion)));

const magnitude = (n) => {
  if (isSimpleNum(n)) return n;
  return 3 * magnitude(n[0]) + 2 * magnitude(n[1]);
};

const snailNums = R.compose(
    R.map(R.o(R.nth(0), parseSnailNum)),
    R.split('\n'))(input);

const [head, ...tail] = snailNums;
const sumOfNums = R.reduce(
    R.compose(simplifyNum, R.pair),
    head, tail);

console.log(magnitude(sumOfNums));

const largestMagnitude = R.compose(
    U.maximum,
    R.map(R.o(magnitude, simplifyNum)),
    R.filter(([a, b]) => !R.equals(a, b)),
    R.apply(R.xprod),
    R.juxt([R.identity, R.identity]))(snailNums);

console.log(largestMagnitude);
