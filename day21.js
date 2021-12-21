const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

const input = fs.readFileSync('inputs/day21.input', 'utf8').trim();

const startPos = R.compose(
    R.map(R.o(R.nth(1), R.match(/Player \d starting position: (\d+)/))),
    R.split('\n'))(input);

const determinsiticGame = ([p1, p2]) => {
  // we're using position 0 to represent 10
  p1 %= 10; p2 %= 10;

  let p1Score = 0;
  let p2Score = 0;

  let die = 1;
  while (true) {
    p1 = (p1 + 3 * die + 3) % 10;
    p1Score += p1 === 0 ? 10 : p1;
    die += 3;

    if (p1Score >= 1000) break;

    p2 = (p2 + 3 * die + 3) % 10;
    p2Score += p2 === 0 ? 10 : p2;
    die += 3;

    if (p2Score >= 1000) break;
  }

  return R.min(p1Score, p2Score) * (die - 1);
};

console.log(determinsiticGame(startPos));

const possibleSeqs = R.map(R.o(R.sum, R.unnest), R.xprod(R.xprod([1, 2, 3], [1, 2, 3]), [1, 2, 3]));
const quantumGame = R.memoizeWith(
    R.unapply(R.toString),
    ([p1, p2], [p1Score, p2Score]) => {
      p1 %= 10; p2 %= 10;

      // Only need to check on p2, since he's always going to be the last updated
      // player.
      if (p2Score >= 21) return [0, 1];

      return R.reduce(R.zipWith(R.add), [0, 0],
          R.map((t) => {
            const pos = (p1 + t) % 10;
            return R.reverse(
                quantumGame(
                    [p2, pos],
                    [p2Score, p1Score + (pos === 0 ? 10 : pos)]));
          }, possibleSeqs));
    });

console.log(R.apply(R.max, quantumGame(startPos, [0, 0])));
