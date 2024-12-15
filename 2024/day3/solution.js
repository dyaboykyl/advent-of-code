import fs from 'fs';

const input = fs.readFileSync("input").toString()
const mulRegex = /mul\(([1-9][0-9]?[0-9]?),([1-9][0-9]?[0-9]?)\)/g;
const dontRegex = /don't\(\).+?do\(\)/g;

function multiply(match) {
  return parseInt(match[1]) * parseInt(match[2]);
}

function parseMuls(input) {
  var matches = [];
  let match;
  while (match = mulRegex.exec(input)) {
    matches.push(match);
  }

  return matches;
}

function findMulsSum(input) {
  const matches = parseMuls(input);
  return matches.reduce((sum, match) => sum + multiply(match), 0);
}


function part1() {
  const sum = findMulsSum(input);
  console.log("Sum: " + sum);
}

function part2() {
  const noDontsInput = input.replaceAll("\n", "").replaceAll(dontRegex, "do()");
  const sum = findMulsSum(noDontsInput);
  console.log("No Don'ts Sum: " + sum);
}

part1();
part2();