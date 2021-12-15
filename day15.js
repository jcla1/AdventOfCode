const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

const {Heap} = require('heap-js');

const input = fs.readFileSync('inputs/day15.input', 'utf8').trim();

const cave = R.compose(
    R.map(R.o(R.map(parseInt), R.split(''))),
    R.split('\n'))(input);

// breadth first search - gives the shortest distance from a start node to the
// bottom right node in the graph.
const astar = (graph) => {
  const start = [0, 0];
  const goal = [R.length(graph)-1, R.length(graph[0])-1];

  // Turns out: A* with a trivial heuristic (i.e. Dijkstra's algorithm) is
  // faster in this case. On a Late 2013 MBP by about 200ms (total runtime: 3.5
  // vs 3.3s)
  const h = R.always(0);
  // const h = ([i, j], [s, t]) => Math.abs(i - s) + Math.abs(j - t);

  const openSet = new Heap((a, b) => a[0] - b[0]);
  openSet.push([h(start, goal), start]);

  // we don't need an fScore, as that's hidden in the MinHeap
  const gScore = U.mapBoard((_) => Infinity, U.zerosLike(graph));
  U.set(gScore, start, 0);

  while (openSet.length !== 0) {
    const [, node] = openSet.pop();
    if (R.equals(node, goal)) return U.get(gScore, node);

    const neighbours = U.getNeighbours(graph, node);
    for (let i = 0; i < R.length(neighbours); i++) {
      const neighbour = neighbours[i];

      const tentativeGScore = U.get(gScore, node) + U.get(graph, neighbour);
      if (tentativeGScore < U.get(gScore, neighbour)) {
        U.set(gScore, neighbour, tentativeGScore);

        // Not sure why the pseudo-code implementation of this on wikipedia
        // conditions the addition of the neighbour to the heap on if it's
        // already present.
        // If it is, but with a higher cost/score than this one, then it will
        // simply be ignored if we're just trying to solve the point-to-point
        // problem.
        openSet.push([tentativeGScore + h(neighbour, goal), neighbour]);
      }
    }
  }
  return 'not found.';
};

console.log(astar(cave));

const wrapNines = (n) => n > 9 ? (n % 10) + 1 : n;

const extendDown = (board) => R.unnest(
    R.map((k) => U.mapBoard(R.o(wrapNines, R.add(k)), board),
        R.range(0, 5)));

const biggerCaveMap = R.compose(
    R.transpose,
    extendDown,
    R.transpose,
    extendDown)(cave);

console.log(astar(biggerCaveMap));
