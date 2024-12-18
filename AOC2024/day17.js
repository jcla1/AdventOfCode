const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const progRegEx = /Register A: (\d+)\nRegister B: (\d+)\nRegister C: (\d+)\n\nProgram: ([\d,]+)/;

const parse = R.compose(
  ([a, b, c, prog]) => ([{A: parseInt(a), B: parseInt(b), C: parseInt(c)}, R.compose(U.toIntArr, R.split(','))(prog)]),
  R.drop(1),
  R.match(progRegEx));

const createRunner = (registers, program) => {
  let ip = 0;
  let rgs = R.clone(registers);

  let totalOutput = '';
  const out = (n) => totalOutput += n + ',';

  const stepProgram = () => {
    if (ip >= program.length) return () => totalOutput.slice(0, -1);
    const instr = program[ip];

    const {A, B, C} = rgs;
    const getComboOp = (op) => {
      if (0 <= op && op <= 3) return op;
      if (op == 4) return A;
      if (op == 5) return B;
      if (op == 6) return C;
      console.error('Invalid combo operand', op);
    };


    let op;
    switch (instr) {
      case 0: // ADV - combo op - A = A / 2^op
        op = getComboOp(program[ip + 1]);
        [rgs, ip] = [{A: ~~(A / Math.pow(2, op)), B, C}, ip + 2];
        break;
      case 1: // BXL - literal op - B = B ^ op
        op = program[ip + 1];
        [rgs, ip] = [{A, B: B ^ op, C}, ip + 2];
        break;
      case 2: // BST - combo op - B = op % 8
        op = getComboOp(program[ip + 1]);
        [rgs, ip] = [{A, B: op % 8, C}, ip + 2];
        break;
      case 3: // JNZ - literal op - ip = op if A != 0
        op = program[ip + 1];
        [rgs, ip] = [{A, B, C}, A != 0 ? op : ip + 2];
        break;
      case 4: // BXC - no op - B = B ^ C
        [rgs, ip] = [{A, B: B ^ C, C}, ip + 2];
        break;
      case 5: // OUT - combo op - print (op % 8)
        op = getComboOp(program[ip + 1]);
        out(op % 8);
        [rgs, ip] = [{A, B, C}, ip + 2];
        break;
      case 6: // BDV - combo op - B = A / 2^op
        op = getComboOp(program[ip + 1]);
        [rgs, ip] = [{A, B: ~~(A / Math.pow(2, op)), C}, ip + 2];
        break;
      case 7: // CDV - combo op - C = A / 2^op
        op = getComboOp(program[ip + 1]);
        [rgs, ip] = [{A, B, C: ~~(A / Math.pow(2, op))}, ip + 2];
        break;
      default:
        console.error('Invalid instruction', instr);
    }
    return stepProgram;
  }

  return stepProgram;
};

let [registers, program] = parse(input);
let step = createRunner(registers, program);
while (!R.is(String, step)) step = step();
console.log(step);

// Though there is a non-brute force way of solving the puzzle. My program input
// is: 2,4,1,2,7,5,1,3,4,4,5,5,0,3,3,0. Let's see what it does:
// 0: BST 4
// 1: BXL 2
// 2: CDV 5
// 3: BXL 3
// 4: BXC
// 5: OUT 5
// 6: ADV 3
// 7: JNZ 0
//
// Translated into a more readable form that is:
// B = A % 8
// B = B ^ 2
// C = A / 2^B
// B = B ^ 3
// B = B ^ C
// print (B)
// A = A / 2^3
// if A != 0 goto 0
//
// Condensed even further we get:
// A = 48 bits
// print (A % 8) ^  (A >> (A % 8)) ^ 1
// A = A >> 3
// if A != 0 goto 0
