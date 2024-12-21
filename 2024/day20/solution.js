import fs from 'fs';

const racetrack = fs.readFileSync("input").toString().split("\n").map(row => row.split(""));

const MOVEMENTS = [
  { y: 0, x: 1 },
  { y: -1, x: 0 },
  { y: 0, x: -1 },
  { y: 1, x: 0 },
];

function findSymbol(symbol) {
  for (let y = 0; y < racetrack.length; y++) {
    for (let x = 0; x < racetrack[y].length; x++) {
      if (racetrack[y][x] === symbol) {
        return { x, y }
      }
    }
  }
}

function getMoves(move) {
  const position = move.position;
  let movements = MOVEMENTS.map(m => ({ x: position.x + m.x, y: position.y + m.y }))
    .filter(p => p.y >= 0 && p.y < racetrack.length
      && p.x >= 0 && p.x < racetrack[0].length
      && racetrack[p.y][p.x] !== "#");

  return movements.map(p => {
    return {
      position: p,
      cost: move.cost + 1,
      prev: move
    }
  });
}

function bfs() {
  const start = findSymbol("S");
  const end = findSymbol("E");

  const visited = racetrack.map(row => []);
  visited[start.y][start.x] = 0;

  let finalMove;
  let finalCost = Infinity;

  const queue = [{ position: start, cost: 0 }];
  while (queue.length > 0) {
    const move = queue.shift();
    const moves = getMoves(move, false);
    moves.forEach(nextMove => {
      const nextPosition = nextMove.position;
      if (visited[nextPosition.y][nextPosition.x] <= nextMove.cost || finalCost <= nextMove.cost) {
        return;
      }

      visited[nextPosition.y][nextPosition.x] = nextMove.cost;
      if (nextPosition.y === end.y && nextPosition.x === end.x) {
        finalCost = Math.min(finalCost, nextMove.cost);
        finalMove = nextMove;
        return;
      }

      queue.push(nextMove);
    })
  }

  return finalMove;
}

function getPath() {
  const finalMove = bfs();

  let m = finalMove;
  const path = [];
  while (m) {
    const p = m.position;
    racetrack[p.y][p.x] = "+";
    path.push(m);
    m = m.prev;
  }
  path.reverse();

  return path;
}

function countCheats(path, limit, threshold) {
  let totalCheats = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const start = path[i];
    for (let j = i + 1; j < path.length; j++) {
      const curr = path[j];
      const d = Math.abs(start.position.x - curr.position.x) + Math.abs(start.position.y - curr.position.y);
      if (d <= limit) {
        const originalCost = curr.cost - start.cost;
        const timeSaved = originalCost - d;
        if (timeSaved >= threshold) {
          totalCheats++;
        }
      }
    }
  }

  return totalCheats;
}

const path = getPath();
console.log(`Part 1: ${countCheats(path, 2, 100)}`);
console.log(`Part 2: ${countCheats(path, 20, 100)}`);