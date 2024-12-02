const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const rooms = R.compose(
  R.map(R.compose(
    (m) => ({name: m[1], sectorID: parseInt(m[2]), checksum: m[3]}),
    R.match(/^([a-z\-]+)-([0-9]+)\[([a-z]{5})\]$/))),
  R.split('\n'))(input);

const isRealRoom = (room) => {
  const name = room.name.replace(/-/g, '');
  const freqs = R.countBy(R.identity, R.split('', name));
  const mostFreqLetters = R.compose(
    R.map(R.nth(0)),
    R.take(5),
    R.sortWith([R.descend(R.nth(1)), R.ascend(R.nth(0))]),
    R.toPairs)(freqs);
  return room.checksum === mostFreqLetters.join('');
};

const realRooms = R.filter(isRealRoom, rooms);

const sumSectorIDs = R.compose(
  R.sum,
  R.map(R.prop('sectorID')))(realRooms);

console.log(sumSectorIDs);

const decrypt = (room) => {
  const shift = room.sectorID % 26;
  const decryptChar = (c) => {
    if (c === '-') return ' ';
    const code = c.charCodeAt(0) + shift;
    return String.fromCharCode(code > 122 ? code - 26 : code);
  };
  return {
    name: R.map(decryptChar, room.name).join(''),
    sectorID: room.sectorID
  };
};

const northPoleRoom = R.compose(
  R.prop('sectorID'),
  R.head,
  R.filter((r) => r.name.includes('northpole')),
  R.map(decrypt))(realRooms);

console.log(northPoleRoom);
