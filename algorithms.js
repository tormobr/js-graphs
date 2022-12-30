
async function bfs(isDfs) {
    clearDrawings();
    disableButtons();
    const start = [startXY[0], startXY[1], []];
    visited = []
    var q = [start];
    
    while (q.length != 0) {
        let current;
        if (!isDfs) {
            current = q.shift()
        } else {
            current = q.pop()
        }

        // Check if current has been visited
        if (visited.some(x => current[0] == x[0] && current[1] == x[1])){
            continue;
        }
        visited.push(current);
        newPath = [...current[2]]
        newPath.push(current)



        if (!["start_cell", "end_cell"].includes(grid.children[current[1]].children[current[0]].className)) {
            grid.children[current[1]].children[current[0]].className = "search_cell";
        }
        await sleep(200);

        if (current[0] == targetXY[0] && current[1] == targetXY[1]) {
            await markPath(newPath, grid);
            break;
        }

        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
            const newX = current[0] + dx;
            const newY = current[1] + dy;
            if (!outOfBounds(newX, newY) && grid.children[newY].children[newX].className != "wall_cell") {
                q.push([newX, newY, newPath])
            }
        });
    }

    enableButtons();
}

async function astar() {
    clearDrawings();
    disableButtons();
    var H = manhatten(startXY[0], targetXY[0], startXY[1], targetXY[1]);
    var start = [startXY[0], startXY[1], [], H];
    visited = []
    var q = [start];
    
    while (q.length != 0) {
        let current;
        minIndex = getMin(q);
        current = q[minIndex];
        q.splice(minIndex, 1);

        // Check if current has been visited
        if (visited.some(x => current[0] == x[0] && current[1] == x[1])){
            continue;
        }
        visited.push(current);
        newPath = [...current[2]]
        newPath.push(current)



        if (!isStartOrEnd(current[0], current[1])) {
            grid.children[current[1]].children[current[0]].className = "search_cell";
        }
        await sleep(200);

        if (current[0] == targetXY[0] && current[1] == targetXY[1]) {
            await markPath(newPath, grid);
            break;
        }

        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
            const newX = current[0] + dx;
            const newY = current[1] + dy;
            if (!outOfBounds(newX, newY) && grid.children[newY].children[newX].className != "wall_cell") {
                var hFunction = document.getElementById("heuristic_function").value
                var newH;
                if (hFunction == "manhatten") {
                    newH = manhatten(newX, targetXY[0], newY, targetXY[1]) + newPath.length;
                } else if (hFunction == "euclidian") {
                    newH = euclidian(newX, targetXY[0], newY, targetXY[1]) + newPath.length;
                }
                return q.push([newX, newY, newPath, newH]);
            }
        });
    }

    enableButtons();
}

async function prims() {
    disableButtons();

    setGridValues("wall_cell", () => true);
    resetStartEndCells();

    var start = [startXY[0], startXY[1], 0, 0];
    visited = []
    var q = [start];
    
    while (q.length != 0) {
        var popIndex = Math.floor(Math.random()*q.length);
        var current = q[popIndex];
        q.splice(popIndex, 1)

        // Check if current has been visited
        if (visited.some(x => current[0] == x[0] && current[1] == x[1])){
            continue;
        }
        visited.push(current);
        if (!outOfBounds(current[0] - current[2], current[1] - current[3])) {
            if (!["start_cell", "end_cell"].includes(grid.children[current[1] - current[3]].children[current[0] - current[2]].className)) {
                grid.children[current[1] - current[3]].children[current[0] - current[2]].className = "free_cell";
            }
        }
        if (!outOfBounds(current[0], current[1])) {
            if (!["start_cell", "end_cell"].includes(grid.children[current[1]].children[current[0]].className)) {
                grid.children[current[1]].children[current[0]].className = "free_cell";
            }
        } else {
            continue;
        }

        await sleep(200);

        // Base case
        if (current[0] == targetXY[0] && current[1] == targetXY[1]) {
            await markPath(newPath, grid);
            break;
        }

        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
            const newX = current[0] + 2*dx;
            const newY = current[1] + 2*dy;
            if (outOfBounds(newX, newY) || grid.children[newY].children[newX].className == "wall_cell") {
                return q.push([newX, newY, dx, dy]);
            }
        });
    }

    enableButtons();
}

async function randomGrid() {
    for (var r = 0; r < dimY; r++) {
        for (var c = 0; c < dimX; c++) {
            const random = Math.random();
            if (random < 0.75) {
                grid.children[r].children[c].className = "free_cell";
            } else {
                grid.children[r].children[c].className = "wall_cell";
            }
        }
    }
    resetStartEndCells();
}


// Gets the slider value h-factor and verifies the value
function getHFactor() {
    var hFactor = document.getElementById("slider").value;

    var decimal = /^\d+\.\d{0,2}$/;
    var integer = /^\d+$/;
    if (!decimal.test(hFactor) && !integer.test(hFactor)) {
        hFactor = 1;
    }

    return hFactor;
}

// Heuristic functions
function manhatten(x1, x2, y1, y2) {
    return (Math.abs(x2 - x1) + Math.abs(y2 - y1)) * getHFactor();
}

function euclidian(x1, x2, y1, y2) {
    var a = x1 - x2;
    var b = y1 - y2;
    return (Math.sqrt( a*a + b*b)) * getHFactor();
}

// Gets the min value from queue
function getMin(queue) {
    var minValue = 1000000000000000;
    var minIndex = -1;
    minPath = 0;
    for (var i = 0; i < queue.length; i++) {
        var [x, y, path, H] = queue[i];
        if (H < minValue || (H == minValue && path.length > minPath)) {
            minValue = H;
            minIndex = i;
            minPath = path.length;
        }
    }

    return minIndex;
}

function outOfBounds(x, y) {
    if (x < 0 || x >= dimX) {
        return true;
    }
    if (y < 0 || y >= dimY) {
        return true;
    }

    return false
}

