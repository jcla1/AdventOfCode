const {reverse, head, apply, equals, takeWhile, zip, prepend, keys, length, curry, sum, reduce, assoc, map, compose, split} = require('ramda');
const input = require('./lib/utils').parseFile('06');

const countOrbits = curry((orbitMap, p) =>
  orbitMap[p] ? 1 + countOrbits(orbitMap, orbitMap[p]) : 0);

const orbitPath = curry((orbitMap, p) =>
  orbitMap[p] ? prepend(p, orbitPath(orbitMap, orbitMap[p])) : ['COM']);

const longestCommonPrefix = compose(map(head), takeWhile(apply(equals)), zip);

const orbitMap = compose(
    reduce((m, [a, b]) => assoc(b, a, m), {}),
    map(split(')')),
)(input);

a = sum(map(countOrbits(orbitMap), keys(orbitMap)));
b = compose(
    ([xs, ys]) => length(xs) + length(ys) - 2 - 2*length(longestCommonPrefix(xs, ys)),
    map(reverse),
    map(orbitPath(orbitMap)),
)(['SAN', 'YOU']);

module.exports = {a, b};
