const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('inputs/day02.input', 'utf8').trim();

const pwPolicies = R.compose(
    R.map(R.o(
        R.slice(1, 5),
        R.match(/(\d+)-(\d+) ([a-z]): ([a-z]+)/))),
    R.split('\n'))(input);

const isValidPart1 = ([low, high, lett, pw]) => {
  // example p = ['1', '3', 'a', 'abcde']
  const letterCounts = R.compose(
      R.map(R.length),
      R.groupBy(R.identity))(pw);

  return parseInt(low) <= letterCounts[lett] &&
      letterCounts[lett] <= parseInt(high);
};

const isValidPart2 = ([low, high, lett, pw]) => {
  // for lack of a better logical XOR
  return (pw[parseInt(low)-1] === lett) != (pw[parseInt(high)-1] === lett);
};

console.log(R.compose(
    R.length,
    R.filter(isValidPart1))(pwPolicies));

console.log(R.compose(
    R.length,
    R.filter(isValidPart2))(pwPolicies));
