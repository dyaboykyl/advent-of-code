import fs from 'fs';

const numbers = fs.readFileSync("input").toString().split("\n").map(v => parseInt(v));
const priceChangeCache = {};

function XOR(v1, v2) {
  var hi = 0x80000000;
  var low = 0x7fffffff;
  var hi1 = ~~(v1 / hi);
  var hi2 = ~~(v2 / hi);
  var low1 = v1 & low;
  var low2 = v2 & low;
  var h = hi1 ^ hi2;
  var l = low1 ^ low2;
  const result = h * hi + l;
  return result;
}

function mix(a, b) {
  return XOR(a, b);
}

function prune(a) {
  return a % 16777216;
}

function nextSecretNumber(x) {
  x = prune(mix(x * 64, x));
  x = prune(mix(x / 32, x));
  x = prune(mix(x * 2048, x));
  return x;
}

function getNSecretNumbers(x, n) {
  const secrets = [x];
  for (let i = 0; i < n; i++) {
    x = nextSecretNumber(x);
    secrets.push(x);
  }
  return secrets;
}

function getNthSecretNumber(x, n) {
  return getNSecretNumbers(x, n)[n];
}

function onesDigit(x) {
  const str = `${x}`;
  return parseInt(str[str.length - 1]);
}

function scanPriceChanges(first2000) {
  const localCache = {};
  for (let i = 1; i < 1997; i++) {
    const changes = [];
    for (let c = i; c < i + 4; c++) {
      changes.push(onesDigit(first2000[c]) - onesDigit(first2000[c - 1]));
    }
    const key = changes.join(",");
    if (localCache[key]) {
      continue;
    }

    const price = onesDigit(first2000[i + 3]);
    let totalPrice = priceChangeCache[key] ?? 0;
    totalPrice += price;
    priceChangeCache[key] = totalPrice;
    localCache[key] = 1;
  }
}

const first2000s = numbers.map(x => getNSecretNumbers(x, 2000));

const sum = first2000s.reduce((sum, first2000) => sum + first2000[2000], 0);
console.log(`Part 1: ${sum}`);

first2000s.forEach(first2000 => scanPriceChanges(first2000));
const bestTotalPrice = Object.values(priceChangeCache).reduce((max, v) => Math.max(max, v), 0);
console.log(`Part 2: ${bestTotalPrice}`)