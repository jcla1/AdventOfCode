const R = require('ramda');
const U = require('./util.js');

const Heap = require('heap-js').Heap;

// why, why, why!?
import('@easy-data-structure-js/union-find').then((m) => {
const UnionFind = m.UnionFind;

const input = U.getInput(__filename);

const dist = ([x1, y1, z1], [x2, y2, z2]) => (x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2;

const points = R.compose(
  R.map(R.o(U.toIntArr, R.split(','))),
  R.split('\n'))(input);

const minHeap = new Heap((p1, p2) => dist(...p1) - dist(...p2));
for (let i = 0; i < points.length; i++) {
  for (let j = i + 1; j < points.length; j++) {
    minHeap.push([points[i], points[j]]);
  }
}

const uf = new UnionFind(points.length);
const connectionsToMake = 1000;
for (let i = 0; i < connectionsToMake; i++) {
  const [p1, p2] = minHeap.pop();
  const idx1 = points.indexOf(p1);
  const idx2 = points.indexOf(p2);
  uf.union(idx1, idx2);
}

const circuitSizes = new Array(points.length).fill(0);
for (let i = 0; i < points.length; i++) {
  const root = uf.find(i);
  circuitSizes[root]++;
}

const product = R.compose(
  R.product,
  R.take(3),
  R.sort(R.descend(R.identity)),
  R.filter(R.lt(0)))(circuitSizes);
console.log(product);

while (true) {
  const [p1, p2] = minHeap.pop();
  const idx1 = points.indexOf(p1);
  const idx2 = points.indexOf(p2);
  uf.union(idx1, idx2);

  if (uf.getCount() === 1) {
    console.log(p1[0] * p2[0]);
    break;
  }
}

});
