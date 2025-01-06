const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const connections = R.compose(
  R.map(R.o(xs => xs.toSorted(), R.map(R.last))),
  R.groupBy(R.head),
  R.unnest,
  R.map(R.compose(
    ([a, b]) => [[a, b], [b, a]],
    R.split('-'))),
  R.split('\n'))(input);


const getTriangles = (conns) => {
  const computerNames = R.keys(conns).toSorted();
  let triangles = [];

  for (let i = 0; i < computerNames.length; i++) {
    for (let j = i+1; j < computerNames.length; j++) {
      for (let k = j+1; k < computerNames.length; k++) {
        const n1 = computerNames[i];
        const n2 = computerNames[j];
        const n3 = computerNames[k];

        if ( R.includes(n1, conns[n2])
          && R.includes(n1, conns[n3])
          && R.includes(n2, conns[n1])
          && R.includes(n2, conns[n3])
          && R.includes(n3, conns[n1])
          && R.includes(n3, conns[n2])) { triangles.push([n1, n2, n3]) }
      }
    }
  }
  return triangles;
};

const hasCompStartingWithT = R.any(R.startsWith('t'));

const relevantTriangles = R.compose(
  R.filter(hasCompStartingWithT),
  getTriangles)(connections);

console.log(relevantTriangles.length);

const getMaxClique = (conns, node) => {
  const cNs = R.keys(conns).toSorted();
  let clique = [node];
  for (const n of cNs) {
    if (n == node) continue;

    const isNeighbouringAll = R.compose(
      R.allPass,
      R.map((m) => (n) => R.includes(n, conns[m])))(clique);
    if (isNeighbouringAll(n)) clique.push(n);
  }
  return clique;
};
const getLargestInterconnectedSet = (conns) => {
  const cNs = R.keys(conns).toSorted();

  let cliques = [];
  let remaining = R.clone(cNs);
  while (remaining.length > 0) {
    const node = R.head(remaining);
    const clique = getMaxClique(conns, node);

    cliques.push(clique);
    remaining = R.without(clique, remaining);
  }

  return R.compose(R.last, R.sortBy(R.length))(cliques);
};


const passwd = getLargestInterconnectedSet(connections).toSorted().join(',');
console.log(passwd);
