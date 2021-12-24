const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('inputs/day22.input', 'utf8').trim();

const parseCube = R.compose(
    R.map(R.ifElse(R.test(/-?\d+/), (n) => parseInt(n), R.identity)),
    R.prop('groups'),
    R.match(/^(?<cmd>\w+) x=(?<xlow>-?\d+)\.\.(?<xhigh>-?\d+),y=(?<ylow>-?\d+)\.\.(?<yhigh>-?\d+),z=(?<zlow>-?\d+)\.\.(?<zhigh>-?\d+)$/));

const cubes = R.compose(
    R.map(parseCube),
    R.split('\n'))(input);

const inCube = R.curry((cube, other) => {
  return cube['xlow'] <= other['xlow'] && other['xhigh'] <= cube['xhigh'] &&
         cube['ylow'] <= other['ylow'] && other['yhigh'] <= cube['yhigh'] &&
         cube['zlow'] <= other['zlow'] && other['zhigh'] <= cube['zhigh'];
});

const intersectingCube = R.curry((cube, other) => {
  return {
    xlow: R.max(cube['xlow'], other['xlow']),
    xhigh: R.min(cube['xhigh'], other['xhigh']),
    ylow: R.max(cube['ylow'], other['ylow']),
    yhigh: R.min(cube['yhigh'], other['yhigh']),
    zlow: R.max(cube['zlow'], other['zlow']),
    zhigh: R.min(cube['zhigh'], other['zhigh']),
  };
});

const volume = (c) => {
  return R.max(0, 1 + c['xhigh'] - c['xlow']) *
         R.max(0, 1 + c['yhigh'] - c['ylow']) *
         R.max(0, 1 + c['zhigh'] - c['zlow']);
};

const initProcedureCubes = R.filter(inCube({
  xlow: -50, xhigh: 50,
  ylow: -50, yhigh: 50,
  zlow: -50, zhigh: 50,
}), cubes);

const isEmpty = (c) =>
  c['xlow'] > c['xhigh'] || c['ylow'] > c['yhigh'] || c['zlow'] > c['zhigh'];

const countOnLights = (cubes) => {
  let sum = 0;

  for (let i = cubes.length - 1; i >= 0; i--) {
    if (cubes[i]['cmd'] === 'on') {
      const dead = R.compose(
          R.filter((c) => !isEmpty(c)),
          R.map(R.assoc('cmd', 'on')),
          R.map(intersectingCube(cubes[i])),
      )(R.drop(i+1, cubes));

      sum += volume(cubes[i]);
      sum -= countOnLights(dead);
    }
  }
  return sum;
};

console.log(countOnLights(initProcedureCubes));
console.log(countOnLights(cubes));
