const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('day2.input', 'utf8').trim();

const pwPolicies = R.compose(
    R.map(R.o(
        R.slice(1, 5),
        R.match(/(\d+)-(\d+) ([a-z]): ([a-z]+)/))),
    R.split('\n'))(input);

const isValidPart1 = (p) => {
  // example p = ['1', '3', 'a', 'abcde']
  const letterCounts = R.compose(
      R.map(R.length),
      R.groupBy(R.identity))(p[3]);

  return parseInt(p[0]) <= letterCounts[p[2]] &&
      letterCounts[p[2]] <= parseInt(p[1]);
};

const isValidPart2 = (p) => {
  // for lack of a better logical XOR
  return (p[3][parseInt(p[0])-1] === p[2]) != (p[3][parseInt(p[1])-1] === p[2]);
};

console.log(R.compose(
    R.length,
    R.filter(isValidPart1))(pwPolicies));

console.log(R.compose(
    R.length,
    R.filter(isValidPart2))(pwPolicies));
