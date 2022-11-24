const {reverse, range, max, compose, reduce, curry, map, clone, pipe, dropLast, takeLast} = require('ramda');
const {permutations} = require('./lib/utils');
const input = require('./lib/utils').parseFile('07')[0];

const pI = parseInt;

runOps = (p, input) => {
  let i = 0; let k = 0; let lastOut = 0;
  const j = (xs) => pI(p[pI(xs)]);

  while (true) {
    const op = pipe(String, takeLast(2), pI)(p[i]);
    const m = pipe(String, dropLast(2), reverse)(p[i]);

    const left = j(pI(m[0]) ? i+1 : j(i+1));
    const right = j(pI(m[1]) ? i+2 : j(i+2));


    switch (op) {
      case 1:
        p[j(i+3)] = left + right;
        i += 4;
        break;
      case 2:
        p[j(i+3)] = left * right;
        i += 4;
        break;
      case 3:
        p[j(i+1)] = input[k++];
        i += 2;
        break;
      case 4:
        // console.log("output:", left);
        lastOut = left;
        i += 2;
        break;
      case 5:
        if (left !== 0) {
          i = right;
        } else {
          i += 3;
        }
        break;
      case 6:
        if (left === 0) {
          i = right;
        } else {
          i += 3;
        }
        break;
      case 7:
        if (left < right) {
          p[j(i+3)] = 1;
        } else {
          p[j(i+3)] = 0;
        }
        i += 4;
        break;
      case 8:
        if (left === right) {
          p[j(i+3)] = 1;
        } else {
          p[j(i+3)] = 0;
        }
        i += 4;
        break;
      case 99:
        return lastOut;
      default:
        console.log('unknown opcode:', op, m);
        return 'ERROR! unknown opcode encountered';
    }
  }
};

const seqAmplifiers = curry((p, phases) =>
  reduce((i, f) => f(i), 0,
      map((ps) => (i) => runOps(clone(p), [ps, i]), phases)));

const p = input.split(',');
a = 0; b = 0;

a = compose(
    reduce(max, -Infinity),
    map(seqAmplifiers(p)),
    permutations,
)(range(0, 5));

module.exports = {a: a, b: b};
