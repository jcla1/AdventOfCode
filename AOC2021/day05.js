const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

// WARNING: This solution won't work for part 2 of this day
// in repl.it since we're using around 1.5GB of memory - no
// idea why it's such a huge amount.
const input = fs.readFileSync('inputs/day05.input', 'utf8').trim();

const lines = R.compose(
    R.map(R.compose(
        R.map(parseInt),
        R.slice(1, 5),
        R.match(/(\d+),(\d+) -> (\d+),(\d+)/))),
    R.split('\n'))(input);

const isGridLine = (l) => l[0] === l[2] || l[1] === l[3];
const addBoards = R.mergeDeepWith(R.add);

const drawLine = (line) => {
  const start = R.slice(0, 2, line);
  const end = R.slice(2, 4, line);

  const direction = R.compose(
      R.map(U.sign),
      R.zipWith(R.subtract))(end, start);

  return R.compose(
      R.reduce(R.mergeWith(R.merge), {}),
      R.map(R.compose(
          R.assocPath(R.__, 1, {}),
          R.map(R.toString))),

      R.append(end),
      R.unfold((pos) => {
        if (R.equals(pos, end)) return false;
        return [pos, R.zipWith(R.add, pos, direction)];
      }))(start);
};

const oceanFloor = R.compose(
    R.reduce(addBoards, {}),
    R.map(drawLine),
    // To get get the answer for part 1/2 of this day, simply
    // (un)comment the following filter line.
    R.filter(isGridLine),
)(lines);

const noOverlaps = R.compose(
    R.length,
    R.filter(R.lt(1)),
    R.chain(R.values),
    R.values);

console.log(noOverlaps(oceanFloor));
