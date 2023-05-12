const canvasEl = document.getElementById("canvas");
const coordinatesEl = document.getElementById("coordinates");

// Whiteboard variables
let x = 0;
let y = 0;
let isDrawing = false;
let context = canvasEl.getContext("2d");
let color = "black";
let lineWidth = 10;

// Drawing Function
const draw = (x1, y1, x2, y2) => {
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
}

// Determine Canvas Size
const determineViewPixels = () => {
    canvasEl.setAttribute("height", Math.ceil(window.innerHeight * 70 / 100));
    canvasEl.setAttribute("width", Math.ceil(window.innerWidth * 70 / 100))
}
determineViewPixels();

// Event Listeners
window.addEventListener("resize", () => {
    determineViewPixels();
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
canvasEl.addEventListener("mousedown", ({ clientX, clientY, target }) => {
    x = clientX - target.offsetLeft;
    y = clientY - target.offsetTop;
    isDrawing = true;
});
canvasEl.addEventListener("mouseup", ({ clientX, clientY, target }) => {
    if (isDrawing) {
        draw(x, y, clientX - target.offsetLeft, clientY - target.offsetTop)

        x = 0;
        y = 0;
        isDrawing = false;
    }
});