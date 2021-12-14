const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('inputs/day08.input', 'utf8').trim();

const signals = R.compose(
    R.map(R.compose(
        R.map(R.compose(R.split(' '), R.trim)),
        R.split('|'))),
    R.split('\n'))(input);

const no1478 = R.compose(
    R.length,
    R.filter(R.includes(R.__, [2, 4, 3, 7])),
    R.map(R.length),
    R.flatten,
    R.map(R.nth(1)))(signals);

console.log(no1478);

const hasLen = (n) => R.o(R.equals(n), R.length);

const find1 = (_) => hasLen(2); const find4 = (_) => hasLen(4);
const find7 = (_) => hasLen(3); const find8 = (_) => hasLen(7);
const find3 = (m) => R.allPass([
  hasLen(5), R.o(hasLen(2), R.intersection(m[1]))]);
const find9 = (m) => R.o(hasLen(5), R.intersection(m[3]));
const find0 = (m) => R.allPass([
  hasLen(6), R.o(hasLen(2), R.intersection(m[1]))]);
const find6 = (_) => hasLen(6);
const find5 = (m) => R.o(hasLen(5), R.intersection(m[6]));
const find2 = (_) => R.T;

const searchers = [
  [find1, 1], [find4, 4], [find7, 7], [find8, 8], [find3, 3],
  [find9, 9], [find0, 0], [find6, 6], [find5, 5], [find2, 2]];

const wrapSearcher = (f) => (m, d) => {
  const idx = R.findIndex(f(m), d);
  return [d[idx], R.remove(idx, 1, d)];
};

// Replacing this loop with a "loop-less" construct would be nice,
// though I'm not aware how to nicely reduce with multiple accumulators nicely.
const decode = (displayed) => {
  const mapping = {};
  for (let i = 0; i < R.length(searchers); i++) {
    const searcher = searchers[i];
    [s, displayed] = wrapSearcher(searcher[0])(mapping, displayed);
    mapping[searcher[1]] = R.sortBy(R.identity, s);
  }
  return R.invertObj(mapping);
};

const displayedNum = (m, d) => R.compose(
    parseInt, R.join(''),
    R.map((c) => m[R.sortBy(R.identity, c)]))(d);

const total = R.compose(
    R.sum,
    R.map(([digits, value]) => displayedNum(decode(digits), value)))(signals);

console.log(total);
