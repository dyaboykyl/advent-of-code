import fs from 'fs';

const input = fs.readFileSync("input").toString();
const parts = input.split("\n\n");
const orders = parts[0].split("\n").map(o => {
  const pages = o.split("|");
  return { first: pages[0], second: pages[1] };
});

const updates = parts[1].split("\n").map(u => u.split(','));

const ordersBySecond = new Map();
orders.forEach(o => {
  const firsts = ordersBySecond.get(o.second) ?? [];
  firsts.push(o.first);
  ordersBySecond.set(o.second, firsts);
});

const correctUpdates = [];
const fixedUpdates = [];

function checkUpdate(pages, fixing) {
  const allPages = new Set(pages);
  const pagesSeen = new Set();

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    pagesSeen.add(page);
    const firsts = ordersBySecond.get(page);
    const errors = firsts?.filter(first => allPages.has(first) && !pagesSeen.has(first));
    if (firsts && errors.length !== 0) {
      const first = errors[0];
      const firstIndex = pages.indexOf(first);
      pages[i] = first;
      pages[firstIndex] = page;
      checkUpdate(pages, true);
      return;
    }
  }

  if (!fixing) {
    correctUpdates.push(pages);
  } else {
    fixedUpdates.push(pages);
  }
}

function getSum(updates) {
  return updates.reduce((prev, update) => {
    return prev + parseInt(update[Math.floor(update.length / 2)]);
  }, 0);
}

function part1() {
  const sum = getSum(correctUpdates);
  console.log(`Part 1 sum: ${sum}`);
}

function part2() {
  const sum = getSum(fixedUpdates);
  console.log(`Part 2 sum: ${sum}`);
}

updates.forEach(u => checkUpdate(u));
part1();
part2();

