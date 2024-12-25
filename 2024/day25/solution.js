import fs from 'fs';

function parseSchematic(schematic) {
  if (schematic[0][0] === '.') {
    schematic.reverse();
  }
  const pins = [];
  for (let column = 0; column < schematic[0].length; column++) {
    let height = 0;
    while (schematic[height + 1][column] == '#' && height < schematic.length - 1) {
      height++;
    }
    pins.push(height);
  }
  return pins;
}

const schematics = fs.readFileSync("input").toString().split("\n\n").map(part => part.split("\n"));
const keys = [];
const locks = [];
schematics.forEach(schematic => {
  const arr = schematic[0][0] === '#' ? locks : keys;
  arr.push(parseSchematic(schematic));
});


const combinations = [];
keys.forEach(key => {
  for (const lock of locks) {
    if (lock.every((pin, i) => key[i] + pin < 6)) {
      combinations.push({ key, lock });
    }
  }
})

console.log(`Part 1: ${combinations.length}`)

