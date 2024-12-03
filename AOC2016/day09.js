const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const expandSimple = (input) => {
  if (input.length === 0) return '';

  const instrRegex = /\((\d+)x(\d+)\)/;
  let p = 0;

  let nextInstr = input.search(instrRegex);
  while (nextInstr != p-1) {
    const prefix = input.slice(0, nextInstr);

    const instrMatch = R.match(instrRegex, R.drop(nextInstr, input));
    const instrLen = instrMatch[0].length;
    const [stepSize, rep] = U.toIntArr(instrMatch.slice(1));

    const expansion = R.repeat(
        R.slice(nextInstr + instrLen, nextInstr + instrLen + stepSize, input),
        rep).join('');

    input = prefix + expansion + input.slice(nextInstr + instrLen + stepSize);
    p = p + expansion.length;

    nextInstr = p + input.slice(p).search(instrRegex);
  }

  return input;
};
console.log(expandSimple(input).length);

const isLetter = (c) => c.match(/[a-zA-Z]/);

const fullLengthCount = (input) => {
  const instrRegex = /\((\d+)x(\d+)\)/;

  const weights = new Array(input.length).fill(1);
  let totalLen = 0;

  for (let i = 0; i < input.length; i++) {
    if (isLetter(input[i])) {
      totalLen += weights[i];
      continue;
    }

    // otherwise we must be at a multiply marker
    const instr = R.match(instrRegex, R.drop(i, input));
    const instrLen = instr[0].length;
    const [stepSize, rep] = U.toIntArr(instr.slice(1));

    for (let j = i + instrLen; j < i + instrLen + stepSize; j++) {
      weights[j] = weights[j] * rep;
    }
    i = i + instrLen - 1;
  }

  return totalLen;
};
console.log(fullLengthCount(input));
