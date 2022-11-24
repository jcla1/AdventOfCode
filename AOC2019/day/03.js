/* WARNING: This day takes a long time to run, the bottleneck
            is the fastIntersection call, which is still considerably
            faster than the ramdajs R.intersection */
const {indexOf, apply, split, sortBy, compose, tail, reduce, concat, last, range, map, head, inc, curry, sum, min} = require('ramda');
const {fastIntersection} = require('./lib/utils');
const input = require('./lib/utils').parseFile('03');

const manhattanDistToOrigin = ([x, y]) => Math.abs(x) + Math.abs(y);

const passedPointsForStep = ([x, y], s) => {
  const update = (k) =>
    [x + (s[0] == 'R' ? k : 0) - (s[0] == 'L' ? k : 0),
      y + (s[0] == 'U' ? k : 0) - (s[0] == 'D' ? k : 0)];
  return map(update, range(1, parseInt(tail(s)) + 1));
};

const pointsPassed =
  compose(
      tail,
      reduce((path, s) => concat(path, passedPointsForStep(last(path), s)), [[0, 0]]),
      split(','),
  );

const intersectionsOfPipes = compose(
    apply(fastIntersection),
    map(pointsPassed),
);

const nearestCrossoverToOrigin = compose(
    manhattanDistToOrigin, head,
    sortBy(manhattanDistToOrigin),
    intersectionsOfPipes,
);

const combinedDistToPoint = curry((pipes, inter) =>
  sum(map(compose(inc, indexOf(inter), pointsPassed), pipes)));

const shortestIntersection = compose(
    reduce(min, Infinity),
    map(combinedDistToPoint(input)),
    intersectionsOfPipes,
);

module.exports = {
  a: nearestCrossoverToOrigin(input),
  b: shortestIntersection(input),
};
