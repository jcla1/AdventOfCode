const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const instructions = R.split('\n', input);

const run = (instructions, registers = {'a': 0, 'b': 0, 'c': 0, 'd': 0}) => {
  let ip = 0;
  while (ip < instructions.length) {
    const instr = instructions[ip];
    const [op, x, y] = R.split(' ', instr);
    switch (op) {
      case 'cpy':
        registers[y] = isNaN(parseInt(x)) ? registers[x] : parseInt(x);
        ip++;
        break;
      case 'inc':
        registers[x]++;
        ip++;
        break;
      case 'dec':
        registers[x]--;
        ip++;
        break;
      case 'jnz':
        const val = isNaN(parseInt(x)) ? registers[x] : parseInt(x);
        ip += val !== 0 ? parseInt(y) : 1;
        break;
    }
  }

  return registers;
};

console.log(run(instructions).a);
console.log(run(instructions, {'a': 0, 'b': 0, 'c': 1, 'd': 0}).a);
