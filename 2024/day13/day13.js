import fs from 'fs';

const configurations = fs.readFileSync("input").toString().split("\n\n").map(configuration => {
  const lines = configuration.split("\n");
  const buttonA = parseLine(lines[0], '+');
  const buttonB = parseLine(lines[1], '+');
  const prize = parseLine(lines[2], '=');

  return { buttonA, buttonB, prize };
});

function parseLine(line, delimeter) {
  let re = new RegExp("X\\" + delimeter + `(\\d+), Y\\` + delimeter + `(\\d+)`);
  const result = line.match(re);
  return { x: parseInt(result[1]), y: parseInt(result[2]) }
}

function closeEnough(value) {
  return Math.abs(Math.round(value) - value) < .001;
}

function solve(configuration) {
  const { buttonA, buttonB, prize } = configuration;
  const b = (prize.y - (buttonA.y * prize.x) / buttonA.x) / (buttonB.y - (buttonA.y * buttonB.x / buttonA.x));
  const a = (prize.x - buttonB.x * b) / buttonA.x;

  if (closeEnough(a) && closeEnough(b)) {
    return a * 3 + b;
  }

  return 0;
}

function solveAll(configurations) {
  return configurations.reduce((prev, config) => prev + solve(config), 0);
}

const part2Configurations = configurations.map(c =>
  Object.assign({}, c, { prize: { x: c.prize.x + 10000000000000, y: c.prize.y + 10000000000000 } }));

const part1Sum = solveAll(configurations);
const part2Sum = solveAll(part2Configurations);

console.log(`Part 1: ${part1Sum}`);
console.log(`Part 2: ${part2Sum}`);
