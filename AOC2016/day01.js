const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('inputs/day01.input', 'utf8').trim();

const distance = ([x, y]) => Math.abs(x) + Math.abs(y);

const turn = (facing, dir) => ({
  'N': {'L': 'W', 'R': 'E'},
  'E': {'L': 'N', 'R': 'S'},
  'S': {'L': 'E', 'R': 'W'},
  'W': {'L': 'S', 'R': 'N'}
}[facing][dir]);

const advanceState = ({dir: facing, x: x, y: y, visited: visited}, [dir, dist]) => {
  const newDir = turn(facing, dir);
  const newVisited = [...visited, ...R.range(1, dist + 1).map((n) => {
    switch (newDir) {
      case 'N': return [x, y + n];
      case 'E': return [x + n, y];
      case 'S': return [x, y - n];
      case 'W': return [x - n, y];
    }
  })];
  const [newX, newY] = newVisited[newVisited.length - 1];

  return {dir: newDir, x: newX, y: newY, visited: newVisited};
};

const endWalkState = R.compose(
  R.reduce(advanceState, {x: 0, y: 0, dir: 'N', visited: []}),
  R.map((d) => [d[0], parseInt(d.slice(1))]),
  R.split(', '))(input);

console.log(distance([endWalkState.x, endWalkState.y]));

const firstDuplicate = R.compose(
  JSON.parse,
  R.nth(0),
  R.head,
  R.filter((n) => n[1] > 1),
  R.toPairs,
  R.countBy(R.toString));

console.log(distance(firstDuplicate(endWalkState.visited)));
