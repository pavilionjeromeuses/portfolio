// DirectXDiagnosticTool.js
function openDirectXDiagnosticTool() {
    const dxdiagContent = `
        <div class="dxdiag-tool">
            <div class="title-bar bg-primary text-white p-2 mb-2">
                DirectX Diagnostic Tool
            </div>
            
            <div class="tabs mb-3">
                <button class="tab-btn active" onclick="switchTab('system')">System</button>
                <button class="tab-btn" onclick="switchTab('display')">Display</button>
                <button class="tab-btn" onclick="switchTab('sound')">Sound</button>
                <button class="tab-btn" onclick="switchTab('input')">Input</button>
            </div>
            
            <div id="system-tab" class="tab-content">
                <div class="system-info">
                    ${generateSystemInfo()}
                </div>
                <button class="btn btn-secondary mt-2" onclick="runDiagnostics()">
                    🛠️ Run Diagnostics
                </button>
                <div id="diagnostic-results" class="mt-2"></div>
            </div>
            
            <div id="display-tab" class="tab-content" style="display:none;">
                ${generateDisplayInfo()}
            </div>
            
            <div id="sound-tab" class="tab-content" style="display:none;">
                ${generateSoundInfo()}
            </div>
            
            <div id="input-tab" class="tab-content" style="display:none;">
                ${generateInputInfo()}
            </div>
            
            <div class="mt-3 p-2" style="background: #c0c0c0;">
                <button class="btn btn-sm btn-secondary" onclick="saveDxDiag()">
                    💾 Save All Information
                </button>
            </div>
        </div>
    `;

    createWindow('dxdiag-tool', 'DirectX Diagnostic Tool', dxdiagContent);
    initializeDxDiagStyles();
}

function generateSystemInfo() {
    return `
        <table class="table table-sm">
            <tr><th>Operating System</th><td>Windows 93 Ultimate Edition</td></tr>
            <tr><th>Processor</th><td>Pentium MMX @ 200MHz</td></tr>
            <tr><th>Memory</th><td>64MB RAM</td></tr>
            <tr><th>DirectX Version</th><td>DirectX 9.0c (Pretend Edition)</td></tr>
            <tr><th>System BIOS</th><td>Award Software v4.51PG</td></tr>
        </table>
    `;
}

function generateDisplayInfo() {
    return `
        <div class="display-card">
            <table class="table table-sm">
                <tr><th>Card Name</th><td>NVIDIA Voodoo FX 25600</td></tr>
                <tr><th>Manufacturer</th><td>3Dfx Interactive</td></tr>
                <tr><th>Chip Type</th><td>Voodoo3 4000</td></tr>
                <tr><th>Display Memory</th><td>16.0 MB</td></tr>
                <tr><th>Current Mode</th><td>1024x768 (16 bit)</td></tr>
            </table>
            <div class="test-box p-2">
                <button class="btn btn-sm btn-secondary" onclick="testDirect3D()">
                    🎮 Test Direct3D
                </button>
                <div id="d3d-test" class="mt-2"></div>
            </div>
        </div>
    `;
}

function generateSoundInfo() {
    return `
        <table class="table table-sm">
            <tr><th>Device Name</th><td>Sound Blaster 16</td></tr>
            <tr><th>Driver Version</th><td>4.13.01.1999</td></tr>
            <tr><th>Status</th><td>No problems found (probably)</td></tr>
        </table>
        <button class="btn btn-sm btn-secondary mt-2" onclick="testSound()">
            🔉 Test Sound
        </button>
    `;
}

function generateInputInfo() {
    return `
        <table class="table table-sm">
            <tr><th>Mouse</th><td>Optical Illusion Mouse (COM1)</td></tr>
            <tr><th>Keyboard</th><td>Nostalgic 101-Key Keyboard</td></tr>
            <tr><th>Joystick</th><td>Gravis GamePad (Not Detected)</td></tr>
        </table>
    `;
}

function runDiagnostics() {
    const results = document.getElementById('diagnostic-results');
    results.innerHTML = `
        <div class="progress mb-2">
            <div class="progress-bar" role="progressbar" style="width: 0%"></div>
        </div>
    `;
    
    const progressBar = results.querySelector('.progress-bar');
    let width = 0;
    const interval = setInterval(() => {
        width += Math.random() * 15;
        progressBar.style.width = `${width}%`;
        if(width >= 100) {
            clearInterval(interval);
            showDiagnosticResults();
        }
    }, 200);
}

function showDiagnosticResults() {
    const results = document.getElementById('diagnostic-results');
    const problems = [
        "No problems found (that we're aware of)",
        "Detected imaginary driver issues",
        "Your 3D accelerator is feeling nostalgic",
        "Sound card requests a nap",
        "Mouse driver needs more coffee"
    ];
    
    results.innerHTML = `
        <div class="alert alert-success">
            ${problems[Math.floor(Math.random() * problems.length)]}
        </div>
    `;
}

function testDirect3D() {
    const testArea = document.getElementById('d3d-test');
    testArea.innerHTML = `
        <div style="background: #000; color: #0f0; padding: 10px;">
            ${Array(20).fill('3D ACCELERATION ACTIVE').join('<br>')}
        </div>
        <div class="mt-1">✔️ Direct3D test complete (pretend)</div>
    `;
}

function testSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    oscillator.connect(audioContext.destination);
    oscillator.start();
    setTimeout(() => oscillator.stop(), 300);
}

function saveDxDiag() {
    alert("Pretend file saved as: DxDiag-[Nostalgia].txt");
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).style.display = 'block';
    event.target.classList.add('active');
}

function initializeDxDiagStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .dxdiag-tool {
            font-family: 'Arial', sans-serif;
        }
        .tab-btn {
            background: #c0c0c0;
            border: 2px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
            padding: 2px 15px;
            margin-right: 2px;
        }
        .tab-btn.active {
            border-color: #808080 #ffffff #ffffff #808080;
            background: #000080;
            color: white;
        }
        .progress {
            height: 20px;
            border: 2px solid #808080;
            background: #c0c0c0;
        }
        .progress-bar {
            background: #000080;
            transition: width 0.3s ease;
        }
        .alert-success {
            background: #008000;
            color: white;
            border: 2px solid #004000;
        }
    `;
    document.head.appendChild(style);
}