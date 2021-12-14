const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('inputs/day14.input', 'utf8').trim();

const maximum = R.reduce(R.max, -Infinity);
const minimum = R.reduce(R.min, Infinity);
const toDict = (p) => R.fromPairs([p]);

// fromPairsWith :: (v -> v -> v) -> [(k, v)] -> {k: v}
const fromPairsWith = R.curry((f) => R.compose(
    R.reduce(R.mergeWith(f), {}),
    R.map(toDict)));

const [start, unparsedRules] = R.split('\n\n', input);
const rules = R.compose(
    R.fromPairs,
    R.map(R.compose(
        R.slice(1, 3),
        R.match(/^(\w+) -> (\w)$/))),
    R.split('\n'))(unparsedRules);

const stepPoly = (p) => {
  return R.compose(
      fromPairsWith(R.add),
      R.chain(([k, c]) => {
        const [l, r] = R.split('', k);
        const m = rules[k];
        return [
          [R.join('', [l, m]), c],
          [R.join('', [m, r]), c],
        ];
      }),
      R.toPairs)(p);
};

const pairCounts = R.compose(
    R.map(R.length),
    R.groupBy(R.join('')),
    R.aperture(2))(start);

const polymerPart1 = R.reduce(stepPoly, pairCounts, R.range(0, 10));
const polymerPart2 = R.reduce(stepPoly, pairCounts, R.range(0, 40));

const diff = R.compose(
    R.apply(R.subtract),
    R.juxt([maximum, minimum]),

    R.map((x) => Math.ceil(x/2)),
    R.values,
    fromPairsWith(R.add),
    R.chain(([p, c]) => {
      const [l, r] = R.split('', p);
      return [[l, c], [r, c]];
    }),
    R.toPairs);

console.log(diff(polymerPart1));
console.log(diff(polymerPart2));

