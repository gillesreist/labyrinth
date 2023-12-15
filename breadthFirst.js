import { processInput } from "./processInput.js";

let laby = await processInput();

let coordinatesHistory = [];

let start;
let finished = false;
let blocked = false;
let historyCurrentPlace = 0;
let shortestPath = [];

async function expand() {
  while (!finished && !blocked) {
    await later(300);
    nextStep();
    consoleAnimation();
    historyCurrentPlace++;
    if (coordinatesHistory.length-1 < historyCurrentPlace) {
      blocked = true;
    }
  }
}

function later(delay) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
}

function retrace() {
  historyCurrentPlace = coordinatesHistory[coordinatesHistory.length - 1];
  shortestPath.push(historyCurrentPlace);
  while (
    shortestPath[shortestPath.length - 1][0] !== start[0] ||
    shortestPath[shortestPath.length - 1][1] !== start[1]
  ) {
    previousStep();
  }
  shortestPath.reverse();
}

function previousStep() {
  let smallest = coordinatesHistory.length;
  let previousCoordinates = [];
  const adjacents = existingAdjacents(shortestPath[shortestPath.length - 1]);
  adjacents.forEach((element) => {
    if (laby[element[1]][element[0]] < smallest) {
      smallest = laby[element[1]][element[0]];
      previousCoordinates = element;
    }
  });
  shortestPath.push(previousCoordinates);
}

function existingAdjacents(coordinates) {
  let north = [coordinates[0], coordinates[1] - 1];
  let east = [coordinates[0] + 1, coordinates[1]];
  let south = [coordinates[0], coordinates[1] + 1];
  let west = [coordinates[0] - 1, coordinates[1]];

  let northExist = north[1] >= 0;
  let eastExist = east[0] <= laby[east[1]].length;
  let southExist = south[1] < laby.length;
  let westExist = west[0] >= 0;

  let directions = [north, east, south, west];
  let directionsExist = [northExist, eastExist, southExist, westExist];
  let existingDirection = [];

  let i = 0;
  while (i < directions.length) {
    if (directionsExist[i]) {
      existingDirection.push(directions[i]);
    }
    i++;
  }

  return existingDirection;
}

function find(place) {
  let placeCoordinates = [];
  let found = false;
  let y = 0;
  let x = 0;

  while (y < laby.length && !found) {
    x = 0;
    while (x < laby[y].length && !found) {
      if (laby[y][x] === place) {
        placeCoordinates = [x, y];
        found = true;
      }
      x++;
    }
    y++;
  }
  return placeCoordinates;
}

function nextStep() {
  let directions = existingAdjacents(coordinatesHistory[historyCurrentPlace]);

  let i = 0;

  while (i < directions.length && !finished) {
    if (laby[directions[i][1]][directions[i][0]] === " . ") {
      coordinatesHistory.push([directions[i][0], directions[i][1]]);
      laby[directions[i][1]][directions[i][0]] = coordinatesHistory.length - 1;
    } else if (laby[directions[i][1]][directions[i][0]] === " G ") {
      coordinatesHistory.push([directions[i][0], directions[i][1]]);
      finished = true;
    }
    i++;
  }
}

function consoleAnimation() {
  console.clear();
  console.log("THE MAZE");
  let cloneLaby = JSON.parse(JSON.stringify(laby));
  cloneLaby.forEach((element) => {
    element.forEach((content, i) => {
      if (!isNaN(content) && content < 10) {
        element[i] = ` ${content} `;
      } else if (!isNaN(content)) {
        element[i] = `${content} `;
      }
    });
    console.log(element.join(" "));
  });
}

async function walkThroughPath() {
  let i = 0;
  while (i < shortestPath.length) {
    await later(300);
    laby[shortestPath[i][1]][shortestPath[i][0]] = " 😀";
    consoleAnimation();
    i++;
  }
}

async function findShortestPath() {
  start = find(" S ");
  laby[start[1]][start[0]] = 0;
  coordinatesHistory.push(start);
  await expand();
  if (finished) {
    retrace();
    await walkThroughPath();
    console.log(`The shortest path is ${shortestPath.length - 1} steps long :`);
    console.log(JSON.parse(JSON.stringify(Object.assign({}, shortestPath))));
  } else {
    console.log("Couldn't find the goal !")
  }
}

findShortestPath();
