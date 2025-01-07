const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const matchLocations = R.curry((rg, grid) => {
  const antennas = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (R.test(rg, grid[i][j])) {
        antennas.push([[i, j], grid[i][j]]);
      }
    }
  }
  return antennas;
});

const isOnGrid = R.curry((grid, [row, col]) =>
  row >= 0 && row < grid.length && col >= 0 && col < grid[0].length);

const generateAntinodes = ([r1, c1], [r2, c2], d = 1) =>
  [[r1 - d*(r2 - r1), c1 - d*(c2 - c1)], [r2 + d*(r2 - r1), c2 + d*(c2 - c1)]];

const grid = R.compose(
    R.map(R.split('')),
    R.split('\n'))(input);
const antennaPos = matchLocations(/[0-9A-Za-z]/, grid);

const groupedPos = R.compose(
    R.map(R.map(R.prop(0))),
    R.groupBy(R.prop(1)))(antennaPos);

const antinodes = R.compose(
    R.uniq,
    R.unnest,
    R.values,
    R.map((ps) => R.compose(
        R.filter(isOnGrid(grid)),
        R.unnest,
        R.map(R.apply(generateAntinodes)),
        R.filter(([a, b]) => !R.equals(a, b)),
        R.xprod)(ps, ps)))(groupedPos);
console.log(antinodes.length);

const getResonantNodes = (nodes) => {
  const nodePairs = R.compose(
      R.filter(([a, b]) => !R.equals(a, b)),
      R.xprod)(nodes, nodes);

  let antinodes = nodes;
  let dist = 1;
  while (true) {
    const newAntinodes = R.compose(
        R.filter(isOnGrid(grid)),
        R.unnest,
        R.map(([a, b]) => generateAntinodes(a, b, dist)))(nodePairs);

    if (newAntinodes.length === 0) break;
    antinodes = R.concat(antinodes, newAntinodes);

    dist++;
  }

  return R.uniq(antinodes);
};

const numResonantNodes = R.compose(
    R.length,
    R.uniq,
    R.unnest,
    R.values,
    R.map(getResonantNodes))(groupedPos);
console.log(numResonantNodes);
