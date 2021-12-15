const R = require('ramda');
const fs = require('fs');

const {Heap} = require('heap-js');

const input = fs.readFileSync('inputs/day15.input', 'utf8').trim();

const cave = R.compose(
    R.map(R.o(R.map(parseInt), R.split(''))),
    R.split('\n'))(input);

// onBoard :: [[a]] -> (Int, Int) -> Bool
const onBoard = R.curry((board, [i, j]) => {
  const height = R.length(board);
  if (height === 0) return false;
  const width = R.length(board[0]);

  return 0 <= i && i < height && 0 <= j && j < width;
});

const getNeighbours = R.curry((board, [i, j]) => R.filter(onBoard(board), [
  [i-1, j], [i, j-1], [i, j+1], [i+1, j],
]));

const get = (board, p) => board[p[0]][p[1]];
const set = (board, p, v) => {
  board[p[0]][p[1]] = v;
};

const zerosLike = (board) => {
  const height = R.length(board);
  if (height === 0) return [];
  const width = R.length(board[0]);

  return R.map((_) => R.repeat(0, width), R.range(0, height));
};

const indicies = (board) => {
  const height = R.length(board);
  if (height === 0) return [];
  const width = R.length(board[0]);

  return R.chain((i) => R.map(R.pair(i), R.range(0, width)),
      R.range(0, height));
};

const mapBoard = (f, board) => R.map(R.map(f), board);

const boardToString = R.o(R.join('\n'), R.map(R.join(',')));
const printBoard = R.o(console.log, boardToString);

// breadth first search - gives the shortest distance from a start node to the
// bottom right node in the graph.
const astar = (graph) => {
  const start = [0, 0];
  const goal = [R.length(graph)-1, R.length(graph[0])-1];
  const h = ([i, j], [s, t]) => Math.abs(i - s) + Math.abs(j - t);

  const openSet = new Heap((a, b) => a[0] - b[0]);
  openSet.push([h(start, goal), start]);

  // we don't need an fScore, as that's hidden in the MinHeap
  const gScore = mapBoard((_) => Infinity, zerosLike(graph));
  set(gScore, start, 0);

  while (openSet.length !== 0) {
    const [_, node] = openSet.pop();
    if (R.equals(node, goal)) return get(gScore, node);

    const neighbours = getNeighbours(graph, node);
    for (let i = 0; i < R.length(neighbours); i++) {
      const neighbour = neighbours[i];

      const tentativeGScore = get(gScore, node) + get(graph, neighbour);
      if (tentativeGScore < get(gScore, neighbour)) {
        set(gScore, neighbour, tentativeGScore);

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
    R.map((k) => mapBoard(R.o(wrapNines, R.add(k)), board),
        R.range(0, 5)));

const biggerCaveMap = R.compose(
    R.transpose,
    extendDown,
    R.transpose,
    extendDown)(cave);

console.log(astar(biggerCaveMap));
