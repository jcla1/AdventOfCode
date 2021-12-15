const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('inputs/day08.input', 'utf8').trim();

const parseInstr = R.o(R.slice(1, 3), R.match(/^(.+) (.+)$/));

const instructions = R.compose(
    R.map(parseInstr),
    R.split('\n'))(input);

const runProgram = (instr) => {
  // staying functional:
  instr = R.clone(instr);

  let acc = 0; let ip = 0;
  while (true) {
    // true signifies that the program actually terminated.
    if (ip >= R.length(instr)) return [true, acc];
    if (instr[ip] === -1) return [false, acc];

    const [op, val] = instr[ip];
    instr[ip] = -1;

    switch (op) {
      case 'acc': acc += parseInt(val); break;
      case 'jmp':
        const diff = parseInt(val);
        if (diff === 0) return [false, acc];

        ip += parseInt(val) - 1; break;
    }

    ip++;
  }
};

console.log(runProgram(instructions)[1]);

const flipOp = (op) => op === 'acc' ? 'acc' : (op === 'jmp' ? 'nop' : 'jmp');
const toggleInstr = R.curry((instr, pos) =>
  R.adjust(pos, ([op, val]) => [flipOp(op), val], instr));

const resolvedOut = R.compose(
    R.o(R.nth(1), R.nth(0)),
    R.filter(R.nth(0)),
    R.map(R.o(runProgram, toggleInstr(instructions))),
    R.filter((n) => instructions[n][0] !== 'acc'),
)(R.range(0, R.length(instructions)));

console.log(resolvedOut);
