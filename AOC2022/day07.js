const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

// We're not trimming today, so that we can also read in the last line.
const input = fs.readFileSync('inputs/day07.input', 'utf8');

const filesToDict = (output) => {
  const fileSizes = R.map(R.split(' '), output);
  return R.reduce((dir, file) => {
    if (file[0] != 'dir') {
      return R.assoc(file[1], parseInt(file[0]), dir)
    }
    return dir;
  }, {}, fileSizes);
};

const processCmd = ([path, dirs], cmd) => {
  const [command, ...output] = R.split('\n', cmd);

  const [prg, ...args] = R.split(' ', command);
  if (prg == 'cd') {
    const cdDir = args[0];
    if (cdDir == '/') {
      path = [];
    } else if (cdDir == '..') {
      path = R.dropLast(2, path);
    } else {
      path = R.concat(path, ['dirs', cdDir]);
      dirs = R.set(R.lensPath(R.append('name', path)), cdDir, dirs);
      dirs = R.set(R.lensPath(R.append('files', path)), {}, dirs);
      dirs = R.set(R.lensPath(R.append('dirs', path)), {}, dirs);
    }
  } else {
    dirs = R.set(
      R.lensPath(R.append('files', path)),
      filesToDict(R.dropLast(1, output)),
      dirs)
  }

  return [path, dirs];
};

const [_, dirStructure] = R.compose(
  R.reduce(processCmd, ['', {name: '/'}]),
  R.drop(1),
  R.split('$ '))(input);

const assocSizes = (dirs) => {
  const totalFileSizes = R.compose(
    R.sum,
    R.values)(dirs['files']);

  const annotatedSubDirs = R.compose(
    R.map(assocSizes),
    R.values)(dirs['dirs']);

  const subDirSize = R.compose(
    R.sum,
    R.map(R.prop('size')),
    R.values)(dirs['dirs']);

  dirs['size'] = totalFileSizes + subDirSize;

  return dirs;
};

const sizedDirs = assocSizes(dirStructure);

const totalSizeSmallDirs = R.compose(
  R.sum,
  R.filter(),
  R.flatten,
  R.map())(sizedDirs);
