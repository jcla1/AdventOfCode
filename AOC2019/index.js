const day = (new Date()).getDate();
const file = (day) => `./day/${String(day).padStart(2, '0')}`;
console.log(require(file(day)));
