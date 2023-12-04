const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

const input = fs.readFileSync('inputs/day04.input', 'utf8').trim();

const parseNums = R.compose(
    U.toIntArr,
    R.filter(R.o(R.not, R.isEmpty)),
    R.split(/ +/));

const scratchcards = R.compose(
    R.map(R.compose(
        ([n, xs, ys]) => [parseInt(n), parseNums(xs), parseNums(ys)],
        R.take(3), R.drop(1),
        R.match(/^Card +(\d+):((?: *\d+)+) \|((?: *\d+)+)$/))),
    R.split('\n'))(input);

const wonScratchcardCounts = R.map(R.compose(
    R.length,
    R.apply(R.intersection),
    R.drop(1)))(scratchcards);

const winnings = R.compose(
    R.sum,
    R.map((k) => k > 0 ? Math.pow(2, k-1) : 0))(wonScratchcardCounts);

console.log(winnings);

// how annoying that ramda's reduce doesn't pass you the index
const scratchcardCounts = wonScratchcardCounts.reduce(
    (counts, won, i) => {
      const newCards = R.flatten([
        R.repeat(0, i+1),
        R.repeat(counts[i], won),
        R.repeat(0, scratchcards.length - won - i - 1),
      ]);
      return R.zipWith(R.add, counts, newCards);
    },
    R.repeat(1, scratchcards.length));

const totalScratchcards = R.sum(scratchcardCounts);
console.log(totalScratchcards);
