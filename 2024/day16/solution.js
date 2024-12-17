import fs from 'fs';

const MOVEMENT_MAP = {
  '>': { y: 0, x: 1 },
  '^': { y: -1, x: 0 },
  '<': { y: 0, x: -1 },
  'v': { y: 1, x: 0 },
}
const MOVES = Object.keys(MOVEMENT_MAP);

const maze = fs.readFileSync("input").toString().split("\n").map(row => row.split(""));
const visited = maze.map(row => []);
const seats = maze.map(row => row.map(v => v));
let endPosition;
let shortestPathCost;

function findStart() {
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === "S") {
        return { position: { x, y }, direction: ">", cost: 0 }
      }
    }
  }
}

function invalidMove(move) {
  return (move.y < 0 || move.x < 0
    || move.y > maze.length - 1 || move.x > maze[0].length - 1
    || maze[move.y][move.x] === "#"
  );
}

function getPossibleMoves(turn) {
  const moveIndex = MOVES.indexOf(turn.direction);
  return [moveIndex - 1, moveIndex, (moveIndex + 1) % 4]
    .map(i => i < 0 ? 4 + i : i)
    .map(moveIndex => {
      const direction = MOVES[moveIndex];
      const change = MOVEMENT_MAP[direction];
      return {
        position: {
          x: turn.position.x + change.x,
          y: turn.position.y + change.y,
        },
        direction,
        cost: turn.cost + (direction === turn.direction ? 1 : 1001)
      };
    })
    .filter(move => !invalidMove(move.position));
}

const start = findStart();
const queue = [start];
while (queue.length > 0) {
  const turn = queue.shift();
  const { position } = turn;
  const parentKey = JSON.stringify({ position, direction: turn.direction });
  const moves = getPossibleMoves(turn);
  moves.forEach(move => {
    const movePosition = move.position;
    const moveKey = JSON.stringify({ position: move.position, direction: move.direction });
    if (move.cost > shortestPathCost) {
      return;
    }

    const entry = visited[movePosition.y][movePosition.x] ?? {};
    if (entry[moveKey]?.cost < move.cost) {
      return;
    }

    entry[moveKey] = entry[moveKey]?.cost === move.cost ? entry[moveKey] : { cost: move.cost, parents: new Set() };
    entry[moveKey].parents.add(parentKey);
    visited[movePosition.y][movePosition.x] = entry;

    if (maze[movePosition.y][movePosition.x] === "E") {
      shortestPathCost = Math.min(shortestPathCost ?? Number.MAX_SAFE_INTEGER, move.cost);
      endPosition ??= movePosition;
      return;
    }

    queue.push(move);
  });
}

const seatStack = Object.values(visited[endPosition.y][endPosition.x])
  .filter(node => node.cost === shortestPathCost);
seats[endPosition.y][endPosition.x] = "O";
seats[start.position.y][start.position.x] = "O";
while (seatStack.length > 0) {
  const { parents } = seatStack.pop();
  if (!parents) {
    continue;
  }

  [...parents.values()].forEach(parentKey => {
    const { position } = JSON.parse(parentKey);
    seats[position.y][position.x] = "O";
    const node = visited[position.y][position.x];
    if (node && node[[parentKey]]) {
      seatStack.push(node[parentKey]);
    }
  });
}

const seatSum = seats.reduce((sum, row) => sum + row.filter(o => o === "O").length, 0);
console.log(`Shortest path cost: ${shortestPathCost}`);
console.log(`Seat count: ${seatSum}`);