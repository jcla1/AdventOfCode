const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const matchLocation = (grid, c) => {
  const row = R.findIndex(R.includes(c), grid);
  const col = R.findIndex(R.equals(c), grid[row]);
  return [row, col];
};

const grid = R.compose(
    R.map(R.split('')),
    R.split('\n'))(input);

const startPos = matchLocation(grid, 'S');
const startState = [startPos, 'E'];

const endPos = matchLocation(grid, 'E');

const getNeighbours = (grid, posState) => {
  const [[row, col], face] = posState;
  let neighbours = [];

  switch (face) {
    case 'N':
      neighbours = [[[row-1, col], 'N'], [[row, col], 'E'], [[row, col], 'W']];
      break;
    case 'E':
      neighbours = [[[row, col], 'S'], [[row, col+1], 'E'], [[row, col], 'N']];
      break;
    case 'S':
      neighbours = [[[row+1, col], 'S'], [[row, col], 'W'], [[row, col], 'E']];
      break;
    case 'W':
      neighbours = [[[row, col], 'N'], [[row, col-1], 'W'], [[row, col], 'S']];
      break;
  }

  return R.filter(([[r, c], f]) =>
    r >= 0 &&
    r < grid.length &&
    c >= 0 &&
    c < grid[0].length &&
    grid[r][c] != '#', neighbours);
};

const stepCost = (curState, nextState) => {
  if (curState[1] != nextState[1]) return 1000;
  return 1;
};

const isAtEnd = (state) => R.equals(state[0], endPos);

const getPathCost = R.compose(
    R.sum,
    R.map(R.apply(stepCost)),
    R.aperture(2));

const bestPath = U.astar(
    startState,
    isAtEnd,
    R.curry(getNeighbours)(grid),
    R.always(0),
    stepCost);
const bestPathCost = getPathCost(bestPath);
console.log(bestPathCost);

// not the prettiest solution to brute force from every possible alternate
// neighbour, but it is correct. Unfortunately it's also quite slow.
const findAlternatePaths = (grid, shortestPath, maxCost) => {
  const paths = [shortestPath];

  for (let i = 0; i < shortestPath.length - 1; i++) {
    const curState = shortestPath[i];
    const neighbourStates = getNeighbours(grid, curState);
    if (neighbourStates.length == 1) continue;

    const nextState = shortestPath[i + 1];
    const alternateNeighbours = R.without([nextState], neighbourStates);
    const alternatePathCompletions = R.map((n) => {
      return U.astar(
          n,
          isAtEnd,
          R.curry(getNeighbours)(grid),
          R.always(0),
          stepCost);
    }, alternateNeighbours);

    const alternatePaths = R.map((p) =>
      [...shortestPath.slice(0, i + 1), ...p], alternatePathCompletions);
    const alternateCosts = R.map(getPathCost, alternatePaths);

    for (let j = 0; j < alternatePaths.length; j++) {
      if (alternateCosts[j] <= maxCost) {
        paths.push(alternatePaths[j]);
      }
    }
  }

  return paths;
};

const paths = findAlternatePaths(grid, bestPath, bestPathCost);
const allTiles = R.compose(
    R.uniq,
    R.map(R.head),
    R.unnest)(paths);
console.log(R.length(allTiles));
