const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('inputs/day02.input', 'utf8').trim();

const cmds = R.compose(
    R.map(R.compose(([cmd, dist]) => [cmd, parseInt(dist)], R.split(' '))),
    R.split('\n'))(input);

const encode = ([cmd, dist]) => {
  switch (cmd) {
    case 'forward': return [0, dist];
    case 'up': return [-1*dist, 0];
    case 'down': return [dist, 0];
  }
};

const part1 = R.compose(
    R.product,
    R.reduce(R.zipWith(R.add), [0, 0]),
    R.map(encode))(cmds);

console.log(part1);

const process = ([aim, depth, pos], [cmd, dist]) => {
  // prev contains an encoding of the current state
  // of the submarine. prev[0] is the aim, prev[1]
  // is the depth and prev[2] is the horizontal position.

  switch (cmd) {
    case 'forward': return [
      aim,
      depth + dist * aim,
      pos + dist,
    ];
    case 'up': return [aim - dist, depth, pos];
    case 'down': return [aim + dist, depth, pos];
  }
};

const subInfo = R.reduce(process, [0, 0, 0], cmds);

console.log(subInfo[1] * subInfo[2]);
