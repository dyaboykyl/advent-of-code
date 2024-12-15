import fs from 'fs';

const WIDTH = 101;
const HEIGHT = 103;
const middleY = (HEIGHT - 1) / 2;
const middleX = (WIDTH - 1) / 2;

const robots = fs.readFileSync("input").toString().split("\n").map(robot => {
  const [pos, vel] = robot.split(" ");
  const startPosition = parsePair(pos);
  return { startPosition, position: { ...startPosition }, velocity: parsePair(vel) };
});

function parsePair(str) {
  const pair = str.split("=")[1].split(",");
  return { x: parseInt(pair[0]), y: parseInt(pair[1]) };
}

function move(robot, times, grid) {
  robot.position.x = (robot.position.x + times * robot.velocity.x) % WIDTH;
  if (robot.position.x < 0) {
    robot.position.x += WIDTH;
  }
  robot.position.y = (robot.position.y + times * robot.velocity.y) % HEIGHT;
  if (robot.position.y < 0) {
    robot.position.y += HEIGHT;
  }

  grid && grid[robot.position.y][robot.position.x]++;
}

function getQuadrant(robot) {
  if (robot.position.y === middleY || robot.position.x === middleX) {
    return -1;
  }

  const x = robot.position.x > middleX ? 2 : 1;
  const y = robot.position.y > middleY ? 2 : 0;

  return y + x;
}

function getTree() {
  const grid = [];
  for (let i = 0; i < HEIGHT; i++) {
    grid.push(Array(WIDTH).fill(0))
  }
  robots.forEach(r => move(r, 1, grid));

  for (let xBound = 5; xBound < WIDTH; xBound += 5) {
    for (let yBound = 5; yBound < HEIGHT; yBound += 5) {
      let together = true;
      for (let x = xBound - 5; x < xBound; x++) {
        for (let y = yBound - 5; y < yBound; y++) {
          if (grid[y][x] === 0) {
            together = false;
          }
        }
      }
      if (together) {
        return true;
      }
    }
  }

  return false;
}

function part1() {
  robots.forEach(r => move(r, 100));
  const quadrantMap = { 4: 0, 1: 0, 2: 0, 3: 0 };
  const quadrants = robots.map(r => getQuadrant(r)).filter(q => q !== -1);
  quadrants.forEach(q => quadrantMap[q]++);
  const safetyFactor = Object.values(quadrantMap).reduce((prev, count) => prev * count, 1);
  console.log(`Safety factory: ${safetyFactor}`);
}

function part2() {
  let i = 1;
  while (!getTree() && i < 1000000) {
    i++;
  }
  console.log(`Seconds until tree: ${i}`);
}


part1();
part2();