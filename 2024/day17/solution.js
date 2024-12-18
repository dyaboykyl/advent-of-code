import fs from 'fs';

const lines = fs.readFileSync("input").toString().split("\n");
const registers = lines.slice(0, 3).map(line => parseInt(line.split(": ")[1]));
const program = lines[4].split(": ")[1].split(",").map(o => parseInt(o));
const outputAndJump = 10;
let output = [];
let ins = 0;

function XOR(v1, v2) {
  var hi = 0x80000000;
  var low = 0x7fffffff;
  var hi1 = ~~(v1 / hi);
  var hi2 = ~~(v2 / hi);
  var low1 = v1 & low;
  var low2 = v2 & low;
  var h = hi1 ^ hi2;
  var l = low1 ^ low2;
  const result = h * hi + l;
  return result;
}

function combo(operand) {
  return operand < 4 ? operand : registers[(operand - 1) % 3];
}

function out(operand) {
  const val = combo(operand) % 8;
  output.push(val);
  return val;
}

function dv(operand, register) {
  const denom = Math.pow(2, combo(operand));
  registers[register] = Math.floor(registers[0] / denom);
}

function adv(operand) {
  dv(operand, 0);
}

function bxl(operand) {
  registers[1] = XOR(registers[1], operand);
}

function bst(operand) {
  registers[1] = combo(operand) % 8;
}

function jnz(operand) {
  if (!registers[0]) {
    return;
  }

  ins = operand - 2;
}

function bxc() {
  registers[1] = XOR(registers[1], registers[2]);
}

function bdv(operand) {
  dv(operand, 1);
}

function cdv(operand) {
  dv(operand, 2);
}

const opcodes = {
  0: adv,
  1: bxl,
  2: bst,
  3: jnz,
  4: bxc,
  5: out,
  6: bdv,
  7: cdv,
}

function tick() {
  const opcode = program[ins];
  const operand = program[ins + 1]
  const result = opcodes[opcode](operand);
  ins += 2;
  return result;
}

function runProgram() {
  output = [];
  ins = 0;
  for (; ins < program.length;) {
    tick();
  }
}

function runIteration(a) {
  registers[0] = a;
  ins = 0;
  for (; ins < outputAndJump;) {
    tick();
  }
  return tick();
}

const reverseProgram = program.map(i => i).reverse();
function checkA(index, startA) {
  for (let a = (8 * startA); a < (8 * startA + 8); a++) {
    const nextOutput = runIteration(a);
    if (reverseProgram[index] === nextOutput) {
      if (index === program.length - 1) {
        return a;
      } else {
        const finalA = checkA(index + 1, a);
        if (finalA) {
          return finalA;
        }
      }
    }
  }
}

runProgram();

console.log(`Part 1 output: ${output.join(",")}`);
console.log(`Part 2 A value: ${checkA(0, 0)}`)
