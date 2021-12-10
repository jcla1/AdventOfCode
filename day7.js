const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('day7.input', 'utf8').trim();

const rules = R.split('\n', input);

