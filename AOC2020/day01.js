const R = require('ramda');
const fs = require('fs');

const input = fs.readFileSync('inputs/day01.input', 'utf8').trim();

const nums = R.compose(R.map(parseInt), R.split('\n'))(input);

for (let i = 0; i < R.length(nums); i++) {
  for (let j = i+1; j < R.length(nums); j++) {
    if (nums[i] + nums[j] === 2020) {
      console.log(nums[i] * nums[j]);
      i = R.length(nums); break;
    }
  }
}

for (let i = 0; i < R.length(nums); i++) {
  for (let j = i+1; j < R.length(nums); j++) {
    for (let k = j+1; k < R.length(nums); k++) {
      if (nums[i] + nums[j] + nums[k] === 2020) {
        console.log(nums[i] * nums[j] * nums[k]);
        i = R.length(nums); j = R.length(nums); break;
      }
    }
  }
}

