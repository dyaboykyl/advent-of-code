import fs from 'fs';

const map = fs.readFileSync("input").toString().split("\n").map(row => row.split(""));

const frequencyMap = new Map()
const part1Antinodes = new Set();
const part2Antinodes = new Set();

function findAntinodes(location, dx, dy) {
  let first = true;
  let incrementX = dx;
  let incrementY = dy;
  part2Antinodes.add(`${location.x},${location.y}`);

  do {
    let x = location.x - incrementX;
    let y = location.y - incrementY;
    const inbounds = x >= 0 && x < map[0].length && y >= 0 && y < map.length;
    if (!inbounds) {
      break;
    }

    const key = `${x},${y}`;
    if (first) {
      part1Antinodes.add(key);
      first = false;
    }
    part2Antinodes.add(key);
    if (map[y][x] === '.') {
      map[y][x] = "#";
    }

    incrementX += dx;
    incrementY += dy;
  } while (true);
}

for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[0].length; x++) {
    const frequency = map[y][x];
    if (frequency === "." || frequency === "#") {
      continue;
    }

    const location = { x, y }
    const otherFrequencies = frequencyMap.get(frequency) ?? [];
    otherFrequencies.forEach(otherLocation => {
      const dx = x - otherLocation.x;
      const dy = y - otherLocation.y;

      findAntinodes(otherLocation, dx, dy);
      findAntinodes(location, -dx, -dy);
    });

    otherFrequencies.push(location);
    frequencyMap.set(frequency, otherFrequencies);
  }
}

console.log(`Part 1 antinode count: ${part1Antinodes.size}`)
console.log(`Part 2 antinode count: ${part2Antinodes.size}`)
