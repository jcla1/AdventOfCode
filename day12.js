const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('day12.input', 'utf8').trim();

const graph = R.compose(
  R.map(R.map(R.nth(1))),
  R.groupBy(R.nth(0)),
  R.unnest,
  R.juxt([R.identity, R.map(R.reverse)]),
  R.map(R.split('-')),
  R.split('\n'))(input);

const isUpperCase = s => s === s.toUpperCase(),
      maximum     = R.reduce(R.max, -Infinity);

const isValidNext = R.curry((noVisit, maxVisit, cave) => {
  if (cave === 'start') return false;
  if (isUpperCase(cave) || !R.has(cave, noVisit)) return true;
  return maximum(R.values(noVisit)) < maxVisit;
});

const findPaths = (graph, from, to, maxVisit = 1, noVisit = {}) => {
  if (from === to) return [[to]];

  const addInVisits = isUpperCase(from) ? {} : R.fromPairs([[from, 1]]),
        visitCounts = R.mergeWith(R.add, addInVisits, noVisit);

  return R.compose(
    R.unnest,
    R.map(next => {
      const pathsFromNext = findPaths(graph, next, to, maxVisit, visitCounts);
      return R.map(R.prepend(from), pathsFromNext);
    }),
    R.filter(isValidNext(visitCounts, maxVisit)))(graph[from]);
}

console.log(R.length(findPaths(graph, 'start', 'end')));
console.log(R.length(findPaths(graph, 'start', 'end', 2)));
