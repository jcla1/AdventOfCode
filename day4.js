const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('day4.input', 'utf8').trim();

const parsePassport = R.compose(
    R.fromPairs,
    R.map(R.split(':')),
    R.split(/\s/));

const passports = R.compose(
    R.map(parsePassport),
    R.split('\n\n'))(input);

const isValid = R.allPass(
    R.map(R.has, ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']));

const noValidPP = (validator) => R.compose(
    R.length,
    R.filter(validator));

console.log(noValidPP(isValid)(passports));

const isValidStrict = R.allPass([
  isValid, // has all required fields
  (pp) => {
    const byr = parseInt(pp['byr']);
    return R.test(/^\d{4}$/, pp['byr']) && 1920 <= byr && byr <= 2002;
  },
  (pp) => {
    const iyr = parseInt(pp['iyr']);
    return R.test(/^\d{4}$/, pp['iyr']) && 2010 <= iyr && iyr <= 2020;
  },
  (pp) => {
    const eyr = parseInt(pp['eyr']);
    return R.test(/^\d{4}$/, pp['eyr']) && 2020 <= eyr && eyr <= 2030;
  },
  (pp) => {
    const [num, units] = R.slice(1, 3, R.match(/(\d+)(in|cm)/, pp['hgt']));
    const height = parseInt(num);
    const lower = {'in': 59, 'cm': 150}; const upper = {'in': 76, 'cm': 193};
    return lower[units] <= height && height <= upper[units];
  },
  R.o(
      R.test(/^#[0-9a-f]{6}$/),
      R.prop('hcl')),
  R.o(
      R.flip(R.includes)(['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']),
      R.prop('ecl')),
  R.o(
      R.test(/^\d{9}$/),
      R.prop('pid')),
]);

console.log(noValidPP(isValidStrict)(passports));
