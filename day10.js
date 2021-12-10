const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('day10.input', 'utf8').trim();

const lines            = R.split('\n', input),
      mismatchScores   = {')': 3, ']': 57, '}': 1197, '>': 25137},
      completionScores = {')': 1, ']': 2, '}': 3, '>': 4},
      matchingParens   = {'(': ')', '[': ']', '{': '}', '<': '>'},
      isOpen           = R.flip(R.includes)(R.keys(matchingParens)),
      isMatchingClose  = (l, r) => (matchingParens[l] === r);

const findLineMismatch = R.reduce((stack, p) => {
    if (isOpen(p)) return R.prepend(p, stack);

    [top, ...stack] = stack;
    if (!isMatchingClose(top, p)) return R.reduced(p);

    return stack;
  }, []);

const fileScore = R.compose(
  R.sum,
  R.map(R.flip(R.prop)(mismatchScores)),
  R.filter(c => typeof(c) === 'string'),
  R.map(findLineMismatch))(lines);

console.log(fileScore);

const findCompletionScore = R.compose(
  R.reduce((score, p) => score * 5 + p, 0),
  R.map(p => completionScores[matchingParens[p]]));

const completionScore = R.compose(
  R.median,
  R.map(findCompletionScore),
  R.filter(xs => typeof(xs) === 'object' && R.length(xs) > 0),
  R.map(findLineMismatch)
)(lines);

console.log(completionScore);