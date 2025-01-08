const R = require('ramda');
const path = require('path');
const fs = require('fs');

const {Heap} = require('heap-js');

const getInput = (f) => {
  const inputPath = 'inputs/' + path.basename(f).replace('.js', '.input');
  return fs.readFileSync(inputPath, 'utf8').trim();
};

const isUpperCase = (s) => s === s.toUpperCase();
const isLowerCase = (s) => s === s.toLowerCase();

const sign = (x) => x === 0 ? 0 : (x > 0 ? 1 : -1);
const maximum = R.reduce(R.max, -Infinity);
const minimum = R.reduce(R.min, Infinity);

const toIntArr = R.map((n) => parseInt(n));
const reduce1 = R.curry((f, xs) => R.reduce(f, R.head(xs), R.tail(xs)));

const mergeAllWith = R.curry((f, xs) => R.reduce(R.mergeWith(f), {}, xs));

const aperture2D = R.curry(([n, k], grid) => {
  return R.compose(
      R.transpose,
      R.map(R.aperture(n)),
      R.transpose,
      R.map(R.aperture(k)))(grid);
});

// A* search algorithm. Given an abstract initial state and goal state, a
// function that, given a state, returns a list of possible next states, and a
// heuristic function that estimates the cost of getting between two states,
// returns the sequence of states that leads from the initial state to the goal
// state with the lowest cost.
//
// The goal can either be a function that returns true when a given state is the
// goal, or a specific state. If a specific state is given, states will be
// compared with R.equals.
//
// Not using a proper heurisitic function will reduce this to Dijkstra's
// algorithm, which is the default.
const astar = (initialState,
    goal,
    nextStates,
    heuristic = R.always(0),
    cost = R.always(1)) => {
  // non-recursive version of reconstructPath, as for long paths it will blow
  // over the stack limit.
  const reconstructPath = (cameFrom, current) => {
    const path = [current];
    while (!R.equals(current, initialState)) {
      current = cameFrom[current];
      path.unshift(current);
    }
    return path;
  };

  const areDone = R.is(Function, goal) ? goal : R.equals(goal);

  // Items in the heap are tuples of [fScore, node], so the comparison function
  // is the comparison of fScores.
  const openSet = new Heap((a, b) => a[0] - b[0]);
  openSet.push([heuristic(initialState), initialState]);

  // Map we need for reconstructing the shorest path.
  const cameFrom = {};

  // We don't need an fScore, as that's hidden in the MinHeap
  const gScore = {};
  gScore[initialState] = 0;

  while (openSet.length !== 0) {
    // we discard the fScore when popping from the heap
    const [, node] = openSet.pop();
    if (areDone(node)) return reconstructPath(cameFrom, node);

    const neighbours = nextStates(node);
    for (let i = 0; i < neighbours.length; i++) {
      const neighbour = neighbours[i];

      const tentativeGScore = gScore[node] + cost(node, neighbour);
      if (tentativeGScore < (gScore[neighbour] || Infinity)) {
        cameFrom[neighbour] = node;
        gScore[neighbour] = tentativeGScore;

        // Not sure why the pseudo-code implementation of this on Wikipedia
        // conditions the addition of the neighbour to the heap on if it's
        // already present.
        // If it is, but with a higher cost/score than this one, then it will
        // simply be ignored if we're just trying to solve the point-to-point
        // problem (and there is in fact a path between them).
        openSet.push([tentativeGScore + heuristic(neighbour), neighbour]);
      }
    }
  }
  // If, at the end no path is found, return undefined.
};

// Breadth-first search that will produce all possible paths from initial state
// to goal state. Management of the states/graph nodes works the same way as for
// the A* implementation.
// One must be careful with regard to loops in the graph, as this will result in
// an infinite loop trying to find paths.
const findAllPaths = (initialState, goal, nextStates) => {
  const areDone = R.is(Function, goal) ? goal : R.equals(goal);
  const paths = [];
  const queue = [[initialState]];

  while (queue.length !== 0) {
    const path = queue.shift();
    const last = R.last(path);
    if (areDone(last)) paths.push(path);
    else {
      const neighbours = nextStates(last);
      for (let i = 0; i < neighbours.length; i++) {
        const neighbour = neighbours[i];
        // if (!R.contains(neighbour, path)) queue.push([...path, neighbour]);
        queue.push([...path, neighbour]);
      }
    }
  }

  return paths;
};

module.exports = {
  getInput,
  isUpperCase,
  isLowerCase,
  sign, maximum, minimum,
  toIntArr, reduce1,
  mergeAllWith,
  aperture2D,
  astar, findAllPaths,
};
