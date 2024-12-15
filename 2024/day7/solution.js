import fs from 'fs';

const equations = fs.readFileSync("input").toString().split("\n")
  .map(line => {
    const split = line.split(": ");
    const value = parseInt(split[0]);
    const inputs = split[1].split(" ").map(n => parseInt(n));
    return { value, inputs };
  })

const PLUS = (a, b) => a + b;
const MULTIPLY = (a, b) => a * b;
const OR = (a, b) => parseInt(`${a}${b}`);

const part1Operators = [PLUS, MULTIPLY];
const part2Operators = [PLUS, MULTIPLY, OR];

function testEquation(equation, operators) {
  return [PLUS, MULTIPLY].some(o => bfsEQuation(equation, 0, 0, operators, o));
}

function bfsEQuation(equation, prevValue, i, operators, operator) {
  if (i >= equation.inputs.length) {
    return prevValue === equation.value;
  }

  const nextValue = operator(prevValue, equation.inputs[i]);
  if (nextValue > equation.value) {
    return false;
  }

  return operators.some(o => bfsEQuation(equation, nextValue, i + 1, operators, o));
}

function sumOfCorrect(operators) {
  return equations.filter(e => testEquation(e, operators)).reduce((sum, e) => sum + e.value, 0);
}

function part1() {
  const sum = sumOfCorrect(part1Operators);
  console.log(`Part 1 sum: ${sum}`);
}

function part2() {
  const sum = sumOfCorrect(part2Operators);
  console.log(`Part 2 sum: ${sum}`);
}

part1();
part2();
