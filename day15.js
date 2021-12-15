const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('inputs/day15.input', 'utf8').trim();
// const input = `
// 1163751742
// 1381373672
// 2136511328
// 3694931569
// 7463417111
// 1319128137
// 1359912421
// 3125421639
// 1293138521
// 2311944581
// `.trim();

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

const get = R.curry((board, p) => R.view(R.lensPath(p), board));
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
const printBoard = R.compose(
    console.log,
    R.join('\n'),
    R.map(R.join(',')));

// breadth first search - gives the shortest distance from a start node to the
// bottom right node in the graph.
const dijkstra = (graph, start) => {
  const finalNode = [R.length(graph)-1, R.length(graph[0])-1];

  let q = indicies(graph);
  const dists = mapBoard((_) => Infinity, zerosLike(graph));
  set(dists, start, 0);

  while (R.length(q) !== 0) {
    const node = R.reduce(R.minBy((a, b) => get(dists, a)), R.nth(0, q), q);
    q = R.without([node], q);

    const neighbours = getNeighbours(graph, node);
    for (let i = 0; i < R.length(neighbours); i++) {
      const neighbour = neighbours[i];
      if (!R.includes(neighbour, q)) continue;

      const alt = get(dists, node) + get(graph, neighbour);

      if (alt < get(dists, neighbour)) {
        set(dists, neighbour, alt);
      }

      if (R.equals(finalNode, neighbour)) return get(dists, finalNode);
    }
  }

  return dists;
};

console.log(dijkstra(cave, [0, 0]));
