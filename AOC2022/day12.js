const R = require('ramda');
const {Heap} = require('heap-js');
const fs = require('fs');

const U = require('./util.js');

const input = fs.readFileSync('inputs/day12.input', 'utf8').trim();

const canStep = (graph, a, b) => {
  const charA = U.get(graph, a); const charB = U.get(graph, b);
  return charA.charCodeAt(0) - charB.charCodeAt(0) >= -1;
};

// A* algorithm, implementation taken from AOC2021 day 15
const astar = (graph, start, goal, h = R.always(0)) => {
  const openSet = new Heap((a, b) => a[0] - b[0]);
  openSet.push([h(start, goal), start]);

  // we don't need an fScore, as that's hidden in the MinHeap
  const gScore = U.mapBoard(R.always(Infinity), U.zerosLike(graph));
  U.set(gScore, start, 0);

  while (openSet.length !== 0) {
    const [, node] = openSet.pop();
    if (R.equals(node, goal)) return U.get(gScore, node);

    const neighbours = U.plusNeighbours(node);
    for (let i = 0; i < R.length(neighbours); i++) {
      const neighbour = neighbours[i];

      if (!(U.onBoard(graph, neighbour) &&
          canStep(graph, node, neighbour))) continue;

      const tentativeGScore = U.get(gScore, node) + 1;
      if (tentativeGScore < U.get(gScore, neighbour)) {
        U.set(gScore, neighbour, tentativeGScore);
        openSet.push([tentativeGScore + h(neighbour, goal), neighbour]);
      }
    }
  }
  return 'not found.';
};

const terrain = R.compose(R.map(R.split('')), R.split('\n'))(input);
const start = U.findIndicies(R.equals('S'), terrain)[0];
const goal = U.findIndicies(R.equals('E'), terrain)[0];

U.set(terrain, start, 'a');
U.set(terrain, goal, 'z');

// Number of steps of shortest path, from start.
console.log(astar(terrain, start, goal));

const shortestHike = R.compose(
    R.head,
    R.sortBy(R.identity),
    R.filter(R.is(Number)),
    R.map((s) => astar(terrain, s, goal)),
    U.findIndicies(R.equals('a')))(terrain);

console.log(shortestHike);
