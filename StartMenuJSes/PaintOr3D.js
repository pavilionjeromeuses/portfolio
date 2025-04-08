// PaintOr3D.js
function openPaintOr3D() {
    const paintContent = `
        <div class="paint-container">
            <div class="toolbar mb-2">
                <div class="d-flex flex-wrap gap-1">
                    <button class="btn btn-sm paint-tool active" data-tool="pencil" onclick="selectTool('pencil')">✏️</button>
                    <button class="btn btn-sm paint-tool" data-tool="eraser" onclick="selectTool('eraser')">🧹</button>
                    <button class="btn btn-sm paint-tool" data-tool="fill" onclick="selectTool('fill')">🎨</button>
                    <input type="color" id="paintColor" value="#000000" class="form-control form-control-sm">
                    <input type="range" id="brushSize" min="1" max="50" value="4" class="form-range">
                    <span id="brushSizeValue">4px</span>
                </div>
            </div>
            
            <canvas id="paintCanvas" width="500" height="400" 
                    style="border: 2px inset; background: white; cursor: crosshair;"></canvas>
            
            <div class="status-bar mt-2 p-1" style="background: #c0c0c0; border: 2px inset;">
                <button class="btn btn-sm btn-secondary" onclick="clearCanvas()">New</button>
                <span id="coordinates">X: 0, Y: 0</span>
            </div>
        </div>
    `;

    createWindow('paint', 'Paint', paintContent);
    initializePaint();
}

function initializePaint() {
    const canvas = document.getElementById('paintCanvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let currentTool = 'pencil';
    
    // Set initial canvas state
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // Brush size control
    document.getElementById('brushSize').addEventListener('input', function(e) {
        document.getElementById('brushSizeValue').textContent = `${e.target.value}px`;
    });

    // Drawing functions
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = getMousePos(canvas, e);
        
        if(currentTool === 'fill') {
            ctx.fillStyle = document.getElementById('paintColor').value;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }

    function draw(e) {
        if (!isDrawing) return;
        
        const [x, y] = getMousePos(canvas, e);
        ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : document.getElementById('paintColor').value;
        ctx.lineWidth = document.getElementById('brushSize').value;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        [lastX, lastY] = [x, y];
        
        // Update coordinates
        document.getElementById('coordinates').textContent = `X: ${x}, Y: ${y}`;
    }

    function stopDrawing() {
        isDrawing = false;
    }

    function getMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        return [
            evt.clientX - rect.left,
            evt.clientY - rect.top
        ];
    }

    window.selectTool = function(tool) {
        currentTool = tool;
        document.querySelectorAll('.paint-tool').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tool="${tool}"]`).classList.add('active');
    };

    window.clearCanvas = function() {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
}

// Add retro styling
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .paint-container {
            font-family: 'Arial', sans-serif;
        }
        .paint-tool {
            background: #c0c0c0 !important;
            border: 2px solid;
            border-color: #ffffff #808080 #808080 #ffffff !important;
            min-width: 40px;
        }
        .paint-tool:active {
            border-color: #808080 #ffffff #ffffff #808080 !important;
        }
        .paint-tool.active {
            background: #000080 !important;
            color: white !important;
        }
        #paintCanvas {
            border-style: inset !important;
        }
        .form-range {
            width: 100px;
            height: 20px;
        }
    `;
    document.head.appendChild(style);
});