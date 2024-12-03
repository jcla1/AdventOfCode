const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const initialChipDistributions = R.compose(
    R.map(R.compose(
        ([v, b]) => ({value: v, bot: b}),
        U.toIntArr,
        R.drop(1),
        R.match(/^value (\d+) goes to bot (\d+)$/))),
    R.filter(R.startsWith('value')),
    R.split('\n'))(input);

// At this point it is important that R.groupBy preserves the order of the
// elements in the list. This is because the bots must receive the chips in the
// order they were given.
const botInputs = R.compose(
    R.map(R.map(R.prop('value'))),
    R.groupBy(R.prop('bot')))(initialChipDistributions);

const distributions = R.compose(
    R.map(R.compose(
        ([b, lowTo, low, highTo, high]) => ({bot: b, lowTo, low, highTo, high}),
        R.drop(1),
        R.match(/^bot (\d+) gives low to (bot|output) (\d+) and high to (bot|output) (\d+)$/))),
    R.filter(R.startsWith('bot')),
    R.split('\n'))(input);


const processDistributions = (initialInputs, distributions) => {
  let outputs = {};
  let botStacks = R.clone(initialInputs);

  let curInstrIdx = 0;
  while (distributions.length > 0) {
    const instr = distributions[curInstrIdx++ % distributions.length];
    // console.log(instr);
    // console.log(botStacks);
    if (!botStacks[instr.bot] || botStacks[instr.bot].length < 2) {
      continue;
    }

    const [a, b] = R.take(2, botStacks[instr.bot]);
    const [low, high] = R.sortBy(R.identity, [a, b]);
    // console.log('current input stack, low:', low, 'high:', high);

    if (low === 17 && high === 61) {
      console.log('bot that compares 17 and 61:', instr.bot);
    }
    if (outputs[0] && outputs[1] && outputs[2]) break;

    if (instr.lowTo === 'bot') {
      const lowBotStack = R.propOr([], instr.low, botStacks);
      botStacks = R.assoc(instr.low, R.append(low, lowBotStack), botStacks);
    } else if (instr.lowTo === 'output') {
      const lowOutputStack = R.propOr([], instr.low, outputs);
      outputs = R.assoc(instr.low, R.append(low, lowOutputStack), outputs);
    }

    if (instr.highTo === 'bot') {
      const highBotStack = R.propOr([], instr.high, botStacks);
      botStacks = R.assoc(instr.high, R.append(high, highBotStack), botStacks);
    } else if (instr.highTo === 'output') {
      const highOutputStack = R.propOr([], instr.high, outputs);
      outputs = R.assoc(instr.high, R.append(high, highOutputStack), outputs);
    }

    botStacks = R.assoc(instr.bot, R.drop(2, botStacks[instr.bot]), botStacks);
    // console.log('new bot stacks:', botStacks);
    // console.log('new outputs:', outputs);
    // console.log('-----');
  }

  return outputs;
};

const outs = processDistributions(botInputs, distributions);
console.log(outs[0][0] * outs[1][0] * outs[2][0]);
