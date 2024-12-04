const R = require('ramda');
const U = require('./util.js');
const crypto = require('crypto');

const input = 'jlmsuwbz';

const getMD5 = (s) => crypto.createHash('md5').update(s).digest('hex');
