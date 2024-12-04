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

// A* search algorithm. Given an abstract initial state and goal state, a
// function that, given a state, returns a list of possible next states, and a
// heuristic function that estimates the cost of getting between two states,
// returns the sequence of states that leads from the initial state to the goal
// state with the lowest cost.
//
// The states must be comparable with R.equals, i.e. the stopping criterion is
// R.equals(node, goalState), where node is the current state.
//
// Not using a proper heurisitic function will reduce this to Dijkstra's
// algorithm, which is the default.
const astar = (initialState, goalState, nextStates, heuristic = R.always(0), cost = R.always(1)) => {
  const reconstructPath = (cameFrom, current) => {
    if (R.equals(current, initialState)) return [current];
    return [...reconstructPath(cameFrom, cameFrom[current]), current];
  };

  // Items in the heap are tuples of [fScore, node], so the comparison function
  // is the comparison of fScores.
  const openSet = new Heap((a, b) => a[0] - b[0]);
  openSet.push([heuristic(initialState, goalState), initialState]);

  // Map we need for reconstructing the shorest path.
  let cameFrom = {};

  // We don't need an fScore, as that's hidden in the MinHeap
  let gScore = {};
  gScore[initialState] = 0;

  while (openSet.length !== 0) {
    // we discard the fScore when popping from the heap
    const [, node] = openSet.pop();
    if (R.equals(node, goalState)) return reconstructPath(cameFrom, node);

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
        openSet.push([tentativeGScore + heuristic(neighbour, goalState), neighbour]);
      }
    }
  }
  console.error('No path found.');
};

module.exports = {
  getInput,
  isUpperCase,
  isLowerCase,
  sign, maximum, minimum,
  toIntArr, reduce1,
  astar,
};
