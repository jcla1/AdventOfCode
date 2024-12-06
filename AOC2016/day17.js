const R = require('ramda');
const U = require('./util.js');
const crypto = require('crypto');

const input = 'pslxynzg';

const getHash = (s) => crypto.createHash('md5').update(s).digest('hex');

const isOnBoard = ([x, y]) => x >= 1 && x <= 4 && y >= 1 && y <= 4;
const isOpenDoor = (c) => c >= 'b' && c <= 'f';

const getPosition = (path) => {
  let [x, y] = [1, 1];
  for (let i = 0; i < path.length; i++) {
    switch (path[i]) {
      case 'U': y--; break;
      case 'D': y++; break;
      case 'L': x--; break;
      case 'R': x++; break;
    }
  }
  return [x, y];
}

const getPossibleMoves = (path) => {
  const posHash = getHash(input + path);
  const [x, y] = getPosition(path);

  let moves = [];
  if (isOpenDoor(posHash[0]) && isOnBoard([x, y - 1])) moves.push('U');
  if (isOpenDoor(posHash[1]) && isOnBoard([x, y + 1])) moves.push('D');
  if (isOpenDoor(posHash[2]) && isOnBoard([x - 1, y])) moves.push('L');
  if (isOpenDoor(posHash[3]) && isOnBoard([x + 1, y])) moves.push('R');
  return R.map((m) => path + m, moves);
}

const shortestPath = U.astar(
  '',
  (path) => { const p = getPosition(path); return p[0] === 4 && p[1] === 4; },
  getPossibleMoves);

console.log(R.last(shortestPath));
