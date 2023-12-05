const canvas = document.getElementById('rainbowCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;

// Stack to store canvas states for undo and redo
let undoStack = [];
let redoStack = [];

function drawRainbow() {
    // ... (same as before)
}

function startDrawing(e) {
    drawing = true;
    draw(e);
}

function stopDrawing() {
    drawing = false;
    ctx.beginPath(); // Start a new path after releasing the mouse button

    // Save the current state to the undo stack
    undoStack.push(canvas.toDataURL());
    redoStack = []; // Clear redo stack when a new action is performed
}

function draw(e) {
    if (!drawing) return;

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000'; // Fixed color as there is no color picker

    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRainbow(); // Redraw the rainbow after clearing

    // Save the current state to the undo stack
    undoStack.push(canvas.toDataURL());
    redoStack = []; // Clear redo stack when a new action is performed
}

function undo() {
    if (undoStack.length > 1) {
        redoStack.push(undoStack.pop());
        const img = new Image();
        img.src = undoStack[undoStack.length - 1];
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
}

function redo() {
    if (redoStack.length > 0) {
        undoStack.push(redoStack.pop());
        const img = new Image();
        img.src = undoStack[undoStack.length - 1];
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
}

function saveDrawing() {
    const dataUrl = canvas.toDataURL();
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'drawing.jpg';
    a.click();
}

function loadDrawing() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                undoStack = [canvas.toDataURL()];
                redoStack = [];
            };
        };
        reader.readAsDataURL(file);
    });
    input.click();
}

document.getElementById('clearButton').addEventListener('click', clearCanvas);
document.getElementById('undoButton').addEventListener('click', undo);
document.getElementById('redoButton').addEventListener('click', redo);
document.getElementById('saveButton').addEventListener('click', saveDrawing);
document.getElementById('loadButton').addEventListener('click', loadDrawing);

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);

drawRainbow();