var dimY = 30;
var dimX = 65;
var startXY = [0, 0]
var targetXY = [dimX - 1, dimY - 1]
var isStartEnabled = false;
var isEndEnabled = false;
var isErasorEnabled = false;
var isDrawingEnabled = false;

async function bfs(isDfs) {
    clearDrawings();
    disableButtons();
    var grid = document.getElementById("grid");
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
            grid.children[current[1]].children[current[0]].className = "taken_cell";
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

function getHFactor() {
    var hFactor = document.getElementById("slider").value;

    var decimal = /^\d+\.\d{0,2}$/;
    var integer = /^\d+$/;
    if (!decimal.test(hFactor) && !integer.test(hFactor)) {
        hFactor = 1;
    }

    return hFactor;
}

function manhatten(x1, x2, y1, y2) {
    return (Math.abs(x2 - x1) + Math.abs(y2 - y1)) * getHFactor();
}

function euclidian(x1, x2, y1, y2) {
    var a = x1 - x2;
    var b = y1 - y2;
    return (Math.sqrt( a*a + b*b)) * getHFactor();
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



        if (!["start_cell", "end_cell"].includes(grid.children[current[1]].children[current[0]].className)) {
            grid.children[current[1]].children[current[0]].className = "taken_cell";
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
    var grid = document.getElementById("grid");

    for (var r = 0; r < dimY; r++) {
        for (var c = 0; c < dimX; c++) {
            grid.children[r].children[c].className = "wall_cell"
        }
    }
    grid.children[startXY[1]].children[startXY[0]].className = "start_cell";
    grid.children[targetXY[1]].children[targetXY[0]].className = "end_cell";

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

function clearGrid() {
    for (var r = 0; r < dimY; r++) {
        for (var c = 0; c < dimX; c++) {
            if (!["start_cell", "end_cell"].includes(grid.children[r].children[c].className)) {
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
        }
    }
    grid.children[startXY[1]].children[startXY[0]].className = "start_cell";
    grid.children[targetXY[1]].children[targetXY[0]].className = "end_cell";
}

async function markPath(path, grid) {
    path = path.reverse()
    for (var i = 0; i < path.length; i++) {
        [x, y] = path[i]
        if (!["start_cell", "end_cell"].includes(grid.children[y].children[x].className)) {
            grid.children[y].children[x].className = "path_cell";
        }
        await sleep(200);
    }
    grid.children[startXY[1]].children[startXY[0]].className = "start_cell";
    grid.children[targetXY[1]].children[targetXY[0]].className = "end_cell";
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
    grid.children[startXY[1]].children[startXY[0]].className = "start_cell";
    grid.children[targetXY[1]].children[targetXY[0]].className = "end_cell";
}

function addEventListeners(cell) {
    cell.addEventListener("mouseover", event => {
        event.preventDefault();
        if (event.buttons == 1) {
            if (isErasorEnabled) {
                event.srcElement.className = "wall_cell";
            }
            else if (isDrawingEnabled){
                event.srcElement.className = "free_cell";
            }
        }
    });
    cell.addEventListener("mousedown", event => {
        event.preventDefault();
        if (event.buttons == 1) {
            if (isErasorEnabled) {
                event.srcElement.className = "wall_cell";
            }
            else if (isDrawingEnabled){
                event.srcElement.className = "free_cell";
            }
            else if (isStartEnabled) {
                grid.children[startXY[1]].children[startXY[0]].className = "free_cell";
                for (var r = 0; r < dimY; r++) {
                    for (var c = 0; c < dimX; c++) {
                        if (grid.children[r].children[c] == event.srcElement) {
                            startXY = [c, r];
                            grid.children[r].children[c].className = "start_cell";
                        }
                    }
                }
            }
            else if (isEndEnabled) {
                grid.children[targetXY[1]].children[targetXY[0]].className = "free_cell";
                for (var r = 0; r < dimY; r++) {
                    for (var c = 0; c < dimX; c++) {
                        if (grid.children[r].children[c] == event.srcElement) {
                            targetXY = [c, r];
                            grid.children[r].children[c].className = "end_cell";
                        }
                    }
                }
            }
        }
    });
}

function sleep(ms) {
    var sleepTime = ms / document.getElementById("animation_slider").value;
    return new Promise(resolve => setTimeout(resolve, sleepTime));
}

window.onload = () => {
    createGrid();
    addSliderLogic();
    addDrawingLogic();
    document.body.addEventListener("mouseup", () => {
        document.getElementById("help").style.display = "none";
    });
    document.body.addEventListener("keydown", (e) => {
        if(e.key === "Escape") {
            document.getElementById("help").style.display = "none";
        }
    });
};

function addDrawingLogic() {
    var start = document.getElementById("start_cell");
    var end = document.getElementById("end_cell");
    var erasor = document.getElementById("erasor_cell");
    var drawing = document.getElementById("draw_cell");

    start.addEventListener("mousedown", () => {
        event.preventDefault();
        isEndEnabled = false;
        isErasorEnabled = false;
        isDrawingEnabled = false;
        isStartEnabled = true;
        document.body.style.cursor = "url('./assets/green.png'), auto";
    });

    end.addEventListener("mousedown", () => {
        event.preventDefault();
        isStartEnabled = false;
        isErasorEnabled = false;
        isDrawingEnabled = false;
        isEndEnabled = true;
        document.body.style.cursor = "url('./assets/red.png'), auto";
    });

    erasor.addEventListener("mousedown", () => {
        event.preventDefault();
        isStartEnabled = false;
        isEndEnabled = false;
        isDrawingEnabled = false;
        isErasorEnabled = true;
        document.body.style.cursor = "url('./assets/eraser.png'), auto";
    });
    drawing.addEventListener("mousedown", () => {
        event.preventDefault();
        isStartEnabled = false;
        isEndEnabled = false;
        isErasorEnabled = false;
        isDrawingEnabled = true;
        document.body.style.cursor = "url('./assets/white.png'), auto";
    });
}

function addSliderLogic() {
    var slider = document.getElementById("slider");
    var output = document.getElementById("slider_value");
    output.innerHTML = slider.value;

    slider.oninput = function() {
        output.innerHTML = this.value;
    }

    var animationSlider = document.getElementById("animation_slider");
    var animationSliderOutput = document.getElementById("animation_slider_value");
    animationSliderOutput.innerHTML = animationSlider.value;

    animationSlider.oninput = function() {
        animationSliderOutput.innerHTML = this.value;
    }
}

function showHelpMenu() {
    document.getElementById("help").style.display = "block";
}

