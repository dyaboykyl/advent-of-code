import fs from 'fs';

const input = fs.readFileSync("input").toString()
  .split(',')
  .map(range => range.split("-")
    .map(s => parseInt(s)));



let invalidSum = 0;
input.forEach(range => {
  for (let id = range[0]; id <= range[1]; id++) {
    const idStr = id + "";
    if (idStr.length % 2 != 0) {
      continue;
    }

    if (idStr.slice(0, idStr.length / 2) == idStr.slice(idStr.length / 2)) {
      invalidSum += id;
    }
  }
})


console.log(`## Part 1 ##`);
console.log(invalidSum);

invalidSum = 0;
input.forEach(range => {
  const invalids = {};
  for (let id = range[0]; id <= range[1]; id++) {
    const idStr = id + "";
    for (let i = 1; i <= idStr.length / 2; i++) {
      if (idStr.length % i != 0) {
        continue;
      }

      const numStr = idStr.slice(0, i);
      let invalid = true;
      for (let j = i; j < idStr.length; j += i) {
        if (idStr.slice(j, j + i) != numStr) {
          invalid = false;
          break;
        }
      }

      if (invalid && !invalids[id]) {
        invalidSum += id;
        invalids[id] = true;
      }
    }
  }
})


console.log(`## Part 2 ##`);
console.log(invalidSum);
