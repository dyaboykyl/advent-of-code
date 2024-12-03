import { MinPriorityQueue } from '@datastructures-js/priority-queue';
import { parse } from 'csv-parse/sync';
import fs from 'fs/promises';

const raw = await fs.readFile("day1/input");
const lines = parse(raw, { delimiter: '   ' });
const length = lines.length;

function part1() {
  const heap1 = new MinPriorityQueue();
  const heap2 = new MinPriorityQueue();
  lines.forEach(line => {
    heap1.push(line[0]);
    heap2.push(line[1])
  });


  let totalDistance = 0;
  for (let i = 0; i < length; i++) {
    const distance = Math.abs(heap1.pop() - heap2.pop());
    totalDistance += distance;
  }

  console.log(`Total Distance: ${totalDistance}`);
}

function part2() {
  const list1 = [];
  const list2AppearanceMap = new Map();
  lines.forEach(line => {
    list1.push(line[0]);

    const value = line[1];
    let occurences = list2AppearanceMap.get(value) ?? 0;
    list2AppearanceMap.set(value, occurences + 1);
  });

  let similarity = list1.reduce((prev, curr) => prev + curr * (list2AppearanceMap.get(curr) ?? 0), 0);

  console.log(`Similarity: ${similarity}`);
}

part1();
part2();