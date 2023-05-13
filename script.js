const canvasEl = document.getElementById("canvas");
const coordinatesEl = document.getElementById("coordinates");
const lineWidthEl = document.getElementById("line-width");
const colorEl = document.getElementById("color");
const clearEl = document.getElementById("clear");
const undoEl = document.getElementById("undo");
const redoEl = document.getElementById("redo");
const modeEl = document.getElementById("mode");
const backgroundEl = document.getElementById("background");

// Whiteboard variables
let x = 0;
let y = 0;
let isDrawing = false;
let context = canvasEl.getContext("2d", { alpha: true, desynchronized: false, colorSpace: "srgb", willReadFrequently: true });
let color = "#000000";
let lineWidth = 1;
let currentLine = [];
let drawnLines = [];
let undoneLines = [];
let mouseMode = "Draw";
let background = "#ffffff"

// Drawing Function
const draw = (x1, y1, x2, y2) => {
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
}
const clearCanvas = () => {
    context.clearRect(0, 0, canvasEl.width, canvasEl.height)
}
const resetCanvas = () => {
    updateCanvasBackground();
    for (let i = 0; i < drawnLines.length; i++) {
        for (let j = 0; j < drawnLines[i].length; j++) {
            const {x, y, newX, newY} = drawnLines[i][j]
            draw(x, y, newX, newY)
        }
    }
}
const updateCanvasBackground = () => {
    context.globalCompositeOperation = "destination-under";
    context.fillStyle = background;
    context.fillRect(0, 0, canvasEl.width, canvasEl.height)
}

canvasEl.addEventListener("mousedown", ({ clientX, clientY, target }) => {
    if (mouseMode === "Draw") {
        x = clientX - target.offsetLeft;
        y = clientY - target.offsetTop;
        isDrawing = true;
    }
});
canvasEl.addEventListener("mousemove", ({ clientX, clientY, target }) => {
    if (mouseMode === "Draw") {
        if (isDrawing) {
            let newX = clientX - target.offsetLeft;
            let newY = clientY - target.offsetTop;
    
            draw(x, y, newX, newY);
            currentLine.push({x, y, newX, newY});
            x = newX;
            y = newY;
        }
    }
});
canvasEl.addEventListener("mouseup", ({ clientX, clientY, target }) => {
    if (mouseMode === "Draw") {
        if (isDrawing) {
            draw(x, y, clientX - target.offsetLeft, clientY - target.offsetTop)
    
            x = 0;
            y = 0;
            isDrawing = false;
            drawnLines.push(currentLine);
            currentLine = [];
        }
    }
});
lineWidthEl.addEventListener("change", () => {
    lineWidth = lineWidthEl.value;
});
colorEl.addEventListener("change", () => {
    color = colorEl.value;
    console.log(colorEl.value)
});
clearEl.addEventListener("click", clearCanvas);
undoEl.addEventListener("click", () => {
    if (drawnLines.length > 0) {
        clearCanvas();

        undoneLines.push(drawnLines.pop());
    
        resetCanvas();
    }
});
redoEl.addEventListener("click", () => {
    if (undoneLines.length > 0) {
        clearCanvas();

        drawnLines.push(undoneLines.pop());
    
        resetCanvas();
    }
});
modeEl.addEventListener("click", () => {
    mouseMode = mouseMode === "Draw" ? "Mouse" : "Draw";
    modeEl.textContent = mouseMode;

    if (mouseMode === "Draw") {
        canvasEl.classList.add("crosshair-cursor");
    } else {
        canvasEl.classList.remove("crosshair-cursor");
    }
});


// On load
canvasEl.setAttribute("height", Math.ceil(window.innerHeight * 96 / 100));
canvasEl.setAttribute("width", Math.ceil(window.innerWidth * 95 / 100));
canvasEl.classList.add(mouseMode === "Draw" ? "crosshair-cursor" : "");
lineWidthEl.value = lineWidth;
colorEl.value = color;
backgroundEl.value = background;
updateCanvasBackground();


// TODO
// Background
// Eraser
// Text
// Shapes
// UI