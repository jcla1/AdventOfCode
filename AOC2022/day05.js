const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

// We're not trimming today, as whitespace in the stacks is significant;
// signifying an empty spot for a crate.
const input = fs.readFileSync('inputs/day05.input', 'utf8');

const [stacks, instr] = R.split('\n\n', input);

const parsedStacks = R.compose(
    R.map(R.filter(R.o(R.not, R.isNil))),
    R.transpose,
    R.map(R.compose(
        R.flatten,
        R.map(R.compose(
            R.drop(1),
            R.match(/(?:\[([A-Z])\]|   ) ?/))),
        R.splitEvery(4))),
    R.dropLast(1),
    R.split('\n'))(stacks);

const parsedInstr = R.compose(
    R.map(R.compose(
        U.toIntArr,
        R.drop(1),
        R.match(/move ([0-9]+) from ([0-9]+) to ([0-9]+)/))),
    R.split('\n'),
    R.trim)(instr);

const applyInstr = (s, i, reverse = true) => {
  s = R.clone(s);
  const [from, to, amt] = [i[1]-1, i[2]-1, i[0]];
  const f = reverse ? R.reverse : R.identity;

  s[to] = R.concat(f(R.take(amt, s[from])), s[to]);
  s[from] = R.drop(amt, s[from]);
  return s;
};

const getTopOfStacks = R.compose(R.join(''), R.flatten, R.map(R.take(1)));

const finalStacksWithReverse = R.compose(
    getTopOfStacks,
    R.reduce(applyInstr))(parsedStacks, parsedInstr);

console.log(finalStacksWithReverse);

const finalStacksNoReverse = R.compose(
    getTopOfStacks,
    R.reduce((s, i) => applyInstr(s, i, false)))(parsedStacks, parsedInstr);

console.log(finalStacksNoReverse);
