const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const parseLine = R.compose(
  ([k, v]) => [k, R.split(' ', v)],
  (m) => m.slice(1),
  R.match(/^(\w+): (.+)$/));

const paths = R.compose(
  R.fromPairs,
  R.map(parseLine),
  R.split('\n'))(input);

const countPaths = (f, t) => U.countAllPaths(f, t, R.propOr([], R.__, paths));

const allPaths = countPaths('you', 'out');
console.log(allPaths)


const svrToDac = countPaths('svr', 'dac'),
      svrToFFT = countPaths('svr', 'fft'),
      fftToDac = countPaths('fft', 'dac'),
      dacToFFT = countPaths('dac', 'fft'),
      dacToOut = countPaths('dac', 'out'),
      fftToOut = countPaths('fft', 'out');

const totalCount = (svrToDac * dacToFFT * fftToOut) +
                   (svrToFFT * fftToDac * dacToOut);

console.log(totalCount);
