import fs from 'fs';

const lines = fs.readFileSync("input").toString().split("\n");
const towels = new Set(lines[0].split(", "));
const designs = lines.slice(2);
const cache = new Map();

const splitAt = (index, xs) => [xs.slice(0, index), xs.slice(index)];

function search(design) {
  if (cache.has(design)) {
    return cache.get(design);
  }

  let ways = 0;
  for (let i = design.length; i > 0; i--) {
    const [a, b] = splitAt(i, design);
    if (towels.has(a)) {
      ways += b === "" ? 1 : search(b);
    }
  }
  cache.set(design, ways);
  return ways;
}

const designWays = designs.map(d => search(d)).filter(w => w);
const sumOfWays = designWays.reduce((sum, ways) => sum + ways, 0);

console.log(`Part 1: ${designWays.length}`);
console.log(`Part 2: ${sumOfWays}`)
