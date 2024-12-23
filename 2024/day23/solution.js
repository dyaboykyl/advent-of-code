import fs from 'fs';

const connections = fs.readFileSync("input").toString().split("\n").map(v => v.split("-").toSorted());
const t3Parties = new Set();
let largestParty = [];

function addConnection(n1, n2) {
  let connected = nodeMap.get(n1) ?? [];
  connected.push(n2);
  nodeMap.set(n1, connected);
}

const nodeMap = new Map();
connections.forEach(connection => {
  const [n1, n2] = connection;
  addConnection(n1, n2);
  addConnection(n2, n1)
});

function examineParties(computer, maxSize) {
  const connected = nodeMap.get(computer);
  const queue = [{ party: [computer], i: -1 }];
  const allParties = new Set();

  while (queue.length > 0) {
    const { party, i } = queue.shift();
    for (let j = i + 1; j < connected.length; j++) {
      const connectedNodes = party.slice(1);
      const newNode = connected[j];
      if (connectedNodes.some(n => !nodeMap.get(n).includes(newNode))) {
        continue;
      }

      const newParty = [...party, newNode];

      if (!maxSize || newParty.length < maxSize) {
        queue.push({ party: newParty, i: j });
      } else if (newParty.length === maxSize) {
        allParties.add(newParty.toSorted().join(","));
      }

      if (newParty.length > largestParty.length) {
        largestParty = newParty;
      }
    }
  }

  return [...allParties.values()];
}

[...nodeMap.keys()].forEach(n => {
  if (n[0] == "t") {
    examineParties(n, 3).forEach(party => t3Parties.add(party));
  }
  examineParties(n);
});

console.log(`Part 1: ${t3Parties.size}`);
console.log(`Part 2: ${largestParty.toSorted().join(",")}`)

