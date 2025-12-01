const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const ops = R.compose(
  R.map((l) => (l[0] == 'L' ? -1 : 1) * parseInt(l.slice(1))),
  R.split('\n'))(input);

const zeroCount = R.compose(
  R.prop(true),
  R.countBy(R.equals(0)),
  R.scan((n, t) => R.mathMod(n + t, 100), 50))(ops);
console.log(zeroCount);

const advance = ([n, _], t) => {
  const nn = R.mathMod(n + t, 100);
  const z = Math.abs(Math.floor((n + t) / 100));

  return [nn, z];
};

const properZeroCount = R.compose(
  R.sum,
  R.map(R.nth(1)),
  R.scan(advance, [50, 0]))(ops);
console.log(properZeroCount);
