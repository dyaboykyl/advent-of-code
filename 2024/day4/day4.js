import fs from 'fs';

const input = fs.readFileSync("day4/input").toString();
const rows = input.split('\n');

const columns = [];

function countOccurences(grid) {
  return grid.reduce((prevCount, row) => prevCount + row.split('XMAS').length - 1 + row.split('SAMX').length - 1, 0);
}

function part1() {
  for (let i = 0; i < rows[0].length; i++) {
    columns.push(rows.map(row => row[i]).join(''));
  }

  const forwardDiaganols = [];
  for (let row = 0; row < rows.length; row++) {
    for (let col = 0; col < rows[0].length; col++) {
      let word = col - row;
      if (word < 0) {
        word = rows[0].length - word - 1;
      }
      const char = rows[row][col];
      if (!forwardDiaganols[word]) {
        forwardDiaganols[word] = '';
      }
      forwardDiaganols[word] += char;
    }
  }

  const reverseDiagonals = [];
  for (let row = 0; row < rows.length; row++) {
    for (let col = 0; col < rows[0].length; col++) {
      let word = col + row;
      const char = rows[row][col];
      if (!reverseDiagonals[word]) {
        reverseDiagonals[word] = '';
      }
      reverseDiagonals[word] += char;
    }
  }

  let count = countOccurences(rows) + countOccurences(columns) + countOccurences(forwardDiaganols) + countOccurences(reverseDiagonals);
  console.log(count);
}

function part2() {
  let squares = [];
  for (let row = 0; row < rows.length - 2; row++) {
    for (let col = 0; col < rows[0].length - 2; col++) {
      let square = [];
      for (let i = 0; i < 3; i++) {
        square.push(rows[row + i].slice(col, col + 3));
      }
      squares.push(square);
    }
  }

  const count = squares.filter(square => {
    if (square[1][1] !== 'A') {
      return false;
    }

    const corners = square[0][0] + square[0][2] + square[2][2] + square[2][0];
    return ['MMSS', 'SSMM', 'MSSM', 'SMMS'].includes(corners);
  }
  ).length;
  console.log(count);
}

part1();
part2();