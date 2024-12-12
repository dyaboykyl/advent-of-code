import fs from 'fs';

const garden = fs.readFileSync("input").toString().split("\n");

const visited = garden.map(row => []);
const gardenQueue = [];
const regions = [];
let totalPrice1 = 0;
let totalPrice2 = 0;

const DIRECTIONS = ['l', 'd', 'r', 'u'];

function getNeighbors(plant, plot) {
  const { row, col } = plot;
  const neighbors = [
    { direction: 'u', row: row - 1, col },
    { direction: 'l', row, col: col - 1 },
    { direction: 'd', row: row + 1, col },
    { direction: 'r', row, col: col + 1 },
  ].map(plot => {
    if (!(plot.row >= 0 && plot.row < garden.length
      && plot.col >= 0 && plot.col < garden[row].length)) {
      plot.out = true;
    }

    return plot;
  });


  const regionPlots = [];
  const otherPlots = [];
  for (const plot of neighbors) {
    if (plot.out || garden[plot.row][plot.col] !== plant) {
      otherPlots.push(plot);
    } else {
      regionPlots.push(plot);
    }
  }

  return { regionPlots, otherPlots };
}

function sideEquals(a, b) {
  return a.direction === b.direction
    && a.id === b.id;
}

function sideMatches(a, b) {
  if (a.direction !== b.direction) {
    return false;
  }

  if (['l', 'r'].includes(a.direction)) {
    return a.col === b.col;
  }

  return a.row === b.row;
}

function combineDuplicateSides(sidesToCheck, dedupedSides) {
  if (!sidesToCheck) {
    return;
  }

  for (const direction of DIRECTIONS) {
    const potentialDuplicates = sidesToCheck.filter(side => side.direction === direction);
    if (potentialDuplicates.length < 2) {
      continue;
    }

    const matchingGroups = {};
    potentialDuplicates.forEach(side => {
      const key = ['l', 'r'].includes(side.direction) ? `c${side.col}` : `r${side.row}`;
      const dups = matchingGroups[key] ?? [];
      dups.push(side);
      matchingGroups[key] = dups;
    });

    for (const duplicates of Object.values(matchingGroups)) {
      if (duplicates.length < 2) {
        continue;
      }

      const deduped = dedupedSides.find(sides => sides.find(side => sideMatches(side, duplicates[0])));
      if (!deduped) {
        dedupedSides.push(duplicates);
      } else {
        duplicates.forEach(d => {
          if (!deduped.find(s => sideEquals(s, d))) {
            deduped.push(d);
          }
        })
      }
    }
  }
}

function identifyRegion(plant, startRow, startCol) {
  const regionQueue = [{ row: startRow, col: startCol }];
  let area = 0;
  let perimeter = 0;
  const sideCounts = { 'l': 0, 'r': 0, 'u': 0, 'd': 0 };
  const dedupedSides = [];

  while (regionQueue.length > 0) {
    const plot = regionQueue.pop();
    const { row, col, prevSides } = plot;
    if (visited[row][col]) {
      continue;
    }

    visited[row][col] = 1;
    const { regionPlots, otherPlots } = getNeighbors(plant, plot);
    area++;
    perimeter += (4 - regionPlots.length);
    const potentialSides = otherPlots.map(plot => plot.direction);
    const validPrevSides = prevSides?.filter(side => potentialSides.includes(side.direction));
    combineDuplicateSides(validPrevSides, dedupedSides);

    const actualSides = otherPlots.map(plot => {
      const direction = plot.direction;
      const prevSide = validPrevSides?.find(s => s.direction === direction);
      return prevSide ?? { direction, id: ++sideCounts[direction], col, row };
    });

    regionPlots.forEach(plot => {
      const existingPlot = regionQueue.find(other => other.row === plot.row && other.col === plot.col);
      if (existingPlot) {
        existingPlot.prevSides = [...existingPlot.prevSides].concat(actualSides);
      } else {
        regionQueue.push({
          row: plot.row,
          col: plot.col,
          prevSides: actualSides
        })
      }
    });
    otherPlots.filter(plot => !plot.out)
      .forEach(plot => gardenQueue.push({ row: plot.row, col: plot.col }));
  }

  dedupedSides.forEach(dedupedSide => {
    sideCounts[dedupedSide[0].direction] -= (dedupedSide.length - 1);
  });
  const sides = Object.values(sideCounts).reduce((sum, count) => sum + count, 0);
  const region = { plant, area, perimeter, sides, price1: area * perimeter, price2: area * sides };
  regions.push(region);
  totalPrice1 += region.price1;
  totalPrice2 += region.price2;
}

gardenQueue.push({ row: 0, col: 0 });
while (gardenQueue.length > 0) {
  const { row, col } = gardenQueue.pop();
  if (visited[row][col]) {
    continue;
  }

  const plant = garden[row][col];
  identifyRegion(plant, row, col);
}

console.log(`Total price by perimeter: ${totalPrice1}`);
console.log(`Total price by side: ${totalPrice2}`);
