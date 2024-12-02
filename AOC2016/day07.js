const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const hasABBA = R.test(/(\w)((?!\1)\w)\2\1/);
const isTLSCapable = R.allPass([
  R.compose(R.any(hasABBA), R.split(/\[.*?\]/g)),
  R.compose(R.none(hasABBA), R.match(/\[(.*?)\]/g))]);

const tlsIPCount = R.compose(
    R.length,
    R.filter(isTLSCapable),
    R.split('\n'))(input);
console.log(tlsIPCount);

const isSSLCapable = (ip) => {
  const ABAs = R.compose(
      R.map(R.nth(1)),
      R.unnest,
      R.map((s) => [...s.matchAll(/(?=((\w)((?!\2)\w)\2))/g)]),
      R.split(/\[.*?\]/g))(ip);

  const BABs = R.map((s) => s[1] + s[0] + s[1], ABAs);
  const hasBAB = R.anyPass(R.map((bab) => (s) => s.includes(bab), BABs));

  return R.compose(
      hasBAB,
      R.join(''),
      R.match(/\[.*?\]/g))(ip);
};

const sslIPCount = R.compose(
    R.length,
    R.filter(isSSLCapable),
    R.split('\n'))(input);
console.log(sslIPCount);
