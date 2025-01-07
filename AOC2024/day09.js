const R = require('ramda');
const U = require('./util.js');

const input = U.getInput(__filename);

const tn = (n) => n * (n + 1) / 2;

const splitDiscMap = R.compose(
    R.transpose,
    R.splitEvery(2),
    U.toIntArr,
    R.split(''));

const getDiscChecksum = (discMap) => {
  const [files, spaces] = splitDiscMap(discMap);

  let checksum = 0;
  let curIndex = 0;
  outer: for (let fileNo = 0; fileNo < files.length; fileNo++) {
    const fileLen = files[fileNo];

    checksum += fileNo * (tn(curIndex + fileLen - 1) - tn(curIndex - 1));
    curIndex += fileLen;

    while (spaces[fileNo] > 0) {
      const fillerFileID = R.findLastIndex(R.lt(0), files);
      if (fillerFileID === -1 || fillerFileID <= fileNo) break outer;

      checksum += fillerFileID * curIndex;

      curIndex++;
      files[fillerFileID]--;
      spaces[fileNo]--;
    }
  }

  return checksum;
};
console.log(getDiscChecksum(input));

const getChunkedChecksum = (discMap) => {
  const [files, spaces] = splitDiscMap(discMap);
  const origFileLen = R.clone(files);

  let checksum = 0;
  let curIndex = 0;
  outer: for (let fileNo = 0; fileNo < files.length; fileNo++) {
    const fileLen = files[fileNo];

    checksum += fileNo * (tn(curIndex + fileLen - 1) - tn(curIndex - 1));
    curIndex += Math.max(fileLen, origFileLen[fileNo]);

    const nextMovableFileIndex = () => fileNo + R.findLastIndex(
        R.allPass([R.lt(0), R.gte(spaces[fileNo])]), files.slice(fileNo));

    while (spaces[fileNo] > 0 && nextMovableFileIndex() > fileNo) {
      const fillerFileID = nextMovableFileIndex();
      const fillerLen = files[fillerFileID];

      checksum += fillerFileID *
        (tn(curIndex + fillerLen - 1) - tn(curIndex - 1));

      curIndex += fillerLen;
      files[fillerFileID] = 0;
      spaces[fileNo] -= fillerLen;
    }
    curIndex += spaces[fileNo];
  }

  return checksum;
};
console.log(getChunkedChecksum(input));
