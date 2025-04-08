// EaseOfAccessCenter.js
function openEaseOfAccessCenter() {
    const easeContent = `
        <div class="ease-center">
            <div class="row">
                <div class="col-md-6">
                    <div class="access-card mb-3 p-2" style="background: #c0c0c0;">
                        <h4>🖌️ Visual Options</h4>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="high-contrast" onchange="toggleHighContrast()">
                                High Contrast Mode (EXTREME EDITION)
                            </label>
                        </div>
                        <div class="form-group">
                            <label>Cursor Size:</label>
                            <input type="range" id="cursor-size" min="1" max="5" value="1" 
                                   oninput="updateCursorSize(this.value)">
                            <span id="cursor-size-label">Small</span>
                        </div>
                        <div class="form-group">
                            <label>Screen Flash Intensity:</label>
                            <div class="btn-group">
                                <button class="btn btn-secondary" onclick="flashScreen('mild')">Mild</button>
                                <button class="btn btn-secondary" onclick="flashScreen('disco')">Disco Party</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <div class="access-card mb-3 p-2" style="background: #c0c0c0;">
                        <h4>🖱️ Mouse Options</h4>
                        <div class="form-group">
                            <label>Mouse Sensitivity:</label>
                            <div class="speedometer" id="mouse-speedometer">
                                <div class="needle"></div>
                            </div>
                            <input type="range" id="mouse-speed" min="1" max="10" value="5" 
                                   oninput="updateMouseSpeed(this.value)">
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="mouse-trail" onchange="toggleMouseTrail()">
                                Rainbow Mouse Trail
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-12">
                    <div class="access-card p-2" style="background: #c0c0c0;">
                        <h4>🎚️ Experimental Features</h4>
                        <div class="btn-group">
                            <button class="btn btn-danger" onclick="activateRocketMode()">
                                🚀 Activate Rocket Mode
                            </button>
                            <button class="btn btn-warning" onclick="toggleDyslexicFont()">
                                𝔇𝔶𝔰𝔩𝔢𝔵𝔦𝔠 𝔉𝔬𝔫𝔱
                            </button>
                            <button class="btn btn-info" onclick="toggleInvisibilityMode()">
                                👻 Invisibility Cloak
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    createWindow('ease-center', 'Ease of Access Center (Turbo Edition)', easeContent);
    initializeAccessibilityFeatures();
}

function initializeAccessibilityFeatures() {
    // Mouse trail effect
    let trail = [];
    const maxTrailLength = 20;
    
    window.toggleMouseTrail = () => {
        const enable = document.getElementById('mouse-trail').checked;
        if (enable) {
            document.addEventListener('mousemove', createMouseTrail);
        } else {
            document.removeEventListener('mousemove', createMouseTrail);
            trail.forEach(point => point.remove());
            trail = [];
        }
    };

    function createMouseTrail(e) {
        const dot = document.createElement('div');
        dot.style.position = 'absolute';
        dot.style.left = `${e.pageX}px`;
        dot.style.top = `${e.pageY}px`;
        dot.style.width = '10px';
        dot.style.height = '10px';
        dot.style.borderRadius = '50%';
        dot.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
        document.body.appendChild(dot);
        
        trail.push(dot);
        if (trail.length > maxTrailLength) {
            const oldDot = trail.shift();
            oldDot.remove();
        }
    }

    // High contrast mode
    window.toggleHighContrast = () => {
        const body = document.querySelector('body');
        if (document.getElementById('high-contrast').checked) {
            body.style.backgroundColor = '#000000';
            body.style.color = '#00FF00';
            body.style.fontFamily = 'Comic Sans MS';
        } else {
            body.style.backgroundColor = '#008080';
            body.style.color = 'white';
            body.style.fontFamily = 'Arial';
        }
    };

    // Cursor size
    window.updateCursorSize = (size) => {
        const labels = ['Small', 'Medium', 'Large', 'Huge', 'GIGANTIC'];
        document.getElementById('cursor-size-label').textContent = labels[size - 1];
        document.body.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${8 * size}" height="${8 * size}" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="black"/></svg>') ${4 * size} ${4 * size}, auto`;
    };

    // Mouse speed
    window.updateMouseSpeed = (speed) => {
        const needle = document.querySelector('.needle');
        const rotation = (speed * 18) - 90; // Convert to degrees
        needle.style.transform = `rotate(${rotation}deg)`;
    };

    // Screen flash
    window.flashScreen = (mode) => {
        const body = document.querySelector('body');
        body.style.transition = 'background 0.1s';
        
        if (mode === 'disco') {
            let count = 0;
            const discoInterval = setInterval(() => {
                body.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
                if (count++ >= 10) {
                    clearInterval(discoInterval);
                    body.style.backgroundColor = '#008080';
                }
            }, 100);
        } else {
            body.style.backgroundColor = '#FFFFFF';
            setTimeout(() => {
                body.style.backgroundColor = '#008080';
            }, 100);
        }
    };

    // Experimental features
    window.activateRocketMode = () => {
        document.querySelectorAll('*').forEach(element => {
            element.style.transform = 'rotate(180deg)';
            element.style.transition = 'transform 2s';
        });
        setTimeout(() => {
            document.querySelectorAll('*').forEach(element => {
                element.style.transform = '';
            });
        }, 2000);
    };

    window.toggleDyslexicFont = () => {
        document.body.style.fontFamily = document.body.style.fontFamily === 'Comic Sans MS' ? 
            'Arial' : 'Comic Sans MS';
    };

    window.toggleInvisibilityMode = () => {
        document.body.style.opacity = document.body.style.opacity === '0' ? '1' : '0';
    };
}

// Add custom styling
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .access-card {
            border: 3px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
            margin: 5px;
        }
        .speedometer {
            width: 100px;
            height: 50px;
            background: #ffffff;
            border-radius: 0 0 50px 50px;
            position: relative;
            overflow: hidden;
            margin: 10px auto;
        }
        .needle {
            width: 2px;
            height: 40px;
            background: red;
            position: absolute;
            bottom: 5px;
            left: 50%;
            transform-origin: bottom center;
            transition: transform 0.3s ease;
        }
        input[type="range"] {
            -webkit-appearance: none;
            width: 100%;
            height: 10px;
            background: #ffffff;
            border: 2px solid #808080;
        }
        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 15px;
            height: 15px;
            background: #000080;
            border: 2px solid #808080;
        }
    `;
    document.head.appendChild(style);
});