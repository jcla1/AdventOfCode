const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const parseLine = (line) => {
  const [pattern, ...rest] = line.split(' ');

  const lightPattern = R.compose(
    R.map((c) => c == '#' ? 1 : 0),
    R.slice(1, -1),
    R.split(''))(pattern);

  const buttons = R.compose(
    R.map(R.compose(
      U.toIntArr,
      R.split(','),
      R.replace(/[()]/g, ''))),
    R.slice(0, -1))(rest);

  const joltages = R.compose(
    U.toIntArr,
    R.split(','),
    R.replace(/[{}]/g, ''),
    R.last)(rest);

  return {lightPattern, buttons, joltages};
};

const lines = R.compose(
  R.map(parseLine),
  R.split('\n'),
  R.trim)(input);

const applyButtonForLight = (bt) => (s) => R.addIndex(R.map)((v, i) => bt.includes(i) ? 1 - v : v, s);
const nextStates = (fn) => (bts) => (s) => R.map((b) => fn(b)(s), bts);

const minNumPressesForLights = R.compose(
  R.sum,
  R.map(R.o(R.dec, R.length)),
  R.map(({lightPattern, buttons}) => U.astar(
    new Array(lightPattern.length).fill(0),
    lightPattern,
    nextStates(applyButtonForLight)(buttons))))(lines);
console.log(minNumPressesForLights);

// again, ugly as hell with the async init
(async () => {

const { Context } = await require('z3-solver').init();

const findMinButtonPresses = async ({ buttons, joltages }) => {
  const Z3 = Context('main');
  const solver = new Z3.Optimize();
  const presses = Array.from({ length: buttons.length }, (_, i) => Z3.Int.const(`btn_${i}`));

  // Can't press a button a negative number of times
  for (let i = 0; i < presses.length; i++) {
    solver.add(presses[i].ge(0));
  }

  const resJoltages = Array.from({ length: joltages.length }, (_, j) => Z3.Int.val(0));
  for (let k = 0; k < joltages.length; k++) {
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].includes(k)) {
        // each button press increases the joltage by 1
        resJoltages[k] = resJoltages[k].add(presses[i]);
      }
    }

    solver.add(resJoltages[k].eq(joltages[k]));
  }


  // we want the minimal number of button presses to reach each joltage
  let noTotalPresses = Z3.Int.val(0);
  for (let i = 0; i < presses.length; i++) {
    noTotalPresses = noTotalPresses.add(presses[i]);
  }
  solver.minimize(noTotalPresses);

  await solver.check();

  const result = [];
  for (let i = 0; i < presses.length; i++) {
    result.push(solver.model().eval(presses[i]).toString());
  }
  return R.sum(U.toIntArr(result));
};

let minNumPressesForJoltages = 0;
for (let i = 0; i < lines.length; i++) {
  minNumPressesForJoltages += await findMinButtonPresses(lines[i]);
}
console.log(minNumPressesForJoltages);

})();
