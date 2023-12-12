import { processInput } from "./processInput.js";

let laby = await processInput();

let start = find("S");
let goal = find("G");
let currentPlaceCoordinates = start;
let previousPlaceCoordinates = [];
let steps = 0;
let currentPlaceContent = "S";

while (currentPlaceCoordinates !== goal) {
  walk();
  checkCurrentCaseContent();
  if (isNewCase()) {
    updateCurrentPlaceContent();
  } else if (currentPlaceContent !== "G") {
    goBack();
  } else {
    finished();
  }
  steps++;
}

function walk() {
  let northExist = currentPlaceCoordinates[1] - 1 >= 0;
  let eastExist =
    currentPlaceCoordinates[0] + 1 <= laby[currentPlaceCoordinates[1]].length;
  let southExist = currentPlaceCoordinates[1] + 1 < laby.length;
  let westExist = currentPlaceCoordinates[0] - 1 >= 0;

  let north = [currentPlaceCoordinates[0], currentPlaceCoordinates[1] - 1];
  let east = [currentPlaceCoordinates[0] + 1, currentPlaceCoordinates[1]];
  let south = [currentPlaceCoordinates[0], currentPlaceCoordinates[1] + 1];
  let west = [currentPlaceCoordinates[0] - 1, currentPlaceCoordinates[1]];

  let directions = [north, east, south, west];
  let directionsExist = [northExist, eastExist, southExist, westExist];
  
  previousPlaceCoordinates = currentPlaceCoordinates;

  let walked = false;
  let i = 0;

  while (i < directions.length && !walked) {
    if (
      directionsExist[i] &&
      (laby[directions[i][1]][directions[i][0]] === "." ||
        laby[directions[i][1]][directions[i][0]] === "G")
    ) {
      currentPlaceCoordinates = directions[i];
      walked = true;
    }
    i++;
  }
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

function isNewCase() {
  return currentPlaceContent === ".";
}

function goBack() {
  currentPlaceCoordinates = currentPlaceContent;
}

function finished() {
  currentPlaceCoordinates = goal;
}

function checkCurrentCaseContent() {
  currentPlaceContent =
    laby[currentPlaceCoordinates[1]][currentPlaceCoordinates[0]];
}

function updateCurrentPlaceContent() {
  laby[currentPlaceCoordinates[1]][currentPlaceCoordinates[0]] =
    previousPlaceCoordinates;
}

laby.forEach((element) => console.log(element.join(" ")));
console.log(`You found your goal in ${steps} steps.`);
