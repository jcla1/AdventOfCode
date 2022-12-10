const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('inputs/day10.input', 'utf8').trim();

const processInstrs = (instrs) => {
  const readOuts = []; const crt = R.repeat('.', 40 * 6);
  let cycle = 1; let register = 1;

  const incCycle = () => {
    if (cycle % 40 == 20) {
      readOuts.push(cycle * register);
    }

    if (Math.abs((cycle % 40) - register - 1) <= 1) {
      crt[cycle-1] = '#';
    }
    cycle++;
  };

  for (let i = 0; i < instrs.length; i++) {
    const [instr, ...params] = instrs[i];
    switch (instr) {
      case 'noop': incCycle(); break;
      case 'addx':
        incCycle(); incCycle();
        register += parseInt(params[0]);
        break;
    }
  }

  return [R.sum(readOuts), R.splitEvery(40, crt)];
};

const printImg = R.compose(console.log, R.join('\n'), R.map(R.join('')));

const parsedInstr = R.compose(
    R.map(R.split(' ')),
    R.split('\n'))(input);

const [signalStrengths, img] = processInstrs(parsedInstr);

console.log(signalStrengths);
printImg(img);
