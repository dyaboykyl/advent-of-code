import fs from 'fs';

const stones = fs.readFileSync("day11/input").toString().split(" ").map(s => parseInt(s))
const cache = new Map();

function getCount(stone, blink, totalBlinks) {
  if (blink === totalBlinks) {
    return 1;
  }

  const key = `${stone}-${blink}`;
  let count = cache.get(key);
  if (count) {
    return count;
  }

  let firstStone;
  let secondStone = null;
  if (stone === 0) {
    firstStone = 1;
  } else {
    const stoneStr = `${stone}`;
    const digitCount = stoneStr.length;
    if (digitCount % 2 === 0) {
      firstStone = parseInt(stoneStr.slice(0, digitCount / 2));
      secondStone = parseInt(stoneStr.slice(digitCount / 2));
    } else {
      firstStone = stone * 2024
    }
  }

  count = getCount(firstStone, blink + 1, totalBlinks);
  if (secondStone != null) {
    count += getCount(secondStone, blink + 1, totalBlinks);
  }
  cache.set(key, count);
  return count;
}

function getTotalCount(blinks) {
  cache.clear();
  return stones.reduce((count, stone) => count + getCount(stone, 0, blinks), 0);
}

console.log(`Part 1 stone count: ${getTotalCount(25)}`);
console.log(`Part 2 stone count: ${getTotalCount(75)}`);