// SettingsControlPanel.js
function openSettingsControlPanel() {
    const settingsContent = `
        <div class="control-panel">
            <div class="d-flex mb-3">
                <div class="nav flex-column nav-pills me-3" style="width: 150px;">
                    <button class="nav-link active" data-bs-toggle="pill" data-bs-target="#system">⚙️ System</button>
                    <button class="nav-link" data-bs-toggle="pill" data-bs-target="#display">🖥️ Display</button>
                    <button class="nav-link" data-bs-toggle="pill" data-bs-target="#sounds">🔊 Sounds</button>
                    <button class="nav-link" data-bs-toggle="pill" data-bs-target="#themes">🎨 Themes</button>
                </div>
                
                <div class="tab-content flex-grow-1">
                    <!-- System Tab -->
                    <div class="tab-pane fade show active" id="system">
                        <h5>System Properties</h5>
                        <div class="mb-3">
                            <label>Performance:</label>
                            <input type="range" class="form-range" id="performance" min="0" max="100" 
                                   oninput="document.getElementById('perf-value').textContent = this.value + '%'">
                            <span id="perf-value">50%</span>
                        </div>
                        <div class="fake-system-info">
                            <p>🖥️ WebOS 93 Simulation Environment</p>
                            <p>📀 640KB Conventional Memory</p>
                            <p>💾 1.44MB Extended Memory</p>
                        </div>
                    </div>

                    <!-- Display Tab -->
                    <div class="tab-pane fade" id="display">
                        <h5>Display Settings</h5>
                        <div class="mb-3">
                            <label>Resolution:</label>
                            <select class="form-select" id="resolution">
                                <option>640×480 (16 colors)</option>
                                <option>800×600 (256 colors)</option>
                                <option selected>1024×768 (High Color)</option>
                            </select>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="crtEffect">
                            <label class="form-check-label">Enable CRT Screen Effect</label>
                        </div>
                    </div>

                    <!-- Sounds Tab -->
                    <div class="tab-pane fade" id="sounds">
                        <h5>Sound Configuration</h5>
                        <div class="mb-3">
                            <label>Volume:</label>
                            <input type="range" class="form-range" id="volume" min="0" max="100">
                        </div>
                        <div class="mb-3">
                            <label>Sound Scheme:</label>
                            <select class="form-select" id="soundScheme">
                                <option>Windows 95 Default</option>
                                <option>Sci-Fi Blips</option>
                                <option>Retro Beeps</option>
                            </select>
                        </div>
                    </div>

                    <!-- Themes Tab -->
                    <div class="tab-pane fade" id="themes">
                        <h5>Desktop Themes</h5>
                        <div class="color-picker">
                            <label>Window Color:</label>
                            <input type="color" id="windowColor" value="#000080">
                        </div>
                        <div class="color-picker">
                            <label>Background Color:</label>
                            <input type="color" id="bgColor" value="#008080">
                        </div>
                        <div class="mt-3">
                            <label>Wallpaper:</label>
                            <select class="form-select" id="wallpaper">
                                <option>Blue Lagoon</option>
                                <option>Forest Green</option>
                                <option>Retro Stars</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    createWindow('control-panel', 'Settings & Control Panel', settingsContent);
    addSettingsEvents();
}

function addSettingsEvents() {
    // CRT Effect Toggle
    document.getElementById('crtEffect').addEventListener('change', function(e) {
        document.body.style.backgroundImage = e.target.checked ? 
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px 2px, transparent 2px 4px)' : 
            'none';
    });

    // Color Pickers
    document.getElementById('windowColor').addEventListener('input', function(e) {
        document.documentElement.style.setProperty('--window-blue', e.target.value);
    });

    document.getElementById('bgColor').addEventListener('input', function(e) {
        document.body.style.backgroundColor = e.target.value;
    });

    // Wallpaper Selector
    document.getElementById('wallpaper').addEventListener('change', function(e) {
        const wallpapers = {
            'Blue Lagoon': 'linear-gradient(to bottom, #000080, #008080)',
            'Forest Green': 'linear-gradient(to bottom, #003300, #006600)',
            'Retro Stars': 'url("https://i.imgur.com/8QZQZQZ.png")'
        };
        document.body.style.backgroundImage = wallpapers[e.target.value];
    });

    // Easter Egg: Konami Code
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                document.body.style.transform = 'rotate(180deg)';
                setTimeout(() => {
                    document.body.style.transform = 'none';
                }, 2000);
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}

// Add control panel styles
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .control-panel .nav-link {
            text-align: left;
            border: 2px solid #808080;
            margin: 2px 0;
            background: #c0c0c0;
            color: black;
        }
        
        .control-panel .nav-link.active {
            background: #000080 !important;
            color: white !important;
        }
        
        .form-range::-webkit-slider-runnable-track {
            background: #c0c0c0;
            border: 2px solid #808080;
        }
        
        .form-select {
            border: 2px solid #808080;
            background: #c0c0c0;
        }
        
        .fake-system-info {
            background: white;
            padding: 10px;
            border: 2px solid #808080;
        }
        
        .color-picker input[type="color"] {
            width: 50px;
            height: 30px;
            border: 2px solid #808080;
        }
    `;
    document.head.appendChild(style);
});