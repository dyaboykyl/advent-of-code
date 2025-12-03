import fs from 'fs';

const input = fs.readFileSync("input").toString()
  .split('\n')
  .map(line => (line[0] === 'L' ? -1 : 1) * parseInt(line.slice(1)));

let dial = 50;
let password1 = 0;
let password2 = 0;

const rotate = (dial, step) => {
  let newDial = (dial + step) % 100;
  if (newDial < 0) newDial = 100 + newDial;
  return newDial;
}

input.forEach(step => {
  dial = rotate(dial, step);
  if (dial == 0) {
    password1++;
  }
});

console.log(`## Part 1 ##`);
console.log(password1);

dial = 50;
input.forEach(step => {
  if (step === 0) {
    return;
  }

  const fullRotations = Math.floor(Math.abs(step) / 100);
  if (fullRotations > 0) {
    step += (fullRotations * 100) * (step < 0 ? 1 : -1);
    password2 += fullRotations;
  }

  const newDial = rotate(dial, step);
  if ((dial != 0 && step > 0 && newDial <= dial) || (dial != 0 && step < 0 && newDial >= dial) || newDial == 0) {
    password2++;
  }

  dial = newDial;
});

console.log(`## Part 2 ##`);
console.log(password2);