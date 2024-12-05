const R = require('ramda');
const crypto = require('crypto');

const input = 'jlmsuwbz';

const getMD5 = (s, streched = false) => {
  if (!streched) return crypto.createHash('md5').update(s).digest('hex');
  let hash = s;
  for (let i = 0; i <= 2016; i++) {
    hash = crypto.createHash('md5').update(hash).digest('hex');
  }
  return hash;
};

const matchThree = (s) => {
  const m = s.match(/(.)\1\1/);
  return m ? m[1] : null;
};

const matchFive = (s, c) => R.includes(R.repeat(c, 5).join(''), s);

const lastKeyIndex = (salt, streched = false) => {
  let i = 0;
  let foundKeys = 0;
  const hashCache = [];

  const getHash = (i) => {
    if (!hashCache[i]) return getMD5(salt + i, streched);
    return hashCache[i];
  };

  outer: while (foundKeys < 64) {
    console.log('checking index', i);
    const hash = getHash(i);
    const m = matchThree(hash);
    if (m) {
      for (let j = 1; j <= 1000; j++) {
        const hash2 = getHash(i + j);
        if (matchFive(hash2, m)) {
          console.log(i, i+j, m, hash, hash2);
          foundKeys++;
          i++;
          continue outer;
        }
      }
    }
    i++;
  }
  return i - 1;
};

// console.log(lastKeyIndex(input));
console.log(lastKeyIndex(input, true));
