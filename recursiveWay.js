import { processInput } from "./processInput.js";

let laby = await processInput();

let start = find(" S ");
let steps = 0;
let goal = [];

async function findGoal(currentPlaceCoordinates) {
  let tentatives = 0;
  while (tentatives < 3 && goal.length === 0) {
    let newPlaceCoordinates = findNextPlace(currentPlaceCoordinates);
    consoleAnimation(newPlaceCoordinates);
    await later(300);

    if (newPlaceCoordinates !== currentPlaceCoordinates) {
      await findGoal(newPlaceCoordinates);
    }
    tentatives++;
  }
  if (goal.length === 0) {
    steps++;
  }
}

function later(delay) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
}

function findNextPlace(currentPlaceCoordinates) {
  currentPlaceCoordinates = walk(currentPlaceCoordinates);
  if (isNewCase(currentPlaceCoordinates)) {
    updateCurrentPlaceContent(currentPlaceCoordinates);
    steps++;
  } else if (isGoal(currentPlaceCoordinates)) {
    goal = currentPlaceCoordinates;
  } else if (isStart(currentPlaceCoordinates)) {
    throw new Error("Aucune sortie n'a été trouvée.");
  }
  return currentPlaceCoordinates;
}

function consoleAnimation(currentPlaceCoordinates) {
  console.clear();

  let cloneLaby = JSON.parse(JSON.stringify(laby));
  cloneLaby[currentPlaceCoordinates[1]][currentPlaceCoordinates[0]] = "=0=";

  cloneLaby.forEach((element) => console.log(element.join(" ")));
  console.log(`current steps : ${steps}`);
}

function walk(currentPlaceCoordinates) {
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
  let i = 0;

  while (i < directions.length) {
    if (
      directionsExist[i] &&
      (laby[directions[i][1]][directions[i][0]] === " . " ||
        laby[directions[i][1]][directions[i][0]] === " G ")
    ) {
      return directions[i];
    }
    i++;
  }
  return currentPlaceCoordinates;
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

function isNewCase(currentPlaceCoordinates) {
  return laby[currentPlaceCoordinates[1]][currentPlaceCoordinates[0]] === " . ";
}
function isGoal(currentPlaceCoordinates) {
  return laby[currentPlaceCoordinates[1]][currentPlaceCoordinates[0]] === " G ";
}
function isStart(currentPlaceCoordinates) {
  return laby[currentPlaceCoordinates[1]][currentPlaceCoordinates[0]] === " S ";
}

function updateCurrentPlaceContent(currentPlaceCoordinates) {
  if (steps < 10) {
    laby[currentPlaceCoordinates[1]][currentPlaceCoordinates[0]] = ` ${steps} `;
  } else {
    laby[currentPlaceCoordinates[1]][currentPlaceCoordinates[0]] = `${steps} `;
  }
}

try {
  await findGoal(start);
  console.log(
    `You found your goal at x:${goal[0]}, y:${goal[1]} in ${steps} steps.`
  );
} catch (e) {
  console.error(e);
}
