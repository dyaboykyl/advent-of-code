import fs from 'fs';

const OPERATORS = {
  XOR: (a, b) => a ^ b,
  AND: (a, b) => a && b,
  OR: (a, b) => a || b,
}

function parseInput() {
  const inputs = fs.readFileSync("input").toString().split("\n\n");
  const wireLines = inputs[0].split("\n").map(line => line.split(": "));
  const wires = wireLines.map(w => ({ name: w[0], value: parseInt(w[1]) }));
  const getWire = (name) => {
    let wire = wires.find(w => w.name === name);
    if (!wire) {
      wire = { name }
      wires.push(wire);
    }
    return wire;
  }

  const gateLines = inputs[1].split("\n").map(line => line.split(" -> "));
  const gates = gateLines.map(gateLine => {
    const inputInfo = gateLine[0].split(" ");
    const inputs = [getWire(inputInfo[0]), getWire(inputInfo[2])];
    const output = getWire(gateLine[1]);
    const operator = inputInfo[1];
    return {
      inputs,
      output,
      operator,
      isReady: () => inputs.every(i => i.value !== undefined),
      evaluate: () => {
        const actual = OPERATORS[operator](inputs[0].value, inputs[1].value);
        if (output.value !== actual) {
          output.value = actual;
          return true;
        }
        return false;
      }
    }
  });

  const gatesByInput = {}
  const gatesByOutput = {}
  wires.forEach(wire => {
    gatesByInput[wire.name] = [];
  });
  gates.forEach(gate => {
    gate.inputs.forEach(wire => gatesByInput[wire.name].push(gate))
    gatesByOutput[gate.output.name] = gate;
  });

  return { wires, gates, gatesByInput, gatesByOutput }
}

function getBinaryNumber(prefix) {
  const selectedWires = wires.filter(wire => wire.name.startsWith(prefix));
  selectedWires.sort((a, b) => a.name.localeCompare(b.name));

  // const binary = [...selectedWires].reverse().map(wire => wire.value).join("");
  const decimal = selectedWires.reduce((number, wire, i) => number + wire.value * Math.pow(2, i), 0);
  const binary = decimal.toString(2);

  return { decimal, binary };
}

function getAllPairs(options) {
  const pairs = [];
  for (let i = 0; i < options.length - 1; i++) {
    for (let j = i + 1; j < options.length; j++) {
      pairs.push([options[i], options[j]]);
    }
  }
  return pairs;
}

function involvedGates(startWire) {
  const involved = [];
  const stack = [startWire];
  while (stack.length > 0) {
    const wire = stack.pop();
    const gate = gatesByOutput[wire];
    if (!gate) {
      continue;
    }
    if (gate.output.name !== startWire) {
      involved.push(gate);
    }
    gate.inputs.forEach(wire => stack.push(wire.name));
  }
  return [...new Set(involved).values()];
}

function getPossibleSwaps(options) {
  const pairs = getAllPairs(options);
  console.log(pairs);
}

const { wires, gates, gatesByInput, gatesByOutput } = parseInput();

const queue = [...gates];
while (queue.length > 0) {
  const gate = queue.shift();
  if (!gate.isReady()) {
    queue.push(gate);
  }

  if (gate.evaluate()) {
    gatesByInput[gate.output.name].forEach(gate => queue.push(gate));
  }
}

// const zBinary = [...zWires].reverse().map(wire => wire.value).join("");
// const zNumber = zWires.reduce((number, wire, i) => number + wire.value * Math.pow(2, i), 0);
// console.log(zBinary)
// console.log(zNumber)

const x = getBinaryNumber("x");
const y = getBinaryNumber("y");
const z = getBinaryNumber("z");
const xy = { decimal: x.decimal + y.decimal, binary: (x.decimal + y.decimal).toString(2) };
console.log(`x: `, x);
console.log(`y: `, y);
console.log(`x + y: `, xy);
console.log(`z (Part 1): `, z);

const seen = {};
function analyzeZ(digit) {
  const name = `z${(digit + "").padStart(2, "0")}`;
  const zGate = gatesByOutput[name];
  const queue = [{ gate: zGate, level: 0 }];
  const analysis = {};
  while (queue.length > 0) {
    const data = queue.pop();
    const key = `${data.level}-${data.gate.operator}`;
    const inputGates = data.gate.inputs.map(wire => gatesByOutput[wire.name]).filter(g => g).toSorted((a, b) => a.operator.localeCompare(b.operator));
    analysis[key] = (analysis[key] ?? []).concat(inputGates.map(g => g.operator)).toSorted();
    inputGates.forEach(g => {
      if (!seen[g.output.name]) queue.push({ level: data.level + 1, gate: g });
    });
    seen[data.gate.output.name] = true;
  }
  console.log(`${name}: `, JSON.stringify(analysis));
}

// const allGatePairs = getAllPairs(gates);
// const all4GatePairSwitches = getAllPairs(allGatePairs);

const zWires = wires.filter(wire => wire.name.startsWith("z"));
for (let i = 0; i < zWires.length; i++) {
  analyzeZ(i)
}


// zWires.forEach(wire => {
//   const involved = [];
//   const stack = [wire.name];
//   while (stack.length > 0) {
//     const wire = stack.pop();
//     const inputs = gatesByOutput[wire]?.inputs.map(wire => wire.name);
//     inputs?.forEach(w => {
//       involved.push(w);
//       stack.push(w);
//     })
//   }
//   console.log(`${wire.name}: ${involved.join(",")}\n`)
// });

