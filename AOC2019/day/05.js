const {reverse, clone, pipe, dropLast, takeLast} = require('ramda');
const input = require('./lib/utils').parseFile('05')[0];

const pI = parseInt;

runOps = (p, input) => {
  let i = 0; let lastOut = 0;
  const j = (xs) => pI(p[pI(xs)]);

  while (true) {
    const op = pipe(String, takeLast(2), pI)(p[i]);
    const m = pipe(String, dropLast(2), reverse)(p[i]);

    const left = j(pI(m[0]) ? i+1 : j(i+1));
    const right = j(pI(m[1]) ? i+2 : j(i+2));

    // console.log("memory:", p)
    // console.log("at index:", i)
    // console.log("new instr", p[i])
    // console.log("decoded as:", op, m, left, right)
    // console.log()

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
        p[j(i+1)] = input;
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
        console.log(op, m);
        return 'ERROR! unknown opcode encountered';
    }
  }
};

const p = input.split(',');
a = runOps(clone(p), 1);
b = runOps(clone(p), 5);

module.exports = {a: a, b: b};
