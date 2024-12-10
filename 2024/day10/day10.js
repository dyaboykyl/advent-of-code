import fs from 'fs';

const input = fs.readFileSync("day10/input").toString();
const map = input.split("\n").map(row => row.split("").map(col => parseInt(col)));

function getNeighbors(row, col) {
  return [{ row: row - 1, col }, { row, col: col - 1 }, { row: row + 1, col }, { row, col: col + 1 }]
    .filter(neighbor => neighbor.row >= 0 && neighbor.row < map.length && neighbor.col >= 0 && neighbor.col < map[row].length)
}

function getScoreAndRating(startRow, startCol) {
  const queue = [];
  const visited = map.map(row => Array(row.length).fill(0));
  queue.push({ row: startRow, col: startCol });
  do {
    const { row, col } = queue.pop();
    let height = map[row][col];

    for (const neighbor of getNeighbors(row, col)) {
      const neighborHeight = map[neighbor.row][neighbor.col];
      if (neighborHeight - height === 1) {
        if (neighborHeight === 9) {
          visited[neighbor.row][neighbor.col]++;
        } else {
          queue.push(neighbor);
        }
      }
    }
  } while (queue.length !== 0);

  let score = 0;
  const rating = visited.reduce((sum, row) => sum + row.reduce((rowSum, count) => {
    if (count > 0) {
      score++;
    }
    return rowSum + count;
  }, 0), 0);

  return { score, rating }
}

const scoresAndRatings = [];
for (let row = 0; row < map.length; row++) {
  for (let col = 0; col < map[row].length; col++) {
    if (map[row][col] !== 0) {
      continue;
    }

    scoresAndRatings.push(getScoreAndRating(row, col));
  }
}

const sums = scoresAndRatings.reduce((sums, sr) => {
  sums.scoreSum += sr.score;
  sums.ratingSum += sr.rating;
  return sums;
}, { scoreSum: 0, ratingSum: 0 });
console.log(`Score: ${sums.scoreSum} Rating: ${sums.ratingSum}`);