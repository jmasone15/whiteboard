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
let color = "#000000";
let lineWidth = 5;
let currentLine = [];
let drawnLines = [];
let undoneLines = [];
let mouseMode = "Draw";
let background = "#ffffff";
let context = canvasEl.getContext("2d", {
  alpha: true,
  desynchronized: false,
  colorSpace: "srgb",
  willReadFrequently: true
});

// Drawing Function
const draw = (x1, y1, x2, y2, lineColor) => {
  context.beginPath();
  if (mouseMode === "Erase") {
    context.strokeStyle = background;
  } else {
    context.strokeStyle = lineColor;
  }

  context.lineWidth = mouseMode === "Erase" ? lineWidth * 5 : lineWidth;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
};
const clearCanvas = clear => {
  context.clearRect(0, 0, canvasEl.width, canvasEl.height);

  if (clear) {
    drawnLines = [];
  }

  updateCanvasBackground();
};
const resetCanvas = () => {
  updateCanvasBackground();
  for (let i = 0; i < drawnLines.length; i++) {
    for (let j = 0; j < drawnLines[i].currentLine.length; j++) {
      const { x, y, newX, newY } = drawnLines[i].currentLine[j];
      draw(x, y, newX, newY, drawnLines[i].lineColor);
    }
  }
};
const updateCanvasBackground = () => {
  context.globalCompositeOperation = "destination-under";
  context.fillStyle = background;
  context.fillRect(0, 0, canvasEl.width, canvasEl.height);
};
const resetModeButtons = () => {
  [mouseBtnEl, drawBtnEl, eraseBtnEl].forEach(element => {
    element.classList.remove("active-button");
  });
};
const setCanvasProperties = () => {
  canvasEl.setAttribute("height", Math.ceil((window.innerHeight * 96) / 100));
  canvasEl.setAttribute(
    "width",
    Math.ceil((window.innerWidth * 95) / 100) + 200
  );
};

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

      draw(x, y, newX, newY, color);
      currentLine.push({ x, y, newX, newY });
      x = newX;
      y = newY;
    }
  }
});
canvasEl.addEventListener("mouseup", ({ clientX, clientY, target }) => {
  if (mouseMode === "Draw" || mouseMode === "Erase") {
    if (isDrawing) {
      draw(x, y, clientX - target.offsetLeft, clientY - target.offsetTop, color);

      x = 0;
      y = 0;
      isDrawing = false;
      drawnLines.push({ currentLine, lineColor: color });
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
clearEl.addEventListener("click", () => {
  clearCanvas(true);
});
undoEl.addEventListener("click", () => {
  if (drawnLines.length > 0) {
    clearCanvas(false);

    undoneLines.push(drawnLines.pop());

    resetCanvas();
  }
});
redoEl.addEventListener("click", () => {
  if (undoneLines.length > 0) {
    clearCanvas(false);

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
  resetCanvas();
});
increaseEl.addEventListener("click", () => {
  lineWidth++;
});
decreaseEl.addEventListener("click", () => {
  if (lineWidth > 1) {
    lineWidth--;
  }
});
window.addEventListener("resize", () => {
  setCanvasProperties();
});

// On load
setCanvasProperties();
canvasEl.classList.add("pencil-cursor");
backgroundEl.value = background;
colorInputEl.value = color;
updateCanvasBackground();

// TODO
// Rework pencil size increase/decrease
// Mobile drawing
// Mobile UI
// Save Current Drawing