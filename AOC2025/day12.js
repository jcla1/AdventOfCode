const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const parseInput = (input) => {
  const sections = R.split('\n\n', input);
  const tileSections = R.init(sections);
  const layoutSection = R.last(sections);

  const tiles = R.map(R.compose(
    R.map(R.split('')),
    R.tail,
    R.split('\n')))(tileSections);

  const parseLayout = R.compose(
    (xs) => [U.toIntArr(R.take(2, xs)), U.toIntArr(R.split(' ', R.nth(2, xs)))],
    (m) => m.slice(1),
    R.match(/^(\d+)x(\d+): ((?:\d+ ?)+)$/));

  const layouts = R.compose(
    R.map(parseLayout),
    R.split('\n'))(layoutSection);

  return [tiles, layouts];
};

const [tiles, layouts] = parseInput(input);

const tileAreas = R.map(
  R.compose(R.sum, R.map((s) => s === '#' ? 1 : 0), R.flatten))(tiles);

const fitsTiles = ([size, layout]) => {
  const area = size[0] * size[1];
  const neededArea = R.compose(
    R.sum,
    R.zipWith(R.unapply(R.product), tileAreas))(layout);

  return neededArea <= area;
};

const fitCount = R.compose(
  R.length,
  R.filter(fitsTiles))(layouts);
console.log(fitCount);
