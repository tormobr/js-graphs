const dimY = 20;
const dimX = 40;
const start_xy = [0, 0]
const targetXY = [dimX - 1, dimY - 1]

async function bfs(isDfs) {
    clearDrawings();
    var grid = document.getElementById("grid");
    const start = [0, 0, []];
    visited = []
    q = [start];
    
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



        grid.children[current[1]].children[current[0]].className = "taken_cell";
        await sleep(10);

        if (current[0] == targetXY[0] && current[1] == targetXY[1]) {
            markPath(newPath, grid);
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
}

function manhatten(x1, x2, y1, y2) {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

function getMin(queue) {
    var minValue = 1000000;
    queue.forEach(([x, y, path, H])) => {
        if H <
    });
}

async function astar() {
    clearDrawings();
    var grid = document.getElementById("grid");
    const start = [0, 0, []];
    visited = []
    q = [start];
    
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



        grid.children[current[1]].children[current[0]].className = "taken_cell";
        await sleep(10);

        if (current[0] == targetXY[0] && current[1] == targetXY[1]) {
            markPath(newPath, grid);
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
}
function clearDrawings() {
    for (var r = 0; r < dimY; r++) {
        for (var c = 0; c < dimX; c++) {
            if (["path_cell", "taken_cell"].includes(grid.children[r].children[c].className)){
                grid.children[r].children[c].className = "free_cell"
            }
        }
    }
}

function randomGrid() {
    var grid = document.getElementById("grid");
    for (var r = 0; r < dimY; r++) {
        for (var c = 0; c < dimX; c++) {
            const random = Math.random();
            if (random < 0.50) {
                grid.children[r].children[c].className = "free_cell";
            }
            else if (random >= 0.5) {
                grid.children[r].children[c].className = "wall_cell";
            }
        }
    }
}

async function markPath(path, grid) {
    path = path.reverse()
    for (var i = 0; i < path.length; i++) {
        [x, y] = path[i]
        grid.children[y].children[x].className = "path_cell";
        await sleep(50);
    }
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

function createGrid(){
    var grid = document.getElementById("grid");
    grid.innerHTML = "";

    for (var r = 0; r < dimY; r++) {

        var newRow = document.createElement("div");
        newRow.className = "row";

        for (var c = 0; c < dimX; c++) {
            var newCell = document.createElement("div");
            newCell.className = "free_cell";
            addEventListeners(newCell);

            newRow.appendChild(newCell);
        }

        grid.appendChild(newRow);
    }
}

function addEventListeners(cell) {
    cell.addEventListener("mouseover", event => {
        if (event.buttons == 1) {
            event.srcElement.className = "free_cell";
        }
    });
    cell.addEventListener("mousedown", event => {
        if (event.buttons == 1) {
            event.srcElement.className = "free_cell";
        }
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.onload = () => {
    createGrid();
};