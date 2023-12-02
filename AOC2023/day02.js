const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

const input = fs.readFileSync('inputs/day02.input', 'utf8').trim();

const cubeCounts = {
  'red': 12, 'green': 13, 'blue': 14,
};

const validGame = (g) => {
  g = R.mergeLeft(g, cubeCounts);
  return g['red'] <= cubeCounts['red'] && g['green'] <= cubeCounts['green'] && g['blue'] <= cubeCounts['blue'];
};

const parseGame = R.compose(
    R.apply(R.zipObj),
    ([ns, cs]) => [cs, U.toIntArr(ns)],
    R.transpose,
    R.map(R.compose(
        R.drop(1), R.take(3),
        R.match(/ (\d+) ([a-z]+)/))));

const extractCubeCounts = R.compose(
    R.map(R.compose(
        parseGame,
        R.split(','))),
    R.split(';'));

const games = R.compose(
    R.map(R.compose(
        (m) => [parseInt(m[1]), extractCubeCounts(m[2])],
        R.match(/^Game (\d+):(.*)$/))),
    R.split('\n'))(input);


const invalidIDSum = R.compose(
    R.sum,
    R.map(R.nth(0)),
    R.filter((g) => R.all(validGame, g[1])))(games);

console.log(invalidIDSum);

const powerSum = R.compose(
    R.sum,
    R.map(R.compose(
        R.product,
        R.values,
        U.reduce1(R.mergeWith(R.max)),
        R.nth(1))))(games);

console.log(powerSum);
