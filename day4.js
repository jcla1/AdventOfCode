const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('day4.input', 'utf8').split('\n');

const nums = R.compose(
    R.map(parseInt),
    R.split(','),
    R.head)(input);

const parseBoard = R.map(R.compose(
    R.map(parseInt),
    R.filter(R.compose(R.not, R.equals(''))),
    R.split(' ')));

const boards = R.compose(
    R.map(R.compose(parseBoard, R.dropLast(1))),
    R.groupWith(R.compose(R.not, R.equals(''))),
    R.drop(2))(input);

const markNumber = (n) => R.map(
    R.map(R.ifElse(R.equals(n), R.always(-1), R.identity)));

const isWinner = (b) => R.any(
    R.any(R.all(R.gt(0))),
    [b, R.transpose(b)]);

const score = R.compose(
    R.sum,
    R.filter(R.lt(0)),
    R.flatten);

const winningScore = R.reduce((boards, n) => {
  boards = R.map(markNumber(n), boards);

  const winner = R.find(isWinner, boards);
  if (winner) {
    return R.reduced(n * score(winner));
  }

  return boards;
}, boards, nums);

console.log(winningScore);

const lastWinningScore = R.reduce((boards, n) => {
  if (R.length(boards) === 1) {
    return R.reduced(n * (score(R.head(boards)) - n));
  }

  return R.compose(
      R.filter(R.compose(R.not, isWinner)),
      R.map(markNumber(n)))(boards);
}, boards, nums);

console.log(lastWinningScore);
