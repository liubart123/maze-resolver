const stdin = process.openStdin();
let mazeInput = "";
let maze;

stdin.addListener("data", (input) => {
    input = input.toString().trim();
    mazeInput += input;
    if (input === ']') {
        mazeInput = mazeInput.replace(/'/g, '\"');
        maze = JSON.parse(mazeInput);
        mazeInput = "";
        resolveMaze()
            .then((res) => {
                console.log('resulted maze:');
                for (let row of maze) {
                    let stringRow = "";
                    for (let cell of row) {
                        stringRow += cell + ' ';
                    }
                    console.log(stringRow);
                }
                console.log('resulted path: ' + startMazeJourneyToFindPath(res.endX, res.endY));
                console.log('enter maze in JSON format:');
            });
    }
});




maze = [

    ['#', '#', '#', '#', '#', '#', '#', '#', '#'],

    ['#', '+', '+', '+', '#', '+', '+', '+', '#'],

    ['#', '+', '#', '+', '#', '+', '#', '+', '#'],

    ['+', '+', '#', '+', '0', '+', '#', '+', '#'],

    ['#', '#', '#', '+', '#', '#', '#', '#', '#'],

    ['#', '#', '+', '+', '#', '#', '#', '#', '#'],

    ['#', '#', '+', '#', '#', '#', '#', '#', '#'],

    ['#', '#', '#', '#', '#', '#', '#', '#', '#']

];

// maze = [

//     ['#', '#', '#', '#', '#', '#', '#', '#', '#'],

//     ['#', '+', '+', '+', '#', '+', '+', '+', '#'],

//     ['#', '+', '#', '+', '#', '+', '#', '+', '#'],

//     ['#', '+', '#', '+', '0', '#', '+', '+', '+'],

//     ['#', '+', '+', '#', '#', '#', '+', '#', '#'],

//     ['#', '#', '+', '+', '+', '+', '+', '#', '#'],

//     ['#', '+', '+', '#', '#', '#', '#', '#', '#'],

//     ['#', '#', '#', '#', '#', '#', '#', '#', '#']

// ];

resolveMaze()
    .then((res) => {
        console.log('resulted maze:');
        for (let row of maze) {
            let stringRow = "";
            for (let cell of row) {
                stringRow += cell + ' ';
            }
            console.log(stringRow);
        }
        console.log('resulted path: ' + startMazeJourneyToFindPath(res.endX, res.endY));
        console.log('enter maze in JSON format:');
    });



function resolveMaze() {
    let x, y = 0;
    for (let row of maze) {
        x = 0;
        for (let cell of row) {
            if (cell === '0') {
                return new Promise(async res => {
                    await startMazeJourneyToChangeMaze(x, y, (endX, endY) => {
                        res({ endX, endY });
                    });
                });
            }
            x++;
        }
        y++;
    }

}



async function startMazeJourneyToChangeMaze(x, y, callback) {
    for (let angle = 0; angle < 4; angle++) {
        let newX = x + Math.round(Math.cos(angle * Math.PI / 2));
        let newY = y - Math.round(Math.sin(angle * Math.PI / 2));
        if (checkAreCoordsValid(newX, newY, maze)) {
            if (maze[newY][newX] === '+') {
                maze[newY][newX] = convertAngleToChar(angle);
                if (checkAreCoordsOnBorder(newX, newY, maze)) {
                    callback(newX, newY);
                    // return;
                } else {
                    startMazeJourneyToChangeMaze(newX, newY, callback);
                }
            }
        }
    }
}


function startMazeJourneyToFindPath(x, y) {
    if (maze[y][x] === '0') {
        return '';
    } else if (maze[y][x] === '►') {
        return startMazeJourneyToFindPath(x - 1, y) + ', ' + maze[y][x];
    } else if (maze[y][x] === '▲') {
        return startMazeJourneyToFindPath(x, y + 1) + ', ' + maze[y][x];
    } else if (maze[y][x] === '◄') {
        return startMazeJourneyToFindPath(x + 1, y) + ', ' + maze[y][x];
    } else if (maze[y][x] === '▼') {
        return startMazeJourneyToFindPath(x, y - 1) + ', ' + maze[y][x];
    }
}

function checkAreCoordsValid(x, y, doubleArr) {
    return x >= 0 && y >= 0 && y < doubleArr.length && x < doubleArr[y].length;
}

function checkAreCoordsOnBorder(x, y, doubleArr) {
    return checkAreCoordsValid(x, y, doubleArr) && (x == 0 || y == 0 || y == doubleArr.length - 1 || x == doubleArr[y].length - 1);
}

function convertAngleToChar(angle) {
    if (angle == 0) return '►';
    if (angle == 1) return '▲';
    if (angle == 2) return '◄';
    if (angle == 3) return '▼';
    return '?';
}