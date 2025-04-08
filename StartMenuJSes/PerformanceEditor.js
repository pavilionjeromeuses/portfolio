// PerformanceEditor.js
function openPerformanceEditor() {
    const performanceContent = `
        <div class="performance-editor">
            <div class="d-flex justify-content-between mb-3">
                <div class="hardware-monitor p-2" style="background: white; border: 2px solid #808080;">
                    <h5>⚙️ System Alchemy Engine</h5>
                    <div id="speedometer" class="mb-3"></div>
                    <canvas id="perf-chart" width="300" height="150"></canvas>
                </div>
                
                <div class="tuning-controls p-2" style="background: #c0c0c0; border: 2px solid #808080;">
                    <h5>🎚️ Performance Levers</h5>
                    ${createSliderControl("CPU Cores", "cpu", 4, 128)}
                    ${createSliderControl("RAM Allocation", "ram", 4, 64)}
                    ${createSliderControl("GPU Power", "gpu", 1, 16)}
                    ${createSliderControl("Network Boost", "network", 1, 10)}
                    <button class="btn btn-warning mt-2" onclick="activateTurbo()" 
                            style="border: 2px solid #808080;">
                        🚀 TURBO BOOST
                    </button>
                </div>
            </div>

            <div class="system-processes p-2" style="background: white; border: 2px solid #808080;">
                <h5>🔍 Process Optimizer</h5>
                <div class="process-bars">
                    ${createProcessBar("System Fantasies", 45)}
                    ${createProcessBar("Pixel Alchemy", 78)}
                    ${createProcessBar("Data Sorcery", 32)}
                    ${createProcessBar("Cache Mirage", 63)}
                </div>
            </div>

            <div class="mt-2 p-2" style="background: #c0c0c0;">
                <strong>💡 Wizard Tip:</strong> ${getPerformanceTip()}
            </div>
        </div>
    `;

    createWindow('performance-editor', 'Reality Tuner 95', performanceContent);
    initializePerformanceMetrics();
}

function createSliderControl(label, id, min, max) {
    return `
        <div class="mb-3">
            <label>${label}</label>
            <input type="range" class="form-range" id="${id}" 
                   min="${min}" max="${max}" value="${Math.floor((max-min)/2)+min}"
                   oninput="updateMetric('${id}', this.value)">
            <div class="metric-display" id="${id}-value"></div>
        </div>
    `;
}

function createProcessBar(name, usage) {
    return `
        <div class="mb-2">
            <div class="d-flex justify-content-between">
                <span>${name}</span>
                <span>${usage}%</span>
            </div>
            <div class="progress" style="height: 20px; border: 2px solid #808080;">
                <div class="progress-bar" role="progressbar" 
                     style="width: ${usage}%; background: #000080;"></div>
            </div>
        </div>
    `;
}

function getPerformanceTip() {
    const tips = [
        "More CPU cores = more digital unicorns!",
        "RAM is just computer imagination space",
        "Set network boost to 11 for time travel",
        "Turbo boost may cause awesome explosions",
        "Right-click the chart to enable dark magic"
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

function initializePerformanceMetrics() {
    // Initialize metric displays
    ['cpu', 'ram', 'gpu', 'network'].forEach(id => {
        const slider = document.getElementById(id);
        updateMetric(id, slider.value);
    });

    // Create speedometer
    const speedometer = document.getElementById('speedometer');
    const canvas = document.createElement('canvas');
    canvas.width = 150;
    canvas.height = 150;
    speedometer.appendChild(canvas);
    drawSpeedometer(canvas);

    // Initialize fake chart
    const chartCanvas = document.getElementById('perf-chart');
    const ctx = chartCanvas.getContext('2d');
    let animationFrame;
    
    function drawChart() {
        ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
        
        // Draw fake performance data
        ctx.beginPath();
        ctx.moveTo(0, 100);
        for(let x = 0; x < chartCanvas.width; x++) {
            ctx.lineTo(x, 100 - Math.random() * 80);
        }
        ctx.strokeStyle = '#000080';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        animationFrame = requestAnimationFrame(drawChart);
    }
    drawChart();

    // Cleanup on window close
    const perfWindow = document.getElementById('performance-editor');
    perfWindow.addEventListener('close', () => {
        cancelAnimationFrame(animationFrame);
    });
}

function drawSpeedometer(canvas) {
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width/2;
    const centerY = canvas.height/2;
    let currentSpeed = 0;

    function drawNeedle(speed) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw gauge
        ctx.beginPath();
        ctx.arc(centerX, centerY, 60, 0.75 * Math.PI, 2.25 * Math.PI);
        ctx.strokeStyle = '#000080';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        // Draw needle
        const angle = 0.75 * Math.PI + (speed/100) * 1.5 * Math.PI;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + Math.cos(angle) * 50,
            centerY + Math.sin(angle) * 50
        );
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    // Update speed periodically
    setInterval(() => {
        currentSpeed = Math.min(100, 
            parseInt(document.getElementById('cpu').value / 128 * 40) +
            parseInt(document.getElementById('ram').value / 64 * 30) +
            parseInt(document.getElementById('gpu').value / 16 * 20) +
            parseInt(document.getElementById('network').value / 10 * 10)
        );
        drawNeedle(currentSpeed);
    }, 1000);
}

function updateMetric(id, value) {
    const display = document.getElementById(`${id}-value`);
    const units = {
        cpu: "Cores",
        ram: "GB",
        gpu: "TFLOPS",
        network: "Gbps"
    };
    display.innerHTML = `${value} ${units[id]} <small>(${Math.random()*100|0}% Utilization)</small>`;
}

function activateTurbo() {
    ['cpu', 'ram', 'gpu', 'network'].forEach(id => {
        const slider = document.getElementById(id);
        slider.value = slider.max;
        updateMetric(id, slider.value);
    });
    
    const btn = document.querySelector('[onclick="activateTurbo()"]');
    btn.classList.add('turbo-active');
    setTimeout(() => btn.classList.remove('turbo-active'), 500);
}

// Add retro styling
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .performance-editor input[type="range"] {
            -webkit-appearance: none;
            background: #c0c0c0;
            border: 2px solid #808080;
            height: 16px;
        }
        .performance-editor input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 16px;
            height: 16px;
            background: #000080;
            border: 2px solid #ffffff;
        }
        .turbo-active {
            animation: turbo-pulse 0.5s;
        }
        @keyframes turbo-pulse {
            50% { transform: scale(1.1); background: #ff0000; }
        }
        .metric-display {
            background: #000080;
            color: white;
            padding: 2px 5px;
            border: 2px solid #808080;
        }
    `;
    document.head.appendChild(style);
});