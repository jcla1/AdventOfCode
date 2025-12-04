const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const grid = R.compose(
  R.map(R.split('')),
  R.split('\n'))(input);

const height = grid.length;
const width = grid[0].length;

const set = (grid, pos, v) => pos.forEach(([x, y]) => grid[x][y] = v);
const isOnGrid = (width, height) => (x, y) => x >= 0 && x < height && y >= 0 && y < width;
const getNeighbors = (grid, x, y) => {
  const deltas = [
    [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1],
  ];
  return deltas
    .map(([dx, dy]) => [x + dx, y + dy])
    .filter(isOnGrid(width, height))
    .map(([nx, ny]) => grid[nx][ny]);
}

const getAccessible = (grid) => {
  let accessible = [];
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const cell = grid[i][j];
      const neighbors = getNeighbors(grid, i, j);

      if (cell == '@' && R.count(R.equals('@'), neighbors) < 4) {
        accessible.push([i, j]);
      }
    }
  }
  return accessible;
}


const getTotalAccessible = (grid) => {
  let totalAccessible = 0;

  while (true) {
    const accessible = getAccessible(grid);
    if (accessible.length === 0) {
      break;
    }
    totalAccessible += accessible.length;
    set(grid, accessible, '.');
  }

  return totalAccessible;
};

console.log(R.length(getAccessible(grid)));
console.log(getTotalAccessible(grid));
