const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const [pageRules, updateBlock] = R.split('\n\n', input);
const updates = R.compose(R.map(R.split(',')), R.split('\n'))(updateBlock);

const pageRuleMap = R.compose(
  R.map(R.map(R.nth(1))),
  R.groupBy(R.head),
  R.map(R.split('|')),
  R.split('\n'))(pageRules);

const violatesRule = (update) => {
  for (var i = update.length - 1; i > 0; i--) {
    const p = update[i];
    const following = pageRuleMap[p];
    if (!following) return false;

    const precGoAfter = R.compose(
      R.reduce(R.or, false),
      R.map(q => R.indexOf(q, following) >= 0))(update.slice(0, i));

    if (precGoAfter) {
      return true;
    }
  }
  return false;
};

const middle = (xs) => xs[xs.length >> 1];

const midPageNumSum = R.compose(
  R.sum,
  U.toIntArr,
  R.map(middle));

const [incorrectUpdates, correctUpdates] = R.partition(
  violatesRule, updates);

console.log(midPageNumSum(correctUpdates));

const sortedIncorrectUpdates = R.map(R.sort(
  (p, q) => {
    if (p === q) return 0;
    const pFollows = pageRuleMap[p];
    const qFollows = pageRuleMap[q];
    if (pFollows && R.indexOf(q, pFollows) >= 0) return -1;
    if (qFollows && R.indexOf(p, qFollows) >= 0) return 1;
    return 0;
  }),
  incorrectUpdates);

console.log(midPageNumSum(sortedIncorrectUpdates));
