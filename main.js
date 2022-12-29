const dimY = 30;
const dimX = 70;
const startXY = [0, 0]
const targetXY = [dimX - 1, dimY - 1]

async function bfs(isDfs) {
    clearDrawings();
    disableButtons();
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
}

function manhatten(x1, x2, y1, y2) {
    var hFactor = document.getElementById("slider").value;

    var decimal = /^\d+\.\d{0,2}$/;
    var integer = /^\d+$/;
    if (!decimal.test(hFactor) && !integer.test(hFactor)) {
        hFactor = 1;
    }
    return (Math.abs(x2 - x1) + Math.abs(y2 - y1)) * hFactor;
}

function euclidian(x1, x2, y1, y2) {
    var a = x1 - x2;
    var b = y1 - y2;
    return (Math.sqrt( a*a + b*b));
}

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

async function astar() {
    clearDrawings();
    disableButtons();
    var grid = document.getElementById("grid");
    const H = manhatten(startXY[0], targetXY[0], startXY[1], targetXY[1]);
    const start = [startXY[0], startXY[1], [], H];
    visited = []
    q = [start];
    
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



        grid.children[current[1]].children[current[0]].className = "taken_cell";
        await sleep(10);

        if (current[0] == targetXY[0] && current[1] == targetXY[1]) {
            await markPath(newPath, grid);
            break;
        }

        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
            const newX = current[0] + dx;
            const newY = current[1] + dy;
            if (!outOfBounds(newX, newY) && grid.children[newY].children[newX].className != "wall_cell") {
                return q.push([newX, newY, newPath, manhatten(newX, targetXY[0], newY, targetXY[1]) + newPath.length]);
            }
        });
    }

    enableButtons();
}

function disableButtons() {
    buttons = document.getElementsByClassName("button");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }
}

function enableButtons() {
    buttons = document.getElementsByClassName("button");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = false;
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

async function randomGrid() {
    var grid = document.getElementById("grid");
    for (var r = 0; r < dimY; r++) {
        for (var c = 0; c < dimX; c++) {
            const random = Math.random();
            if (random < 0.75) {
                grid.children[r].children[c].className = "free_cell";
            } else {
                grid.children[r].children[c].className = "wall_cell";
            }
            await sleep(0.1);
        }
    }
    grid.children[startXY[1]].children[startXY[0]].className = "free_cell";
    grid.children[targetXY[1]].children[targetXY[0]].className = "free_cell";
}

async function markPath(path, grid) {
    path = path.reverse()
    for (var i = 0; i < path.length; i++) {
        [x, y] = path[i]
        grid.children[y].children[x].className = "path_cell";
        await sleep(10);
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
        event.preventDefault();
        if (event.buttons == 1) {
            if (document.getElementById("draw_wall").checked) {
                event.srcElement.className = "wall_cell";
            } else{
                event.srcElement.className = "free_cell";
            }
        }
    });
    cell.addEventListener("mousedown", event => {
        event.preventDefault();
        if (event.buttons == 1) {
            if (document.getElementById("draw_wall").checked) {
                event.srcElement.className = "wall_cell";
            } else{
                event.srcElement.className = "free_cell";
            }
        }
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.onload = () => {
    createGrid();
    var slider = document.getElementById("slider");
    var output = document.getElementById("slider_value");
    output.innerHTML = slider.value;

    slider.oninput = function() {
        output.innerHTML = this.value;
    }
};

