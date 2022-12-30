var dimY = 35;
var dimX = 80;
var startXY = [0, 0]
var targetXY = [dimX - 1, dimY - 1]
var isStartEnabled = false;
var isEndEnabled = false;
var isErasorEnabled = false;
var isDrawingEnabled = false;
var grid;


function setGridValues(className, evaluator) {
    for (var y = 0; y < dimY; y++) {
        for (var x = 0; x < dimX; x++) {
            if (evaluator(x, y)){
                grid.children[y].children[x].className = className;
            }
        }
    }
}

function disableButtons() {
    document.getElementById("execute-button").disabled = true;
}

function enableButtons() {
    document.getElementById("execute-button").disabled = false;
}

function isStartOrEnd(x, y) {
    return ["start_cell", "end_cell"].includes(grid.children[y].children[x].className);
}

function isPathOrSearch(x, y) {
    return ["path_cell", "search_cell"].includes(grid.children[y].children[x].className);
}

function clearDrawings() {
    setGridValues("free_cell", isPathOrSearch);
}

function clearGrid() {
    setGridValues("free_cell", (x, y) => !isStartOrEnd(x, y));
}

function resetStartEndCells() {
    var [startX, startY] = startXY;
    var [targetX, targetY] = targetXY;
    grid.children[startY].children[startX].className = "start_cell";
    grid.children[targetY].children[targetX].className = "end_cell";
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

    resetStartEndCells();
}

function createGrid(){
    grid.innerHTML = "";

    for (var y = 0; y < dimY; y++) {
        // Create row
        var newRow = document.createElement("div");
        newRow.className = "row";

        // Create cells and add them to row
        for (var x = 0; x < dimX; x++) {
            var newCell = document.createElement("div");
            newCell.className = "free_cell";
            addEventListeners(newCell);
            newRow.appendChild(newCell);
        }

        grid.appendChild(newRow);
    }
    resetStartEndCells();
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
    grid = document.getElementById("grid");
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
        grid.style.cursor = "url('./assets/blue.png'), auto";

        start.style.border = "4px solid gold";
        end.style.border = "0";
        erasor.style.border = "0";
        drawing.style.border = "0";
    });

    end.addEventListener("mousedown", () => {
        event.preventDefault();
        isStartEnabled = false;
        isErasorEnabled = false;
        isDrawingEnabled = false;
        isEndEnabled = true;
        grid.style.cursor = "url('./assets/red.png'), auto";

        end.style.border = "4px solid gold";
        start.style.border = "0";
        erasor.style.border = "0";
        drawing.style.border = "0";
    });

    erasor.addEventListener("mousedown", () => {
        event.preventDefault();
        isStartEnabled = false;
        isEndEnabled = false;
        isDrawingEnabled = false;
        isErasorEnabled = true;
        grid.style.cursor = "url('./assets/eraser.png'), auto";

        erasor.style.border = "4px solid gold";
        end.style.border = "0";
        start.style.border = "0";
        drawing.style.border = "0";
    });
    drawing.addEventListener("mousedown", () => {
        event.preventDefault();
        isStartEnabled = false;
        isEndEnabled = false;
        isErasorEnabled = false;
        isDrawingEnabled = true;
        grid.style.cursor = "url('./assets/white.png'), auto";

        drawing.style.border = "4px solid gold";
        end.style.border = "0";
        erasor.style.border = "0";
        start.style.border = "0";
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

function execute() {
    var selection = document.getElementById("algo").value;
	switch(selection) {
        case "clear":
		    clearGrid();
            break
        case "random":
		    randomGrid();
		    break;
        case "maze":
            prims()
		    break;
        case "bfs":
            bfs(false);
		    break;
        case "dfs":
            bfs(true);
		    break;
        case "astar":
            astar();
		    break;
	} 
}

