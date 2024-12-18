import fs from 'fs';

const SIZE = 71;
const bytes = fs.readFileSync("input").toString().split("\n")
  .map(line => line.split(",").map(n => parseInt(n)));
const space = Array.from({ length: SIZE }, (_, i) =>
  Array.from({ length: SIZE }, (_, j) => ".")
);
let visited = space.map(row => []);

const MOVEMENTS = [
  { y: 0, x: 1 },
  { y: -1, x: 0 },
  { y: 0, x: -1 },
  { y: 1, x: 0 },
];

function getMoves(move) {
  const position = move.position;
  return MOVEMENTS.map(m => ({ x: position.x + m.x, y: position.y + m.y }))
    .filter(p => p.y >= 0 && p.y < SIZE && p.x >= 0 && p.x < SIZE && space[p.y][p.x] !== "#")
    .map(position => ({ position, cost: move.cost + 1 }));
}

let finalCost = Infinity;
function bfs() {
  const queue = [{ position: { x: 0, y: 0 }, cost: 0 }];
  while (queue.length > 0) {
    const move = queue.shift();
    getMoves(move).forEach(nextMove => {
      const nextPosition = nextMove.position;
      if (visited[nextPosition.y][nextPosition.x] <= nextMove.cost || finalCost <= nextMove.cost) {
        return;
      }

      visited[nextPosition.y][nextPosition.x] = nextMove.cost;
      if (nextPosition.y === SIZE - 1 && nextPosition.x === SIZE - 1) {
        finalCost = Math.min(finalCost, nextMove.cost);
        return;
      }

      queue.push(nextMove);
    })
  }
}

function addByte(byte) {
  space[byte[1]][byte[0]] = "#";
}

let byteIndex = 1024;
bytes.slice(0, byteIndex).forEach(byte => addByte(byte))
bfs();
let minSteps = visited[SIZE - 1][SIZE - 1];
console.log(`Part 1: ${minSteps}`);

while (minSteps && byteIndex < bytes.length) {
  visited = visited.map(row => []);
  finalCost = Infinity;
  addByte(bytes[byteIndex++]);
  bfs();
  minSteps = visited[SIZE - 1][SIZE - 1];
}

console.log(`Part 2: byte #${byteIndex - 1} ${bytes[byteIndex - 1]}`)
