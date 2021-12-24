const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('inputs/day24.input', 'utf8').trim();

const parseInstr = R.compose(
    R.prop('groups'),
    R.match(/^(?<instr>\w+) (?<op1>[a-z0-9]+) ?(?<op2>-?[a-z0-9]+)?$/));

const monadProgram = R.compose(
    R.map(parseInstr),
    R.split('\n'))(input);

const runProgram = (program, stdin) => {
  // convert input number to digits
  stdin = R.compose(R.map(parseInt), R.split(''))(stdin.toString());
  const vals = {'x': 0, 'y': 0, 'w': 0, 'z': 0};

  for (let i = 0; i < program.length; i++) {
    const instr = program[i];

    let b = 0;
    if (!!instr['op2']) {
      if (R.test(/\d/, instr['op2'])) {
        b = parseInt(instr['op2']);
      } else {
        b = vals[instr['op2']];
      }
    }

    switch (instr['instr']) {
      case 'inp':
        if (stdin.length === 0) {
          console.error('stdin already empty!');
          return;
        }
        vals[instr['op1']] = stdin[0];
        stdin = R.drop(1, stdin);

        break;
      case 'add':
        vals[instr['op1']] += b;
        break;
      case 'mul':
        vals[instr['op1']] *= b;
        break;
      case 'eql':
        vals[instr['op1']] = vals[instr['op1']] === b ? 1 : 0;
        break;

      case 'div':

        vals[instr['op1']] = ~~(vals[instr['op1']] / b);
        break;
      case 'mod':
        vals[instr['op1']] = vals[instr['op1']] % b;
        break;

      default: console.error('unknown instruction!', instr);
    }
  }
  return vals;
};

// Using the program exectutor doesn't actually lead to finding the solution as
// the search space is too large. You have to rely on 'understanding' the input
// to see what the constraints on the digits are
// Reading the program instructions reveals the following constraints on the 14
// digits w_1, w_2, ..., w_14 of the answers:
// w_5 = 1, w_4 = 9
// w_7 = w_6 - 4
// w_8 = w_3 + 5
// w_10 = w_9
// w_12 = w_11 + 2
// w_13 = w_2 + 1
// w_14 = w_1 - 5

console.log('98491959997994');
console.log('61191516111321');
