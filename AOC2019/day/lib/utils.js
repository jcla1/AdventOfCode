const {addIndex, chain, isEmpty, remove, append, compose, map, length, lift, reduce} = require('ramda');
const fs = require('fs');

const parseFile = (day) =>
  fs.readFileSync(`./input/${day}.dat`)
      .toString()
      .split(/\n/)
      .filter(length);

const parseFileAsNumbers = compose(map(Number), parseFile);

const serialise = JSON.stringify;
const deserialise = JSON.parse;
const fastIntersection = (xs, ys) => {
  const [shorter, longer] = lift(map(serialise))(xs < ys ? [xs, ts] : [ys, xs]);
  return map(deserialise)(reduce((a, x) => {
    if (longer.indexOf(x) >= 0) a.push(x);
    return a;
  }, [], shorter));
};

const permutations = (tokens, subperms = [[]]) =>
  isEmpty(tokens) ?
    subperms :
    addIndex(chain)((token, idx) => permutations(
        remove(idx, 1, tokens),
        map(append(token), subperms),
    ), tokens);

module.exports = {
  parseFile,
  parseFileAsNumbers,
  fastIntersection,
  permutations,
};
