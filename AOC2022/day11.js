const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

const input = fs.readFileSync('inputs/day11.input', 'utf8').trim();

const parseMonkey = (m) => {
  const [mid, items, op, test, succ, fail] = R.split('\n', m);
  return {
    id: parseInt(R.match(/([0-9]+):$/, mid)[1]),
    items: R.compose(U.toIntArr,
        R.split(', '),
        R.head,
        R.match(/([0-9]+(, )?)+$/))(items),
    op: R.compose(R.slice(1, 3), R.match(/(.) (([0-9]+|old))$/))(op),
    test: parseInt(R.match(/([0-9]+)$/, test)[1]),
    succ: parseInt(R.match(/([0-9]+)$/, succ)[1]),
    fail: parseInt(R.match(/([0-9]+)$/, fail)[1]),
    numInspected: 0,
  };
};

const applyOp = (wl, [op, rhs]) => {
  const n = rhs === 'old' ? wl : parseInt(rhs);
  switch (op) {
    case '+': return wl + n;
    case '*': return wl * n;
  }
};

const playMonkeyRound = (ms, reduction = true) => {
  const lcm = R.compose(
      R.product,
      R.map(R.prop('test')))(ms);
  for (let i = 0; i < ms.length; i++) {
    const m = ms[i];
    for (let j = 0; j < m['items'].length; j++) {
      m['numInspected']++;

      let worryLevel = m['items'][j];
      worryLevel = applyOp(worryLevel, m['op']);
      if (reduction) {
        worryLevel = ~~(worryLevel / 3);
      }
      worryLevel %= lcm;

      const nextMonkey = m[worryLevel % m['test'] === 0 ? 'succ' : 'fail'];
      ms[nextMonkey]['items'].push(worryLevel);
    }
    m['items'] = [];
  }
  return ms;
};

const monkeyBusinessLevel = R.compose(
    R.product,
    R.takeLast(2),
    R.sortBy(R.identity),
    R.map(R.prop('numInspected')));

const monkeys = R.compose(
    R.map(parseMonkey),
    R.split('\n\n'))(input);

const monkeysCopy = R.clone(monkeys);

for (let i = 0; i < 20; i++) {
  playMonkeyRound(monkeys);
}
for (let i = 0; i < 10000; i++) {
  playMonkeyRound(monkeysCopy, false);
}

console.log(monkeyBusinessLevel(monkeys));
console.log(monkeyBusinessLevel(monkeysCopy));
