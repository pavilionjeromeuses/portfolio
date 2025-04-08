// SnippingToolSnipSketch.js
let isSnipping = false;
let startX, startY, endX, endY;
let canvas, ctx;
let currentTool = 'pen';
let currentColor = '#000000';
let isDrawing = false;
let lastX = 0;
let lastY = 0;

function openSnippingTool() {
    const snippingContent = `
        <div class="snipping-tool">
            <div class="toolbar">
                <button class="btn btn-sm ${currentTool === 'select' ? 'active' : ''}" 
                    onclick="setTool('select')">🖱️ Select</button>
                <button class="btn btn-sm ${currentTool === 'pen' ? 'active' : ''}" 
                    onclick="setTool('pen')">✏️ Pen</button>
                <button class="btn btn-sm ${currentTool === 'eraser' ? 'active' : ''}" 
                    onclick="setTool('eraser')">🧹 Eraser</button>
                <input type="color" value="${currentColor}" onchange="setColor(this.value)">
                <button class="btn btn-sm btn-success" onclick="saveImage()">💾 Save</button>
                <button class="btn btn-sm btn-danger" onclick="closeWindow('snipping-tool')">✖️ Close</button>
            </div>
            <div class="canvas-container">
                <canvas id="snippingCanvas"></canvas>
            </div>
            <div class="snipping-overlay" id="snippingOverlay"></div>
        </div>
    `;

    createWindow('snipping-tool', 'Snipping Tool', snippingContent);
    initCanvas();
    startSnipping();
}

function initCanvas() {
    canvas = document.getElementById('snippingCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
}

function startSnipping() {
    isSnipping = true;
    const overlay = document.getElementById('snippingOverlay');
    overlay.style.display = 'block';

    overlay.addEventListener('mousedown', startSelection);
    document.addEventListener('mousemove', drawSelection);
    document.addEventListener('mouseup', endSelection);
}

function startSelection(e) {
    startX = e.clientX;
    startY = e.clientY;
    const overlay = document.getElementById('snippingOverlay');
    overlay.innerHTML = '<div class="selection-box" id="selectionBox"></div>';
}

function drawSelection(e) {
    if (!isSnipping || !startX) return;
    
    const box = document.getElementById('selectionBox');
    endX = e.clientX;
    endY = e.clientY;
    
    box.style.left = Math.min(startX, endX) + 'px';
    box.style.top = Math.min(startY, endY) + 'px';
    box.style.width = Math.abs(endX - startX) + 'px';
    box.style.height = Math.abs(endY - startY) + 'px';
}

function endSelection(e) {
    if (!isSnipping) return;
    
    isSnipping = false;
    const overlay = document.getElementById('snippingOverlay');
    overlay.style.display = 'none';
    
    const rect = canvas.getBoundingClientRect();
    ctx.drawImage(
        document.documentElement,
        Math.min(startX, endX) - rect.left,
        Math.min(startY, endY) - rect.top,
        Math.abs(endX - startX),
        Math.abs(endY - startY),
        0,
        0,
        canvas.width,
        canvas.height
    );
    
    document.removeEventListener('mousemove', drawSelection);
    document.removeEventListener('mouseup', endSelection);
}

function setTool(tool) {
    currentTool = tool;
    document.querySelectorAll('.toolbar button').forEach(btn => 
        btn.classList.remove('active'));
    event.target.classList.add('active');
}

function setColor(color) {
    currentColor = color;
}

function startDrawing(e) {
    if (currentTool === 'select') return;
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!isDrawing) return;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : currentColor;
    ctx.lineWidth = currentTool === 'eraser' ? 10 : 2;
    ctx.lineCap = 'round';
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
    isDrawing = false;
}

function saveImage() {
    const link = document.createElement('a');
    link.download = 'screenshot.png';
    link.href = canvas.toDataURL();
    link.click();
}

// Add Snipping Tool styles
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .snipping-tool {
            background: #c0c0c0;
            padding: 5px;
        }
        .toolbar {
            display: flex;
            gap: 5px;
            margin-bottom: 5px;
        }
        .canvas-container {
            border: 2px solid #808080;
            background: #ffffff;
        }
        #snippingCanvas {
            cursor: crosshair;
        }
        .snipping-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.3);
            display: none;
            z-index: 9999;
        }
        .selection-box {
            position: absolute;
            border: 2px dashed #ff0000;
            background: rgba(255,255,255,0.1);
        }
        .btn.active {
            background: #000080;
            color: white;
        }
    `;
    document.head.appendChild(style);
});