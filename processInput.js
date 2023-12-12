import * as fs from "node:fs";
import readline from "node:readline/promises";

export async function processInput() {
  const fileStream = fs.createReadStream("./input");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let laby = [];

  for await (const line of rl) {
    let row = line.split("");
    row = row.map(i => ' '+i+' ')
    laby.push(row);
  }

  return laby;
}