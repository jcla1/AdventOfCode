const R = require('ramda');
const fs = require('fs');

const U = require('./util.js');

const input = fs.readFileSync('inputs/day20.input', 'utf8').trim();

const [subs, boardImg] = R.split('\n\n', input)
const board = R.o(R.map(R.split('')), R.split('\n'), boardImg);

const lightToNum = (l) => l === '#' ? 1 : 0;

const boardToNum = R.compose(
    (n) => parseInt(n, 2),
    R.join(''),
    R.map(lightToNum),
    R.unnest);

const advanceBoard = (img, padding = 2, item = '.') =>
    R.map(
        R.map(R.o((i) => subs[i], boardToNum)),
        U.aperture2D([3, 3], U.pad(img, padding, item)));
const numberOfLit = R.o(U.sumBoard, U.mapBoard(lightToNum));

console.log(numberOfLit(advanceBoard(advanceBoard(board, 2, '.'), 3, '#')));

console.log(numberOfLit(
    R.reduce((img, _) => advanceBoard(advanceBoard(img, 2, '.'), 3, '#'), board, R.range(0, 25))));
