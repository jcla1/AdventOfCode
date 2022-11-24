const {equals, map, tail, head, liftN, range, last, compose, filter} = require('ramda');
const input = require('./lib/utils').parseFile('02')[0];

runIntcode = (p, noun=12, verb=2) => {
  p[1] = noun; p[2] = verb;
  let i = 0;
  while (true) {
    switch (p[i]) {
      case 1:
        p[p[i + 3]] = p[p[i + 1]] + p[p[i + 2]];
        i += 4;
        break;
      case 2:
        p[p[i + 3]] = p[p[i + 1]] * p[p[i + 2]];
        i += 4;
        break;
      case 99:
        return p[0];
      default:
        return 'ERROR! unknown opcode encountered';
    }
  }
};

const p = map(parseInt, input.split(','));
const b = compose(
    ([noun, verb]) => 100 * noun + verb,
    head, head,
    filter(compose(equals(19690720), last)),
    map((args) => [tail(args), runIntcode(...args)]),
    liftN(2, (a, b) => ([[...p], a, b])),
)(range(0, 99), range(0, 99));

module.exports = {
  a: runIntcode(p),
  b: b,
};
