const canvasEl = document.getElementById("canvas");
const coordinatesEl = document.getElementById("coordinates");
const colorEl = document.getElementById("color-icon");
const colorInputEl = document.getElementById("color");
const clearEl = document.getElementById("clear");
const undoEl = document.getElementById("undo");
const redoEl = document.getElementById("redo");
const mouseBtnEl = document.getElementById("mouse");
const drawBtnEl = document.getElementById("draw");
const eraseBtnEl = document.getElementById("eraser");
const backgroundEl = document.getElementById("background-icon");
const backgroundInputEl = document.getElementById("background");
const increaseEl = document.getElementById("increase");
const decreaseEl = document.getElementById("decrease");

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

    if (mouseMode === "Erase") {
        context.strokeStyle = background;
    } else {
        context.strokeStyle = color;
    }

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
const resetModeButtons = () => {
    [mouseBtnEl, drawBtnEl, eraseBtnEl].forEach(element => {
        element.classList.remove("active-button");
    });
}

canvasEl.addEventListener("mousedown", ({ clientX, clientY, target }) => {
    if (mouseMode === "Draw" || mouseMode === "Erase") {
        x = clientX - target.offsetLeft;
        y = clientY - target.offsetTop;
        isDrawing = true;
    }
});
canvasEl.addEventListener("mousemove", ({ clientX, clientY, target }) => {
    if (mouseMode === "Draw" || mouseMode === "Erase") {
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
    if (mouseMode === "Draw" || mouseMode === "Erase") {
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
colorEl.addEventListener("click", () => {
    colorInputEl.click();
});
colorInputEl.addEventListener("change", () => {
    color = colorInputEl.value;
    colorEl.style.color = colorInputEl.value;
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
mouseBtnEl.addEventListener("click", () => {
    mouseMode = "Mouse";
    resetModeButtons();
    mouseBtnEl.classList.add("active-button");
    canvasEl.setAttribute("class", "whiteboard");
});
drawBtnEl.addEventListener("click", () => {
    mouseMode = "Draw";
    resetModeButtons();
    drawBtnEl.classList.add("active-button");
    canvasEl.setAttribute("class", "whiteboard pencil-cursor");
});
eraseBtnEl.addEventListener("click", () => {
    mouseMode = "Erase";
    resetModeButtons();
    eraseBtnEl.classList.add("active-button");
    canvasEl.setAttribute("class", "whiteboard erase-cursor");
});
backgroundEl.addEventListener("click", () => {
    backgroundInputEl.click();
});
backgroundInputEl.addEventListener("change", () => {
    background = backgroundInputEl.value;
    updateCanvasBackground();
});
increaseEl.addEventListener("click", () => {
    lineWidth++
});
decreaseEl.addEventListener("click", () => {
    if (lineWidth > 1) {
        lineWidth--
    }
});


// On load
canvasEl.setAttribute("height", Math.ceil(window.innerHeight * 96 / 100));
canvasEl.setAttribute("width", Math.ceil(window.innerWidth * 95 / 100) + 200);
canvasEl.classList.add("pencil-cursor");
backgroundEl.value = background;
colorInputEl.value = color;
updateCanvasBackground();