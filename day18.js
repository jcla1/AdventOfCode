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
    const [, num, rest, ] = R.match(/^(\d+)(.*)/, s);
    return [parseInt(num), rest];
  }
};

const isSimpleNum = (n) => typeof(n) === 'number';
const snailNumToString = (n) => {
  if (isSimpleNum(n)) return R.toString(n);
  return '[' + snailNumToString(n[0]) + ',' + snailNumToString(n[1]) + ']';
};

const decend = (n, dir, path) => {
  if (isSimpleNum(R.view(R.lensPath(path), n))) return path;
  return decend(n, dir, R.append(dir, path));
};

const getLeftNeighbour = (n, path) => {
  if (R.nth(-1, path) === 1) {
    return decend(n, 1, R.append(0, R.dropLast(1, path)));
  }

  path = R.dropLastWhile(R.equals(0), path);
  if (R.equals(path, [])) return [];

  path = R.append(0, R.dropLast(1, path));
  return decend(n, 1, path);
};

const getRightNeighbour = (n, path) => {
  if (R.nth(-1, path) === 0) {
    return decend(n, 0, R.append(1, R.dropLast(1, path)));
  }

  path = R.dropLastWhile(R.equals(1), path);
  if (R.equals(path, [])) return [];

  path = R.append(1, R.dropLast(1, path));
  return decend(n, 0, path);
};

const isDepthOne = (tree) => {
  if (isSimpleNum(tree)) return false;
  return isSimpleNum(tree[0]) && isSimpleNum(tree[1]);
};

const split = (num) => [Math.floor(num / 2), Math.ceil(num / 2)];
const explode = (n, path) => {
  const leftNeighbourNum = getLeftNeighbour(n, path);
  const rightNeighbourNum = getRightNeighbour(n, path);

  const ep = R.view(R.lensPath(path), n);
  n = R.set(R.lensPath(path), 0, n);

  if (!R.equals(leftNeighbourNum, [])) {
    n = R.over(R.lensPath(leftNeighbourNum), R.add(ep[0]), n);
  }
  if (!R.equals(rightNeighbourNum, [])) {
    n = R.over(R.lensPath(rightNeighbourNum), R.add(ep[1]), n);
  }

  return n;
};

const isValidPath = (n, path) => R.view(R.lensPath(path), n) !== undefined;

const simplifyByExplosion = (n, curPath = []) => {
  if (!isValidPath(n, curPath)) return n;

  const curNum = R.view(R.lensPath(curPath), n);
  const path = R.lensPath(curPath);

  if (R.length(curPath) >= 4 && isDepthOne(R.view(path, n))) {
    return explode(n, curPath);
  }

  // decend into the other branches of the tree
  const nextN = simplifyByExplosion(n, R.append(0, curPath))
  if (!R.equals(n, nextN)) return nextN;
  return simplifyByExplosion(n, R.append(1, curPath));
};

const simplifyBySplit = (n, curPath = []) => {

  const curNum = R.view(R.lensPath(curPath), n);
  const path = R.lensPath(curPath);

  if (isSimpleNum(curNum)) {
    if(curNum >= 10) return R.set(path, split(curNum), n);
    return n;
  }

  // decend into the other branches of the tree
  const nextN = simplifyBySplit(n, R.append(0, curPath))
  if (!R.equals(n, nextN)) return nextN;
  return simplifyBySplit(n, R.append(1, curPath));
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
