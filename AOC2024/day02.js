const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

const input = fs.readFileSync('inputs/day02.input', 'utf8').trim();

const nums = R.compose(
    R.map(U.toIntArr),
    R.map(R.split(/\s+/)),
    R.split('\n'))(input);

// Part 1

const validRange = R.all((n) => (n <= -1 && -3 <= n) || (1 <= n && n <= 3));
const sameSign = R.compose(
    R.reduce(R.and, true),
    R.map(R.apply(R.equals)),
    R.aperture(2),
    R.map(U.sign));

const isSafe = R.compose(
    (diffs) => sameSign(diffs) && validRange(diffs),
    R.map(R.apply(R.subtract)),
    R.aperture(2));

const safeCount = R.compose(
    R.prop(true),
    R.countBy(R.identity),
    R.map(isSafe))(nums);

console.log(safeCount);

// Part 2

const allRemovals = R.compose(
    R.map(([i, xs]) => R.remove(i, 1, xs)),
    (xs) => R.zip(R.range(0, R.length(xs)), R.repeat(xs, R.length(xs))));

const dampenedSafeCount = R.compose(
    R.prop(true),
    R.countBy(R.identity),
    R.map(R.compose(
        R.reduce(R.or, false),
        R.map(isSafe))),
    R.map(allRemovals))(nums);

console.log(dampenedSafeCount);
