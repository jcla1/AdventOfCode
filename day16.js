const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

const input = fs.readFileSync('inputs/day16.input', 'utf8').trim();

const binaryIn = R.compose(
    R.join(''),
    R.chain((d) => {
      const s = parseInt(d, 16).toString(2);
      const padSize = 4 - R.length(s);
      return R.concat(R.join('', R.repeat('0', padSize)), s);
    }))(input);

const parsePacket = (desc) => {
  if (R.length(desc) === 0) return [{}, ''];

  let [v, rest] = R.splitAt(3, desc);
  let typeIDbin;
  [typeIDbin, rest] = R.splitAt(3, rest);

  const version = parseInt(v, 2);
  const typeID = parseInt(typeIDbin, 2);

  if (typeID === 4) { // literal value
    let v = '';
    let isEnd; let part;

    do {
      [isEnd, part, rest] = R.o(
          R.slice(1, 4),
          R.match(/^(\d)(\d{4})(\d*)$/))(rest);

      v += part;
    } while (isEnd !== '0');

    return [{
      version, typeID,
      type: 'literal',
      value: parseInt(v, 2),
    }, rest];
  } else { // operator
    [lengthTypeID, rest] = R.splitAt(1, rest);

    let packet;
    const subpackets = [];
    if (lengthTypeID === '0') {
      // next 15 bits are total length of contained packets
      let len; let subpacketBits;

      [len, rest] = R.splitAt(15, rest);
      [subpacketBits, rest] = R.splitAt(parseInt(len, 2), rest);

      while (subpacketBits !== '') {
        [packet, subpacketBits] = parsePacket(subpacketBits);
        subpackets.push(packet);
      }
    } else {
      // next 11 bits are number of immediate subpackets
      let noSubpackets;
      [noSubpackets, rest] = R.splitAt(11, rest);

      while (R.length(subpackets) !== parseInt(noSubpackets, 2)) {
        [packet, rest] = parsePacket(rest);
        subpackets.push(packet);
      }
    }

    return [{
      version, typeID,
      type: 'operator',
      subpackets,
    }, rest];
  }
};

const sumVersions = (packet) => {
  let subpacketVersionsSum = 0;
  if (packet['type'] === 'operator') {
    subpacketVersionsSum = R.o(R.sum, R.map(sumVersions))(packet['subpackets']);
  }

  return packet['version'] + subpacketVersionsSum;
};

const getPacketValue = (packet) => {
  if (packet['typeID'] === 4) return packet['value'];

  const subs = R.map(getPacketValue, packet['subpackets']);
  switch (packet['typeID']) {
    case 0: return R.sum(subs);
    case 1: return R.product(subs);
    case 2: return U.minimum(subs);
    case 3: return U.maximum(subs);

    case 5: return subs[0] > subs[1] ? 1 : 0;
    case 6: return subs[0] < subs[1] ? 1 : 0;
    case 7: return subs[0] === subs[1] ? 1 : 0;

    default: console.error('unknown packet typeID');
  }
};

const packet = parsePacket(binaryIn)[0];
console.log(sumVersions(packet));
console.log(getPacketValue(packet));
