const length = 20
const width = 20

let maze = [...Array(length)].map(e => Array(width).fill(' ■ '));

const start = [
   Math.floor((Math.random() * width/2)),
   Math.floor((Math.random() * length/2))
]

const goal = [
    Math.floor((Math.random() * width/2 + width/2)),
    Math.floor((Math.random() * length/2 + length/2))
 ]

 maze[start[1]][start[0]] = ' S ';
 maze[goal[1]][goal[0]] = ' G ';

 function consoleAnimation() {
    console.clear();
    let cloneMaze = JSON.parse(JSON.stringify(maze));
    cloneMaze.forEach((element) => console.log(element.join(" ")));
}

function existingAdjacents(coordinates) {
    let north = [coordinates[0], coordinates[1] - 1];
    let east = [coordinates[0] + 1, coordinates[1]];
    let south = [coordinates[0], coordinates[1] + 1];
    let west = [coordinates[0] - 1, coordinates[1]];
  
    let northExist = north[1] >= 0;
    let eastExist = east[0] < maze[east[1]].length;
    let southExist = south[1] < maze.length;
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

function createPath() {
        dig(start);
        consoleAnimation();
}


function dig(currentPosition) {
    const directions = existingAdjacents(currentPosition);

    let diggableAdjacents;

    let diggable = true;


    while (diggable) {

      diggable = false;
      diggableAdjacents = [];

      directions.forEach ((direction) => {
        if (maze[direction[1]][direction[0]] !== ' . ' && maze[direction[1]][direction[0]] !== ' S ' && maze[direction[1]][direction[0]] !== ' G ') {


          let nextToDug = false;
          let adjacents = existingAdjacents(direction);
          adjacents.forEach((furtherPlace) => {
            if (furtherPlace[0] !== currentPosition[0] && furtherPlace[1] !== currentPosition[1] && maze[furtherPlace[1]][furtherPlace[0]] == ' . ') {
              nextToDug = true;
            }
          })
          if (!nextToDug) {
            diggableAdjacents.push(direction);
          }
        }
      });
      
      if (diggableAdjacents.length > 0) {
        diggable = true;
        const randomDirection = Math.floor((Math.random() * (diggableAdjacents.length)));
        let nextPosition = diggableAdjacents[randomDirection];
        maze[nextPosition[1]][nextPosition[0]] = ' . ';
        consoleAnimation();
        dig(nextPosition);
      }
      
    }

}


createPath();