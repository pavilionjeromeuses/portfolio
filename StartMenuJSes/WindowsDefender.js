// WindowsDefender.js
let isScanning = false;
let threats = [];
let realTimeShield = true;

function openWindowsDefender() {
    const defenderContent = `
        <div class="windows-defender">
            <div class="status-bar mb-3 p-2 ${realTimeShield ? 'secure' : 'warning'}">
                ${realTimeShield ? '🛡️ Real-time protection: ON' : '⚠️ Real-time protection: OFF'}
            </div>
            
            <div class="scan-section mb-3">
                <button class="btn btn-secondary" onclick="startScan()" ${isScanning ? 'disabled' : ''}>
                    🔍 Quick Scan
                </button>
                <div class="progress mt-2" style="display: none;">
                    <div class="progress-bar" id="scanProgress" role="progressbar" style="width: 0%"></div>
                </div>
            </div>

            <div class="threat-list">
                <h5>Recent Items</h5>
                <div id="threatsFound" class="mb-3">
                    ${threats.map(t => threatItem(t)).join('')}
                </div>
                
                <div class="quarantine-section">
                    <h5>Quarantined Items</h5>
                    <div id="quarantineList"></div>
                </div>
            </div>
        </div>
    `;

    createWindow('windows-defender', 'Microsoft Defender', defenderContent);
    updateShieldStatus();
}

function threatItem(threat) {
    return `
        <div class="threat-item ${threat.quarantined ? 'quarantined' : ''}">
            <div class="threat-icon">${threat.severity > 5 ? '⚠️' : 'ℹ️'}</div>
            <div class="threat-info">
                <div>${threat.name}</div>
                <small>${threat.type} • ${threat.date}</small>
            </div>
            ${!threat.quarantined ? 
                `<button class="btn btn-sm btn-danger" onclick="quarantineThreat('${threat.id}')">Quarantine</button>` : 
                '<span class="quarantined-label">Quarantined</span>'}
        </div>
    `;
}

function generateFakeThreats() {
    const threatTypes = ['Trojan', 'Adware', 'PUA', 'RiskTool', 'Exploit'];
    return {
        id: Date.now().toString(),
        name: `Win32/${threatTypes[Math.floor(Math.random()*threatTypes.length)]}.Fake!MTB`,
        type: 'Malware',
        date: new Date().toLocaleDateString(),
        severity: Math.floor(Math.random()*10)+1,
        quarantined: false
    };
}

function startScan() {
    if(isScanning) return;
    
    isScanning = true;
    const progressBar = document.querySelector('.progress');
    const progressElement = document.getElementById('scanProgress');
    progressBar.style.display = 'block';
    
    let progress = 0;
    const scanInterval = setInterval(() => {
        progress += Math.random()*10;
        progressElement.style.width = `${Math.min(100, progress)}%`;
        
        if(progress >= 100) {
            clearInterval(scanInterval);
            isScanning = false;
            progressBar.style.display = 'none';
            
            // Generate fake threats
            const newThreats = Array(Math.floor(Math.random()*3)).fill()
                .map(() => generateFakeThreats());
            threats = [...newThreats, ...threats];
            document.getElementById('threatsFound').innerHTML = 
                threats.map(t => threatItem(t)).join('');
        }
    }, 200);
}

function quarantineThreat(id) {
    const threat = threats.find(t => t.id === id);
    threat.quarantined = true;
    
    // Animate quarantine
    const item = event.target.closest('.threat-item');
    item.style.transform = 'translateX(100%)';
    item.style.opacity = '0';
    
    setTimeout(() => {
        document.getElementById('threatsFound').innerHTML = 
            threats.map(t => threatItem(t)).join('');
        updateQuarantineList();
    }, 500);
}

function updateQuarantineList() {
    const quarantined = threats.filter(t => t.quarantined);
    document.getElementById('quarantineList').innerHTML = quarantined.length > 0 ?
        quarantined.map(t => `
            <div class="quarantined-item">
                <div>${t.name}</div>
                <small>Quarantined: ${t.date}</small>
            </div>
        `).join('') :
        '<div class="text-muted">No quarantined items</div>';
}

function updateShieldStatus() {
    setInterval(() => {
        realTimeShield = Math.random() > 0.1; // 90% chance of being ON
        document.querySelector('.status-bar').className = 
            `status-bar mb-3 p-2 ${realTimeShield ? 'secure' : 'warning'}`;
        document.querySelector('.status-bar').innerHTML = 
            `${realTimeShield ? '🛡️ Real-time protection: ON' : '⚠️ Real-time protection: OFF'}`;
    }, 5000);
}

// Add Defender styles
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .windows-defender {
            background: #c0c0c0;
            padding: 15px;
        }
        .status-bar {
            border: 2px solid #808080;
            background: #ffffff;
            font-weight: bold;
        }
        .secure {
            color: #000080;
            border-color: #000080;
        }
        .warning {
            color: #800000;
            border-color: #800000;
        }
        .threat-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px;
            background: white;
            border: 2px solid #808080;
            margin-bottom: 5px;
            transition: all 0.3s ease;
        }
        .threat-icon {
            font-size: 1.5em;
        }
        .quarantined {
            background: #ffe6e6;
            border-color: #800000;
        }
        .quarantined-label {
            color: #800000;
            margin-left: auto;
        }
        .progress {
            height: 20px;
            border: 2px solid #808080;
            background: #ffffff;
        }
        .progress-bar {
            background: #000080;
            transition: width 0.3s ease;
        }
        .quarantined-item {
            padding: 5px;
            background: white;
            border: 2px solid #808080;
            margin-bottom: 3px;
        }
    `;
    document.head.appendChild(style);
});