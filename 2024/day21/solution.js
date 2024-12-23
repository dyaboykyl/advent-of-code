import fs from 'fs';

// This solution does NOT produce the correct answer for part 2

const codes = fs.readFileSync("input").toString().split("\n");

const keypad = [
  "789",
  "456",
  "123",
  "_0A",
]

const directionalPad = [
  "_^A",
  "<v>",
]

function findSymbol(grid, symbol) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === symbol) {
        return { x, y }
      }
    }
  }
}

function makePath(change, options) {
  const option = change < 0 ? options[0] : options[1];
  return Array(Math.abs(change)).fill(option).join("");
}

function getPadPaths(start, end, grid, level) {
  const startPos = findSymbol(grid, start);
  const endPos = findSymbol(grid, end);
  const dy = endPos.y - startPos.y;
  const dx = endPos.x - startPos.x;

  const horPath = makePath(dx, ["<", ">"]);
  const virtPath = makePath(dy, ["^", "v"]);

  const paths = (() => {
    if (!dx) {
      return [virtPath];
    } else if (!dy) {
      return [horPath];
    }

    if (grid.length === 2) {
      if (startPos.y === 0 && endPos.x === 0) {
        return [virtPath.concat(horPath)];
      } else if (startPos.y === 1 && startPos.x === 0) {
        return [horPath.concat(virtPath)];
      }
    }

    if (grid.length === 4) {
      if (startPos.x === 0 && endPos.y === 3) {
        return [horPath.concat(virtPath)];
      } else if (startPos.y === 3 && endPos.x === 0) {
        return [virtPath.concat(horPath)];
      }
    }

    return [horPath.concat(virtPath), virtPath.concat(horPath)];
  })().map(p => p + "A");

  return paths;
}

function isArray(obj) {
  return obj.constructor.name === "Array";
}

function min(arr) {
  return arr.reduce((min, v) => Math.min(min, v), Infinity)
}

function sum(arr) {
  return arr.reduce((sum, v) => sum + v, 0)
}

function getNextLevel(path) {
  const paths = [];
  for (let i = -1; i < path.length - 1; i++) {
    const start = (i == -1) ? "A" : path[i];
    const end = path[i + 1];
    paths.push(getPadPaths(start, end, directionalPad, 2));
  }
  return paths;
}

const cache = new Map();

function dfsCost(level, path, directionalRobots) {
  const key = `${level}-${path}`;
  let cost = cache.get(key);
  if (cost) {
    return cost;
  }

  if (level === directionalRobots) {
    return path.length;
  }

  const nextLevelPaths = getNextLevel(path);
  cost = sum(nextLevelPaths.map(path => min(path.map(p => dfsCost(level + 1, p, directionalRobots)))));
  cache.set(key, cost);
  return cost;
}

function getCodeStepCostDfs(codeStepPathOptions, directionalRobots) {
  codeStepPathOptions = isArray(codeStepPathOptions) ? codeStepPathOptions : [codeStepPathOptions];
  const l2Paths = codeStepPathOptions.map(path => getNextLevel(path));

  const costs = l2Paths.map(l2Path => sum(l2Path.map(path => min(path.map(p => dfsCost(2, p, directionalRobots))))));
  const cost = min(costs);

  return cost;
}

function getCodeCost(code, directionalRobots) {
  const costs = [];
  for (let i = -1; i < code.length - 1; i++) {
    const start = (i == -1) ? "A" : code[i];
    const end = code[i + 1];
    const l1PathOptions = getPadPaths(start, end, keypad, 1);
    costs.push(getCodeStepCostDfs(l1PathOptions, directionalRobots));
  }

  return sum(costs);
}

function getCodeComplexity(code, directionalRobots) {
  return getCodeCost(code, directionalRobots) * parseInt(code.replace("A", ""))
}

for (const code of codes) {
  console.log(`${code}: ${getCodeCost(code, 3)}`)
}

const part1 = sum(codes.map(c => getCodeComplexity(c, 3)));
console.log(`Part 1: ${part1}`)
cache.clear();

// INCORRECT - Solution does NOT work for part 2
const part2 = sum(codes.map(c => getCodeComplexity(c, 25)));
console.log(`Part 2: ${part2}`)
