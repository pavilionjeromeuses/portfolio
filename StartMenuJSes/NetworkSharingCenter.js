// NetworkSharingCenter.js
let networkStatus = {
    connected: true,
    connectionType: "Ethernet",
    speed: "100 Mbps",
    signal: 85
};

function openNetworkSharingCenter() {
    const nscContent = `
        <div class="network-center">
            <div class="status-header">
                <h4>🌐 Network and Sharing Center</h4>
                <div class="connection-status ${networkStatus.connected ? 'connected' : 'disconnected'}">
                    ${networkStatus.connected ? 'Connected' : 'Not Connected'}
                </div>
            </div>

            <div class="network-map">
                <div class="network-device router"></div>
                <div class="network-line"></div>
                <div class="network-device pc1"></div>
                <div class="network-device pc2"></div>
                <div class="network-device server"></div>
            </div>

            <div class="connection-details">
                <div class="detail-box">
                    <h5>Active Networks</h5>
                    <div class="network-item">
                        <span class="network-name">Network ${Math.floor(Math.random()*100)}</span>
                        <span class="network-type">${networkStatus.connectionType}</span>
                    </div>
                </div>

                <div class="detail-box">
                    <h5>Connection Properties</h5>
                    <div class="property">
                        <label>Speed:</label>
                        <span class="speed">${networkStatus.speed}</span>
                    </div>
                    <div class="property">
                        <label>Signal:</label>
                        <div class="signal-bar">
                            <div class="signal-level" style="width: ${networkStatus.signal}%"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="sharing-options">
                <h5>Advanced Sharing Settings</h5>
                <div class="sharing-option">
                    <label>
                        <input type="checkbox" ${Math.random() > 0.5 ? 'checked' : ''}>
                        Network discovery
                    </label>
                </div>
                <div class="sharing-option">
                    <label>
                        <input type="checkbox" ${Math.random() > 0.5 ? 'checked' : ''}>
                        File and printer sharing
                    </label>
                </div>
                <button class="btn btn-sm btn-primary" onclick="runDiagnostics()">🛠️ Diagnose Connection</button>
            </div>
        </div>
    `;

    createWindow('network-center', 'Network and Sharing Center', nscContent);
    animateNetworkMap();
}

function animateNetworkMap() {
    const lines = document.querySelectorAll('.network-line');
    lines.forEach(line => {
        setInterval(() => {
            line.style.background = `linear-gradient(to right,
                #00ff00 ${Math.random()*100}%,
                transparent ${Math.random()*100}%
            )`;
        }, 300);
    });
}

function runDiagnostics() {
    const diagnosticsContent = `
        <div class="diagnostics">
            <div class="scanning">🔍 Identifying network problems...</div>
            <div class="progress">
                <div class="progress-bar"></div>
            </div>
            <div class="result" style="display:none;">
                ${Math.random() > 0.5 ? 
                    '✅ No issues detected' : 
                    '⚠️ Problem with wireless adapter configuration'}
            </div>
        </div>
    `;
    
    showNetworkAlert(diagnosticsContent);
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 20;
        document.querySelector('.progress-bar').style.width = `${Math.min(100, progress)}%`;
        if(progress >= 100) {
            clearInterval(interval);
            document.querySelector('.result').style.display = 'block';
        }
    }, 300);
}

function showNetworkAlert(content) {
    const alertBox = document.createElement('div');
    alertBox.className = 'network-alert';
    alertBox.innerHTML = content;
    document.querySelector('.network-center').appendChild(alertBox);
}

// Add Network Center styles
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .network-center {
            background: #c0c0c0;
            padding: 15px;
        }
        .status-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .connection-status {
            padding: 5px 10px;
            border: 2px solid;
            font-weight: bold;
        }
        .connected {
            border-color: #008000;
            color: #008000;
        }
        .disconnected {
            border-color: #800000;
            color: #800000;
        }
        .network-map {
            position: relative;
            height: 200px;
            background: #ffffff;
            border: 2px solid #808080;
            margin-bottom: 15px;
        }
        .network-device {
            position: absolute;
            width: 40px;
            height: 40px;
            background: #000080;
            border: 2px solid #ffffff;
        }
        .router { left: 50%; top: 50%; transform: translate(-50%, -50%); }
        .pc1 { left: 20%; top: 20%; }
        .pc2 { left: 70%; top: 30%; }
        .server { left: 45%; top: 70%; }
        .network-line {
            position: absolute;
            height: 2px;
            background: #00ff00;
            transform-origin: left center;
            animation: pulse 1s infinite;
        }
        .detail-box {
            background: white;
            border: 2px solid #808080;
            padding: 10px;
            margin-bottom: 10px;
        }
        .signal-bar {
            background: #ffffff;
            border: 2px solid #808080;
            height: 10px;
            width: 100px;
        }
        .signal-level {
            background: #000080;
            height: 100%;
            transition: width 0.3s ease;
        }
        .sharing-options {
            background: white;
            border: 2px solid #808080;
            padding: 10px;
        }
        .network-alert {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #c0c0c0;
            border: 2px solid #808080;
            padding: 15px;
            z-index: 1000;
        }
        @keyframes pulse {
            0% { opacity: 0.3; }
            50% { opacity: 1; }
            100% { opacity: 0.3; }
        }
    `;
    document.head.appendChild(style);
});