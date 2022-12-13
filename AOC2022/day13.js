const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('inputs/day13.input', 'utf8').trim();

const wrapIfUnwraped = (x) => {
  if (R.is(Array, x)) return x;
  return [x];
};

const compare = (xs, ys) => {
  if (xs.length == 0) {
    return ys.length > 0 ? -1 : 0;
  }
  const a = R.head(xs); const b = R.head(ys);

  if (R.isNil(b)) return 1;

  if (R.is(Array, a) || R.is(Array, b)) {
    const cmp = compare(wrapIfUnwraped(a), wrapIfUnwraped(b));
    if (cmp !== 0) {
      return cmp;
    }
  } else if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  }

  return compare(R.tail(xs), R.tail(ys));
};

const pairs = R.compose(
    R.map(R.compose(
        R.map(JSON.parse),
        R.split('\n'))),
    R.split('\n\n'))(input);

const indexSum = R.compose(
    R.sum,
    R.map(R.last),
    R.filter(([ord, _]) => ord < 0),
    R.addIndex(R.map)((ord, idx) => [ord, idx + 1]),
    R.map(R.apply(compare)))(pairs);

const sortedPairs = R.compose(
    R.sort(compare),
    R.concat([[[2]], [[6]]]),
    (ps) => ps.flat())(pairs);

const markerIdx1 = R.findIndex(R.equals([[2]]), sortedPairs) + 1;
const markerIdx2 = R.findIndex(R.equals([[6]]), sortedPairs) + 1;

console.log(indexSum);
console.log(markerIdx1 * markerIdx2);
