const R = require('ramda');
const crypto = require('crypto');

const input = 'reyedfim';

const getMD5 = (str) => crypto.createHash('md5').update(str).digest('hex');

let password = '';
let i = 0;
while (password.length < 8) {
  const hash = getMD5(input + i);
  if (hash.startsWith('00000')) {
    password += hash[5];
  }
  i++;
}

console.log(password);

let strongPassword = '________';
i = 0;
while (strongPassword.includes('_')) {
  const hash = getMD5(input + i);
  if (hash.startsWith('00000')) {
    const pos = parseInt(hash[5]);
    if (pos < 8 && strongPassword[pos] === '_') {
      strongPassword = R.update(pos, hash[6], strongPassword);
    }
  }
  i++;
}

console.log(strongPassword.join(''));
