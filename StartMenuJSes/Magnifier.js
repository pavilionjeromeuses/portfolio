// Magnifier.js
let zoomLevel = 2;
let isMagnifying = false;
let showGrid = true;

function openMagnifier() {
    const magnifierContent = `
        <div class="magnifier">
            <div class="controls">
                <button class="btn btn-sm" onclick="toggleMagnify()">🔍 ${isMagnifying ? 'Stop' : 'Start'}</button>
                <input type="range" min="1" max="5" value="${zoomLevel}" 
                    oninput="setZoom(this.value)" class="zoom-slider">
                <span class="zoom-level">${zoomLevel}x</span>
                <button class="btn btn-sm" onclick="toggleGrid()">${showGrid ? '⬜ Grid On' : '⬛ Grid Off'}</button>
            </div>
            <div class="viewport" id="viewport">
                <div class="lens" id="lens"></div>
                <canvas id="zoomCanvas"></canvas>
            </div>
        </div>
    `;

    createWindow('magnifier', 'Screen Magnifier', magnifierContent);
    initMagnifier();
}

function initMagnifier() {
    const lens = document.getElementById('lens');
    const canvas = document.getElementById('zoomCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 200;
    canvas.height = 200;
    
    document.addEventListener('mousemove', (e) => {
        if(!isMagnifying) return;
        
        const x = e.clientX - 100;
        const y = e.clientY - 100;
        
        lens.style.left = `${x}px`;
        lens.style.top = `${y}px`;
        
        // Capture screen content
        ctx.drawImage(document.documentElement, 
            e.clientX - 100/zoomLevel, 
            e.clientY - 100/zoomLevel, 
            200/zoomLevel, 
            200/zoomLevel, 
            0, 0, 200, 200);
        
        if(showGrid) drawGrid(ctx);
    });
}

function toggleMagnify() {
    isMagnifying = !isMagnifying;
    document.querySelector('.controls button').textContent = 
        `🔍 ${isMagnifying ? 'Stop' : 'Start'}`;
    document.getElementById('lens').style.display = 
        isMagnifying ? 'block' : 'none';
}

function setZoom(level) {
    zoomLevel = parseInt(level);
    document.querySelector('.zoom-level').textContent = `${zoomLevel}x`;
}

function toggleGrid() {
    showGrid = !showGrid;
    document.querySelector('.controls button:last-child').textContent = 
        showGrid ? '⬜ Grid On' : '⬛ Grid Off';
}

function drawGrid(ctx) {
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 0.5;
    
    // Draw pixel grid
    for(let x = 0; x < 200; x += zoomLevel) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 200);
        ctx.stroke();
    }
    
    for(let y = 0; y < 200; y += zoomLevel) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(200, y);
        ctx.stroke();
    }
}

// Add Magnifier styles
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .magnifier {
            background: #c0c0c0;
            padding: 10px;
            border: 3px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
        }
        .controls {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
            align-items: center;
        }
        .btn {
            border: 2px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
            background: #c0c0c0;
            min-width: 80px;
        }
        .viewport {
            position: relative;
            height: 200px;
            border: 2px solid #808080;
            background: #ffffff;
            overflow: hidden;
        }
        .lens {
            position: absolute;
            width: 200px;
            height: 200px;
            border: 2px solid #ff0000;
            pointer-events: none;
            display: none;
        }
        #zoomCanvas {
            position: absolute;
            pointer-events: none;
        }
        .zoom-slider {
            width: 100px;
        }
    `;
    document.head.appendChild(style);
});