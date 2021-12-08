const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('day2.input', 'utf8').trim();

const cmds = R.compose(
  R.map(R.pipe(R.split(' '), c => [c[0], parseInt(c[1])])),
  R.split('\n'))(input);

const encode = function(cmd) { switch (cmd[0]) {
  // the "unnecessary" multiplication is there for forcing
  // the distance into a number.
    case "forward": return [0, cmd[1]];
    case "up":      return [-1*cmd[1], 0];
    case "down":    return [cmd[1], 0];
}}

const part1 = R.compose(
    R.reduce(R.multiply, 1),
    R.reduce(R.zipWith(R.add), [0, 0]),
    R.map(encode)
)(cmds);

console.log(part1);

const transduce = function(prev, cmd) {
  // prev contains an encoding of the current state
  // of the submarine. prev[0] is the aim, prev[1]
  // is the depth and prev[2] is the horizontal position.

  switch (cmd[0]) {
    case "forward": return [prev[0], prev[1] + cmd[1] * prev[0], prev[2] + cmd[1]];
    case "up":      return [prev[0] - cmd[1], prev[1], prev[2]];
    case "down":    return [prev[0] + cmd[1], prev[1], prev[2]];
  }
}

const subInfo = R.reduce(transduce, [0, 0, 0], cmds);

console.log(subInfo[1] * subInfo[2]);