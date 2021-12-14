const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('inputs/day07.input', 'utf8').trim();

const parseRule = R.compose(
  m => {
    if (m['inside'] === 'no other bags') return [m['color'], []];

    return [m['color'], R.compose(
      R.map(c => [parseInt(c[0]), c[1]]),
      R.map(R.o(R.slice(1, 3), R.match(/(\d+) (.+) bags?/))),
      R.split(',')
      )(m['inside'])];
  },
  R.prop('groups'),
  R.match(/^(?<color>.*) bags contain (?<inside>no other bags|.+)\.$/));

const rules =  R.o(R.map(parseRule), R.split('\n'))(input);


const containmentRules = R.compose(
  R.map(R.map(R.nth(1))),
  R.groupBy(R.nth(0)),
  R.chain(([outer, inners]) => R.map(p => [p[1], outer], inners)))(rules);

const findOuterBagColors = R.curry((rules, color) => {
  // we're depending on the fact that there can be no loops of colors.
  const outerColors = rules[color];
  if (outerColors == undefined) return [];

  return R.reduce(R.union, outerColors, R.map(findOuterBagColors(rules), outerColors));
});

console.log(R.length(findOuterBagColors(containmentRules, 'shiny gold')));

const countRules = R.fromPairs(rules);

const findNoBags = (rules, color) => R.reduce(
  (total, [count, innerColor]) => total + count * findNoBags(rules, innerColor),
  1, rules[color]);

console.log(findNoBags(countRules, 'shiny gold') - 1);
