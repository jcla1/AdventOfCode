const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const parseLine = (line) => {
  const [pattern, ...rest] = line.split(' ');

  const lightPattern = R.compose(
    R.map((c) => c == '#' ? 1 : 0),
    R.slice(1, -1),
    R.split(''))(pattern);

  const buttons = R.compose(
    R.map(R.compose(
      U.toIntArr,
      R.split(','),
      R.replace(/[()]/g, ''))),
    R.slice(0, -1))(rest);

  const joltages = R.compose(
    U.toIntArr,
    R.split(','),
    R.replace(/[{}]/g, ''),
    R.last)(rest);

  return {lightPattern, buttons, joltages};
};

const lines = R.compose(
  R.map(parseLine),
  R.split('\n'),
  R.trim)(input);

const applyButtonForLight = (bt) => (s) => R.addIndex(R.map)((v, i) => bt.includes(i) ? 1 - v : v, s);
const nextStates = (fn) => (bts) => (s) => R.map((b) => fn(b)(s), bts);

const minNumPressesForLights = R.compose(
  R.sum,
  R.map(R.o(R.dec, R.length)),
  R.map(({lightPattern, buttons}) => U.astar(
    new Array(lightPattern.length).fill(0),
    lightPattern,
    nextStates(applyButtonForLight)(buttons))))(lines);
console.log(minNumPressesForLights);

const applyButtonForJoltages = (bt) => (s) => R.addIndex(R.map)((v, i) => bt.includes(i) ? v + 1 : v, s);

const minNumPressesForJoltages = R.compose(
  R.sum,
  R.map(R.o(R.dec, R.length)),
  R.map(({joltages, buttons}) => U.astar(
    new Array(joltages.length).fill(0),
    joltages,
    nextStates(applyButtonForJoltages)(buttons))))(lines);
console.log(minNumPressesForJoltages);
