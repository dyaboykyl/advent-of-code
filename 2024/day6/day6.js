import fs from 'fs';

const grid = fs.readFileSync("day6/input").toString().split("\n").map(row => row.split(''));

const movementMap = {
  'u': [-1, 0, 'r', 'u'],
  'r': [0, 1, 'd', 'r'],
  'd': [1, 0, 'l', 'd'],
  'l': [0, -1, 'u', 'l']
}

const newObstacles = createEmptyGrid();
const visited = createEmptyGrid();

function createEmptyGrid() {
  return grid.map(row => row.map(v => '.'));
}

function getNewMovement(row, col, direction, gridToUse) {
  gridToUse ??= grid;
  const [rowChange, colChange, turn, currDirection] = movementMap[direction];
  const nextRow = row + rowChange;
  const nextCol = col + colChange;

  if (isObstacle(nextRow, nextCol, gridToUse)) {
    let nextMovement = getNewMovement(row, col, turn, gridToUse);
    if (isObstacle(nextMovement.row, nextMovement.col, gridToUse)) {
      nextMovement = getNewMovement(row, col, nextMovement.turn, gridToUse);
    }
    return nextMovement;
  } else {
    return { row: nextRow, col: nextCol, turn, currDirection };
  }
}

function findStartingPoint() {
  let col = -1;
  let row = grid.findIndex((row) => {
    col = row.indexOf('^');
    return col != -1;
  });

  return { row, col, direction: 'u' }
}

function inbounds(row, col) {
  return !(row < 0 || row >= grid.length || col < 0 || col >= grid[0].length);
}

function isObstacle(row, col, gridToUse) {
  gridToUse ??= grid;
  return inbounds(row, col) && gridToUse[row][col] === '#';
}

function checkLoop(obstacleRow, obstacleCol) {
  const old = grid[obstacleRow][obstacleCol];
  grid[obstacleRow][obstacleCol] = '#';
  const loop = moveGuard(false, createEmptyGrid()) == 'loop';
  grid[obstacleRow][obstacleCol] = old;

  return loop;
}

function moveGuard(loopCheck, visited) {
  let { row, col, direction } = findStartingPoint();
  while (true) {
    visited[row][col] = direction;
    let move = getNewMovement(row, col, direction);
    if (!inbounds(move.row, move.col)) {
      break;
    }

    if (loopCheck) {
      if (checkLoop(move.row, move.col)) {
        newObstacles[move.row][move.col] = 'O';
      }
    } else {
      if (visited[move.row][move.col] === move.currDirection) {
        return 'loop';
      }
    }

    row = move.row;
    col = move.col;
    direction = move.currDirection;
  }
}

function getVisitCount() {
  return visited.reduce(((sum, row) => sum + row.filter(v => movementMap[v]).length), 0);
}

function getNewObstacleCount() {
  return newObstacles.reduce(((sum, row) => sum + row.filter(v => v === 'O').length), 0);
}

moveGuard(true, visited);
console.log(`Visit count: ${getVisitCount()}`);
console.log(`New obstacle count: ${getNewObstacleCount()}`);

