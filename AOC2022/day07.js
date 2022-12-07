const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

const input = fs.readFileSync('inputs/day07.input', 'utf8').trim();

const processLines = (lines) => {
  let dirs = {'dirs': {}, 'files': {}}; let currentPath = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const [, prg, ...args] = R.split(' ', line);

    if (prg === 'cd') {
      const cdDir = args[0];
      if (cdDir == '/') {
        currentPath = [];
      } else if (cdDir == '..') {
        currentPath = R.dropLast(2, currentPath);
      } else {
        currentPath = R.concat(currentPath, ['dirs', cdDir]);
      }
    } else {
      while (++i < lines.length && R.head(lines[i]) !== '$') {
        const [size, name] = R.split(' ', lines[i]);
        if (size !== 'dir') {
          dirs = R.set(
              R.lensPath(R.concat(currentPath, ['files', name])),
              parseInt(size),
              dirs);
        }
      }
      i--;
    }
  }

  return dirs;
};

const getDirSizes = (dir) => {
  const sizeOfFiles = R.compose(R.sum, R.values, R.prop('files'))(dir);
  const subDirSizes = R.isEmpty(dir['dirs']) ?
    [] : R.compose(R.map(getDirSizes), R.values)(dir['dirs']);

  const sizeOfSubDirs = R.isEmpty(subDirSizes) ?
    0 : R.compose(R.sum, R.filter(R.is(Number)))(subDirSizes.flat());

  return R.append(sizeOfFiles + sizeOfSubDirs, subDirSizes);
};

const dirSizes = R.compose(
    R.flatten,
    getDirSizes,
    processLines,
    R.split('\n'))(input);

const totalSmallSizeDirs = R.compose(
    R.sum,
    R.filter(R.gte(100000)))(dirSizes);

console.log(totalSmallSizeDirs);

const currentFreeSpace = 70000000 - R.last(dirSizes);
const deletionSize = R.compose(
    U.minimum,
    R.filter((s) => s + currentFreeSpace >= 30000000))(dirSizes);

console.log(deletionSize);
