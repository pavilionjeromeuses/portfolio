// GodMode.js
function openGodMode() {
    const godContent = `
        <div class="god-mode">
            <div class="deity-controls">
                <div class="row mb-3">
                    <div class="col-6">
                        <div class="cosmic-panel p-2" style="border: 2px inset #808080;">
                            <h5>🌌 Cosmic Controls</h5>
                            <div class="mb-2">
                                <label>☀️ Sun/Moon:</label>
                                <input type="range" class="form-range" id="day-night" min="0" max="100">
                            </div>
                            <div class="mb-2">
                                <label>🌧️ Weather:</label>
                                <select class="form-select" id="weather-select">
                                    <option>☀️ Sunny</option>
                                    <option>⛈️ Stormy</option>
                                    <option>❄️ Snowy</option>
                                    <option>🌈 Rainbow</option>
                                    <option>🍕 Pizza Rain</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="reality-panel p-2" style="border: 2px inset #808080;">
                            <h5>🌀 Reality Settings</h5>
                            <button class="btn btn-warning w-100 mb-2" onclick="toggleGravity()">
                                ⬇️ Toggle Gravity (${gravityEnabled ? 'ON' : 'OFF'})
                            </button>
                            <button class="btn btn-danger w-100" onclick="smite()">
                                ⚡ SMITE CURRENT WINDOW
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="system-stats p-2 mb-3" style="border: 2px inset #808080;">
                    <h5>📊 Divine Metrics</h5>
                    <div>🌍 Earth Rotation: <span id="rotation">${(Math.random() * 1000).toFixed(2)} mph</span></div>
                    <div>🕰️ Time Dilation: <span id="dilation">${(Math.random() * 10).toFixed(2)}x</span></div>
                    <div>🎲 Chaos Level: <span id="chaos">${Math.floor(Math.random() * 100)}%</span></div>
                </div>
                
                <div class="divine-interface p-2" style="border: 2px inset #808080;">
                    <h5>💬 Divine Proclamation</h5>
                    <textarea id="command-input" class="w-100 mb-2" 
                          placeholder="Let there be light..."></textarea>
                    <button class="btn btn-success" onclick="executeCommand()">
                        ✨ Execute Command
                    </button>
                    <div id="command-output" class="mt-2"></div>
                </div>
            </div>
        </div>
    `;

    createWindow('god-mode', 'Divine Control Panel', godContent);
    initializeGodMode();
}

let gravityEnabled = true;
let smiteCount = 0;
let realityMatrix = false;

function initializeGodMode() {
    // Day/Night slider
    const dayNightSlider = document.getElementById('day-night');
    dayNightSlider.addEventListener('input', (e) => {
        document.body.style.backgroundColor = `hsl(${e.target.value * 3.6}, 70%, ${50 - (e.target.value/4)}%)`;
        document.getElementById('clock').textContent = 
            `${Math.floor((e.target.value/100) * 24)}:${Math.floor(Math.random()*60)} GOD-TIME`;
    });

    // Weather selector
    document.getElementById('weather-select').addEventListener('change', (e) => {
        const weather = e.target.value;
        alert(`Weather changed to: ${weather.replace(/️/g, '').trim()}!`);
        if(weather.includes('🍕')) startPizzaRain();
    });

    // Initialize metrics update
    setInterval(() => {
        document.getElementById('rotation').textContent = 
            `${(Math.random() * 1000).toFixed(2)} mph`;
        document.getElementById('dilation').textContent = 
            `${(Math.random() * 10).toFixed(2)}x`;
        document.getElementById('chaos').textContent = 
            `${Math.floor(Math.random() * 100)}%`;
    }, 1500);
}

function toggleGravity() {
    gravityEnabled = !gravityEnabled;
    document.querySelectorAll('.window').forEach(window => {
        if(gravityEnabled) {
            $(window).draggable("enable");
        } else {
            $(window).draggable("disable").css('cursor', 'help');
        }
    });
    document.querySelector('[onclick="toggleGravity()"]').textContent = 
        `⬇️ Toggle Gravity (${gravityEnabled ? 'ON' : 'OFF'})`;
}

function smite() {
    smiteCount++;
    const activeWindow = document.querySelector('.window[style*="display: block"]');
    if(activeWindow) {
        activeWindow.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
        activeWindow.style.boxShadow = '0 0 20px red';
        setTimeout(() => {
            activeWindow.style.transform = '';
            activeWindow.style.boxShadow = '';
        }, 500);
    }
    
    if(smiteCount > 3) {
        document.body.classList.add('smite-animation');
        setTimeout(() => document.body.classList.remove('smite-animation'), 500);
    }
}

function executeCommand() {
    const command = document.getElementById('command-input').value.toLowerCase();
    const output = document.getElementById('command-output');
    const responses = {
        'let there be light': '🌟 Light created! (Electric bill increased by 300%)',
        'create life': '🐣 Basic lifeforms evolved... slowly...',
        'show matrix': `<div class="matrix-rain">${Array(50).fill('0101010101').join('<br>')}</div>`,
        'make pizza': '🍕 Pizza manifested! (Now 50% real!)',
        'reset universe': '♻️ Universe reboot scheduled for 5pm'
    };
    
    output.innerHTML = responses[command] || `💢 Error: ${command} not recognized by divine systems`;
}

function startPizzaRain() {
    const pizzaStorm = setInterval(() => {
        const pizza = document.createElement('div');
        pizza.textContent = '🍕';
        pizza.style.position = 'fixed';
        pizza.style.left = `${Math.random() * 100}%`;
        pizza.style.top = '-50px';
        pizza.style.animation = 'fall 3s linear';
        document.body.appendChild(pizza);
        
        setTimeout(() => pizza.remove(), 3000);
    }, 100);
    
    setTimeout(() => clearInterval(pizzaStorm), 5000);
}

// Add divine styling
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .god-mode {
            background: linear-gradient(45deg, #000080, #800080) !important;
            color: gold !important;
        }
        .smite-animation {
            animation: smiteFlash 0.3s;
        }
        @keyframes smiteFlash {
            0% { filter: brightness(1); }
            50% { filter: brightness(3); }
            100% { filter: brightness(1); }
        }
        .matrix-rain {
            background: black;
            color: lime;
            font-family: monospace;
            padding: 10px;
        }
        @keyframes fall {
            to { transform: translateY(110vh); }
        }
        .deity-controls select, .deity-controls input {
            background: #c0c0c0 !important;
            border: 2px inset #808080 !important;
        }
        .cosmic-panel, .reality-panel {
            background: #000080 !important;
            color: white;
        }
    `;
    document.head.appendChild(style);
});