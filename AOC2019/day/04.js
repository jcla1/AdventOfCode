const {not, all, indexOf, groupWith, map, equals, subtract, aperture, length, filter, compose, apply, range, split, allPass, intersection} = require('ramda');
const input = [240920, 789857];

const nonPositive = (x) => x <= 0;
const prepNum = compose(map(parseInt), split(''), String);
const allEqual = compose(all(apply(equals)), aperture(2));

const isIncreasing = compose(
    all(nonPositive),
    map(apply(subtract)),
    aperture(2),
);

const hasDoubleDigit = compose(
    not,
    equals(0),
    length,
    intersection(range(2, 7)),
    map(length),
    groupWith(equals),
);

const hasExactDoubleDigit = compose(
    not,
    equals(-1),
    indexOf(2),
    map(length),
    groupWith(equals),
);

a = compose(
    length,
    filter(allPass([isIncreasing, hasDoubleDigit])),
    map(prepNum),
    apply(range),
)(input);

b = compose(
    length,
    filter(allPass([isIncreasing, hasExactDoubleDigit])),
    map(prepNum),
    apply(range),
)(input);

module.exports = {a: a, b: b};
