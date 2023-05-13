const canvasEl = document.getElementById("canvas");
const coordinatesEl = document.getElementById("coordinates");
const lineWidthEl = document.getElementById("line-width");

// Whiteboard variables
let x = 0;
let y = 0;
let isDrawing = false;
let context = canvasEl.getContext("2d", { alpha: true, desynchronized: false, colorSpace: "srgb", willReadFrequently: true });
let color = "black";
let lineWidth = 1;

// Drawing Function
const draw = (x1, y1, x2, y2) => {
    console.log(lineWidth);

    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
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
    }
});
lineWidthEl.addEventListener("change", () => {
    lineWidth = lineWidthEl.value;
});

// On load
canvasEl.setAttribute("height", Math.ceil(window.innerHeight * 96 / 100));
canvasEl.setAttribute("width", Math.ceil(window.innerWidth * 95 / 100));
lineWidthEl.value = lineWidth
