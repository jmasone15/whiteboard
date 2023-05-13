const canvasEl = document.getElementById("canvas");
const coordinatesEl = document.getElementById("coordinates");
const lineWidthEl = document.getElementById("line-width");
const colorEl = document.getElementById("color");
const clearEl = document.getElementById("clear");
const undoEl = document.getElementById("undo");
const redoEl = document.getElementById("redo");

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
const resetCanvas = (event) => {
    if (drawnLines.length > 0) {
        clearCanvas();

        if (event.target.id === "undo") {
            undoneLines.push(drawnLines.pop());
        } else {
            drawnLines.push(undoneLines.pop())
        }
    
        for (let i = 0; i < drawnLines.length; i++) {
            for (let j = 0; j < drawnLines[i].length; j++) {
                const {x, y, newX, newY} = drawnLines[i][j]
                draw(x, y, newX, newY)
            }
        }
    }
}

canvasEl.addEventListener("mousedown", ({ clientX, clientY, target }) => {
    x = clientX - target.offsetLeft;
    y = clientY - target.offsetTop;
    isDrawing = true;
});
canvasEl.addEventListener("mousemove", ({ clientX, clientY, target }) => {
    if (isDrawing) {
        let newX = clientX - target.offsetLeft;
        let newY = clientY - target.offsetTop;

        draw(x, y, newX, newY);
        currentLine.push({x, y, newX, newY});
        x = newX;
        y = newY;
    }
});
canvasEl.addEventListener("mouseup", ({ clientX, clientY, target }) => {
    if (isDrawing) {
        draw(x, y, clientX - target.offsetLeft, clientY - target.offsetTop)

        x = 0;
        y = 0;
        isDrawing = false;
        drawnLines.push(currentLine);
        currentLine = [];
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
undoEl.addEventListener("click", resetCanvas);
redoEl.addEventListener("click", resetCanvas);


// On load
canvasEl.setAttribute("height", Math.ceil(window.innerHeight * 96 / 100));
canvasEl.setAttribute("width", Math.ceil(window.innerWidth * 95 / 100));
lineWidthEl.value = lineWidth;
colorEl.value = color;