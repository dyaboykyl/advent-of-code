import fs from 'fs';

const input = fs.readFileSync("input").toString()
const [gridStr, movesStr] = input.split("\n\n");
const grid = gridStr.split("\n").map(row => row.split(""));

const grid2 = grid.map(row => row.map(obj => {
  let replace;
  switch (obj) {
    case "@":
      replace = "@.";
      break;
    case ".":
    case "#":
      replace = obj + obj;
      break;
    case "O":
      replace = "[]"
      break;
  }
  return replace.split("")
}).flat());
const moves = movesStr.replaceAll("\n", "").split("");

const movementMap = {
  '>': { y: 0, x: 1 },
  '^': { y: -1, x: 0 },
  '<': { y: 0, x: -1 },
  'v': { y: 1, x: 0 },
}

function findRobot(grid) {
  const robot = {};

  grid.forEach((row, y) => row.forEach((value, x) => {
    if (value === "@") {
      robot.x = x;
      robot.y = y;
    }
  }));

  return robot;
}

function isWall(position, grid) {
  return grid[position.y][position.x] === "#";
}

function isBox(position) {
  return grid[position.y][position.x] === "O";
}

function isPartBox(position) {
  return grid2[position.y][position.x] === "[" || grid2[position.y][position.x] === "]";
}

function getNewPosition(position, direction,) {
  const movement = movementMap[direction];
  return { x: position.x + movement.x, y: position.y + movement.y };
}

function removeDuplicates(list) {
  return [...new Set(list.map(v => JSON.stringify(v))).values()].map(vs => JSON.parse(vs));
}

function moveObjects(objectsToMove, grid, direction) {
  while (objectsToMove.length > 0) {
    const position = objectsToMove.pop();
    const object = grid[position.y][position.x];
    const newPosition = getNewPosition(position, direction);
    grid[newPosition.y][newPosition.x] = object;
    grid[position.y][position.x] = ".";
  }
}

function getBox(position) {
  if (isPartBox(position)) {
    let obj = grid2[position.y][position.x]
    if (obj === "[") {
      return [position, (getNewPosition(position, '>'))]
    } else if (obj === "]") {
      return [(getNewPosition(position, '<')), position]
    }
  }

  return undefined;
}

function addBoxToList(position, list) {
  let box = getBox(position);
  let obj = grid2[position.y][position.x]
  if (obj === "[") {
    box.forEach(p => list.push(p))
  } else if (obj === "]") {
    box.reverse().forEach(p => list.push(p));
  }
  return box;
}

function getGpsSum(symbol, grid) {
  let sum = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === symbol) {
        sum += 100 * y + x;
      }
    }
  }
  return sum;
}

function moveRobot1(robot, direction) {
  const newPosition = getNewPosition(robot, direction);

  const objectsToMove = [robot];
  let positionToCheck = newPosition;
  while (isBox(positionToCheck)) {
    objectsToMove.push(positionToCheck);
    positionToCheck = getNewPosition(positionToCheck, direction);
  }

  if (isWall(positionToCheck, grid)) {
    return robot;
  }

  moveObjects(objectsToMove, grid, direction)
  return newPosition;
}

function moveRobot2(robot, direction) {
  const newPosition = getNewPosition(robot, direction);
  let objectsToMove = [robot];
  let positionToCheck = newPosition;
  if (direction === ">" || direction === "<") {
    while (isPartBox(positionToCheck)) {
      const box = addBoxToList(positionToCheck, objectsToMove);
      positionToCheck = getNewPosition(box[box.length - 1], direction);
    }

    if (isWall(positionToCheck, grid2)) {
      return robot;
    }
  } else {
    if (isWall(positionToCheck, grid2)) {
      return robot;
    }

    let boxesToCheck = [getBox(positionToCheck)];
    let boxToCheck;
    while (boxesToCheck.length > 0) {
      boxToCheck = boxesToCheck.shift();
      if (!boxToCheck) {
        continue;
      }
      boxToCheck.forEach(p => objectsToMove.push(p));
      objectsToMove = removeDuplicates(objectsToMove);

      const positionsToCheck = boxToCheck.map(p => getNewPosition(p, direction));
      if (positionsToCheck.some(p => isWall(p, grid2))) {
        return robot;
      }

      const newBoxes = positionsToCheck.map(p => getBox(p)).filter(b => b);
      newBoxes.forEach(b => boxesToCheck.push(b));
      boxesToCheck = removeDuplicates(boxesToCheck);
    }
  }

  moveObjects(objectsToMove, grid2, direction)
  return newPosition;
}


let robot1 = findRobot(grid);
let robot2 = findRobot(grid2);
moves.forEach((move, i) => {
  robot1 = moveRobot1(robot1, move);
  robot2 = moveRobot2(robot2, move);
});

const part1Sum = getGpsSum("O", grid);
const part2Sum = getGpsSum("[", grid2);
console.log(`Part 1 Sum: ${part1Sum} Part 2 Sum: ${part2Sum}`)

