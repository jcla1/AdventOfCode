const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const helper = (total, running, nums, ops) => {
  if (nums.length === 0) {
    return total === running;
  }

  const applyOp = (op) => {
    if (running > total) return false;

    switch (op) {
      case '+':
        return helper(total, running + nums[0], nums.slice(1), ops);
      case '*':
        return helper(total, running * nums[0], nums.slice(1), ops);
        break;
      case '||':
        return helper(
            total, parseInt('' + running + nums[0]), nums.slice(1), ops);
    }
  };

  return ops.some(applyOp, ops);
};

const isValidWithOperators = (total, nums, ops = ['+', '*']) => {
  return helper(total, 0, nums, ops);
};

const lines = R.compose(
    R.map(R.compose(
        ([total, nums]) => [parseInt(total), U.toIntArr(R.split(' ', nums))],
        R.split(': '))),
    R.split('\n'))(input);

const totalCalibRes = R.compose(
    R.sum,
    R.map(R.head),
    R.filter(R.apply(isValidWithOperators)))(lines);

console.log(totalCalibRes);

const totalCalibResWithConcat = R.compose(
    R.sum,
    R.map(R.head),
    R.filter(
        ([t, ns]) => isValidWithOperators(t, ns, ['+', '*', '||'])))(lines);

console.log(totalCalibResWithConcat);
