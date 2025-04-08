// WindowsFirewall.js
let firewallEnabled = true;
let blockedIPs = [];
let connectionAttempts = [];

function openWindowsFirewall() {
    const firewallContent = `
        <div class="windows-firewall">
            <div class="status-header">
                <div class="shield-icon">🛡️</div>
                <h4>Windows Firewall</h4>
                <div class="status-indicator ${firewallEnabled ? 'on' : 'off'}">
                    ${firewallEnabled ? 'Active' : 'Inactive'}
                </div>
            </div>

            <div class="firewall-controls">
                <button class="btn btn-sm ${firewallEnabled ? 'btn-danger' : 'btn-success'}" 
                    onclick="toggleFirewall()">
                    ${firewallEnabled ? 'Turn Off' : 'Turn On'}
                </button>
                <button class="btn btn-sm btn-secondary" onclick="showAdvancedSettings()">
                    Advanced Settings
                </button>
            </div>

            <div class="connection-monitor">
                <h5>Connection Attempts</h5>
                <div class="connection-list" id="connectionList">
                    ${generateConnectionAttempts()}
                </div>
            </div>

            <div class="firewall-rules">
                <h5>Firewall Rules</h5>
                <div class="rules-list">
                    <div class="rule-item">
                        <label>
                            <input type="checkbox" checked>
                            Block incoming ICMP requests
                        </label>
                    </div>
                    <div class="rule-item">
                        <label>
                            <input type="checkbox" ${firewallEnabled ? 'checked' : ''}>
                            Enable stealth mode
                        </label>
                    </div>
                    <div class="rule-item">
                        <label>
                            <input type="checkbox">
                            Auto-block suspicious IPs
                        </label>
                    </div>
                </div>
            </div>
        </div>
    `;

    createWindow('windows-firewall', 'Windows Firewall', firewallContent);
    startAttackSimulation();
}

function generateConnectionAttempts() {
    return connectionAttempts.map(attempt => `
        <div class="connection-attempt ${attempt.blocked ? 'blocked' : 'allowed'}">
            <div class="protocol">${attempt.protocol}</div>
            <div class="ip">${attempt.ip}</div>
            <div class="port">${attempt.port}</div>
            <div class="action">
                ${firewallEnabled ? 
                    `<button class="btn btn-xs ${attempt.blocked ? 'btn-success' : 'btn-danger'}" 
                     onclick="handleConnection('${attempt.id}', ${!attempt.blocked})">
                        ${attempt.blocked ? 'Allow' : 'Block'}
                    </button>` : 
                    '<em>Firewall inactive</em>'}
            </div>
        </div>
    `).join('');
}

function startAttackSimulation() {
    setInterval(() => {
        if(firewallEnabled && Math.random() > 0.5) {
            const attempt = {
                id: Date.now(),
                protocol: ['TCP', 'UDP', 'ICMP'][Math.floor(Math.random()*3)],
                ip: generateRandomIP(),
                port: Math.floor(Math.random()*65535),
                blocked: Math.random() > 0.3
            };
            connectionAttempts.unshift(attempt);
            updateConnectionList();
            
            if(attempt.blocked) {
                showFirewallAlert(`Blocked ${attempt.protocol} connection from ${attempt.ip}`);
            }
        }
    }, 2000);
}

function generateRandomIP() {
    return Array.from({length: 4}, () => Math.floor(Math.random()*255)).join('.');
}

function toggleFirewall() {
    firewallEnabled = !firewallEnabled;
    document.querySelector('.status-indicator').className = `status-indicator ${firewallEnabled ? 'on' : 'off'}`;
    document.querySelector('.status-indicator').textContent = firewallEnabled ? 'Active' : 'Inactive';
    document.querySelector('.firewall-controls button').className = 
        `btn btn-sm ${firewallEnabled ? 'btn-danger' : 'btn-success'}`;
    document.querySelector('.firewall-controls button').textContent = 
        firewallEnabled ? 'Turn Off' : 'Turn On';
    updateConnectionList();
}

function handleConnection(id, block) {
    const attempt = connectionAttempts.find(a => a.id === id);
    if(attempt) {
        attempt.blocked = block;
        blockedIPs = connectionAttempts.filter(a => a.blocked).map(a => a.ip);
        updateConnectionList();
        showFirewallAlert(`${block ? 'Blocked' : 'Allowed'} connection from ${attempt.ip}`);
    }
}

function updateConnectionList() {
    const list = document.getElementById('connectionList');
    if(list) list.innerHTML = generateConnectionAttempts();
}

function showAdvancedSettings() {
    showFirewallAlert(`
        <div class="advanced-settings">
            <h5>Advanced Security Settings</h5>
            <div class="form-group">
                <label>Inbound Rules:</label>
                <div class="progress">
                    <div class="progress-bar" style="width: ${Math.random()*100}%"></div>
                </div>
            </div>
            <div class="form-group">
                <label>Outbound Rules:</label>
                <div class="progress">
                    <div class="progress-bar" style="width: ${Math.random()*100}%"></div>
                </div>
            </div>
        </div>
    `);
}

function showFirewallAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.className = 'firewall-alert';
    alertBox.innerHTML = `
        <div class="alert-header">Windows Firewall</div>
        <div class="alert-content">${message}</div>
        <button class="btn btn-sm btn-primary" onclick="this.parentElement.remove()">OK</button>
    `;
    document.querySelector('.windows-firewall').appendChild(alertBox);
}

// Add Firewall styles
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .windows-firewall {
            background: #c0c0c0;
            padding: 15px;
        }
        .status-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
        }
        .shield-icon {
            font-size: 1.5em;
        }
        .status-indicator {
            padding: 5px 10px;
            border: 2px solid;
            margin-left: auto;
        }
        .status-indicator.on {
            border-color: #008000;
            color: #008000;
        }
        .status-indicator.off {
            border-color: #800000;
            color: #800000;
        }
        .firewall-controls {
            display: flex;
            gap: 5px;
            margin-bottom: 15px;
        }
        .connection-monitor {
            background: white;
            border: 2px solid #808080;
            padding: 10px;
            margin-bottom: 15px;
        }
        .connection-attempt {
            display: grid;
            grid-template-columns: 1fr 2fr 1fr auto;
            gap: 10px;
            padding: 5px;
            border-bottom: 1px solid #808080;
        }
        .blocked {
            background: #ffe6e6;
        }
        .allowed {
            background: #e6ffe6;
        }
        .firewall-rules {
            background: white;
            border: 2px solid #808080;
            padding: 10px;
        }
        .rule-item {
            margin-bottom: 5px;
        }
        .firewall-alert {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #c0c0c0;
            border: 2px solid #808080;
            padding: 15px;
            z-index: 1000;
        }
        .alert-header {
            background: #000080;
            color: white;
            padding: 2px;
            margin: -15px -15px 10px -15px;
        }
        .progress {
            height: 10px;
            background: #ffffff;
            border: 2px solid #808080;
        }
        .progress-bar {
            background: #000080;
        }
    `;
    document.head.appendChild(style);
});