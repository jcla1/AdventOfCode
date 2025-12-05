const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const [ranges, ingredientStr] = R.split('\n\n', input).map(R.split('\n'));
const ingredients = U.toIntArr(ingredientStr);

const intervals = R.map(R.o(U.toIntArr, R.split('-')), ranges);
const isInInterval = ([a, b]) => (n) => n >= a && n <= b;

const noFreshIngredients = R.count(R.anyPass(R.map(isInInterval, intervals)), ingredients);
console.log(noFreshIngredients);

const unionIntervals = R.compose(
  R.reduce((union, [a, b]) => {
    if (R.isEmpty(union)) {
      return [[a, b]];
    }
    if (a > R.last(union)[1]) {
      return R.append([a, b], union);
    }
    const updatedInterval = [R.last(union)[0], Math.max(R.last(union)[1], b)];
    return R.update(R.length(union) - 1, updatedInterval, union);
  }, []),
  R.sortBy(R.head));

const mergedIntervals = unionIntervals(intervals);
const totalLength = R.sum(R.map(([a, b]) => b - a + 1, mergedIntervals));
console.log(totalLength);
