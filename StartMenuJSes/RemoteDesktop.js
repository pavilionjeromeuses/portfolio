// RemoteDesktop.js
let isConnected = false;
let remoteScreenInterval;

function openRemoteDesktop() {
    const rdContent = `
        <div class="remote-desktop">
            <div class="connection-bar">
                <input type="text" id="rdAddress" placeholder="192.168.1.1" class="form-control">
                <button class="btn btn-sm ${isConnected ? 'btn-danger' : 'btn-success'}" 
                    onclick="${isConnected ? 'disconnect()' : 'connect()'}">
                    ${isConnected ? 'Disconnect' : 'Connect'}
                </button>
            </div>
            
            <div class="remote-screen" id="remoteScreen">
                <div class="connection-status">
                    <div class="crteffect"></div>
                    <div class="loading">Initializing remote connection...</div>
                    <div class="progress">
                        <div class="progress-bar"></div>
                    </div>
                </div>
                
                <!-- Remote Desktop Content (hidden until connected) -->
                <div class="rd-content" style="display: none;">
                    <div class="rd-taskbar">
                        <div class="start-button">▶️ Start</div>
                        <div class="clock">${new Date().toLocaleTimeString()}</div>
                    </div>
                    <div class="rd-icons">
                        <div class="rd-icon" ondblclick="showRemoteAlert('System32 not found')">
                            <img src="IMGs/StartMenuFileExplorer/remoteDesktopRemoteComputerPNG.png">
                            <div>Remote Computer</div>
                        </div>
                        <div class="rd-icon" ondblclick="showRemoteAlert('No network drives found')">
                            <img src="IMGs/StartMenuFileExplorer/remoteDesktopNetworkPNG.png">
                            <div>Network</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    createWindow('remote-desktop', 'Remote Desktop Connection', rdContent);
    if(!isConnected) startConnectionEffect();
}

function startConnectionEffect() {
    const progress = document.querySelector('.progress-bar');
    let width = 0;
    const effectInterval = setInterval(() => {
        width += Math.random() * 3;
        progress.style.width = `${Math.min(100, width)}%`;
        if(width >= 100) {
            clearInterval(effectInterval);
            simulateSuccessfulConnection();
        }
    }, 100);
}

function simulateSuccessfulConnection() {
    document.querySelector('.connection-status').style.display = 'none';
    document.querySelector('.rd-content').style.display = 'block';
    isConnected = true;
    
    // Update clock
    remoteScreenInterval = setInterval(() => {
        document.querySelector('.clock').textContent = new Date().toLocaleTimeString();
    }, 1000);
    
    // Add screen effects
    const crt = document.querySelector('.crteffect');
    let scanPos = 0;
    setInterval(() => {
        scanPos = (scanPos + 1) % 100;
        crt.style.background = `linear-gradient(
            to bottom,
            transparent ${scanPos}%,
            rgba(0, 255, 0, 0.1) ${scanPos}%,
            rgba(0, 255, 0, 0.1) ${scanPos + 2}%,
            transparent ${scanPos + 2}%
        )`;
    }, 50);
}

function connect() {
    const address = document.getElementById('rdAddress').value;
    if(!address.match(/\d+\.\d+\.\d+\.\d+/)) {
        showRemoteAlert('Invalid IP address format!');
        return;
    }
    
    openRemoteDesktop();
    document.querySelector('.remote-desktop .btn').disabled = true;
    setTimeout(() => {
        document.querySelector('.remote-desktop .btn').disabled = false;
    }, 2000);
}

function disconnect() {
    clearInterval(remoteScreenInterval);
    isConnected = false;
    closeWindow('remote-desktop');
}

function showRemoteAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.className = 'rd-alert';
    alertBox.innerHTML = `
        <div class="rd-alert-header">Remote Desktop</div>
        <div class="rd-alert-content">${message}</div>
        <button class="btn btn-sm btn-primary" onclick="this.parentElement.remove()">OK</button>
    `;
    document.querySelector('.remote-desktop').appendChild(alertBox);
}

// Add Remote Desktop styles
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .remote-desktop {
            background: #000;
            padding: 5px;
        }
        .connection-bar {
            display: flex;
            gap: 5px;
            margin-bottom: 5px;
        }
        .form-control {
            border: 2px solid #808080;
            background: #c0c0c0;
            flex-grow: 1;
        }
        .remote-screen {
            border: 2px solid #808080;
            position: relative;
            overflow: hidden;
        }
        .connection-status {
            position: absolute;
            width: 100%;
            height: 100%;
            background: #000080;
            color: #00ff00;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: 'Courier New', monospace;
        }
        .crteffect {
            position: absolute;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }
        .loading {
            z-index: 1;
        }
        .progress {
            width: 200px;
            height: 20px;
            background: #000;
            border: 2px solid #00ff00;
            margin-top: 10px;
        }
        .progress-bar {
            background: #00ff00;
            height: 100%;
            transition: width 0.3s ease;
        }
        .rd-content {
            background: #008080;
            height: 400px;
            position: relative;
        }
        .rd-taskbar {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: #c0c0c0;
            display: flex;
            justify-content: space-between;
            padding: 2px 5px;
            border-top: 2px solid #fff;
        }
        .rd-icons {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            padding: 20px;
        }
        .rd-icon {
            color: #fff;
            text-align: center;
            cursor: pointer;
        }
        .rd-icon img {
            width: 48px;
            height: 48px;
        }
        .rd-alert {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #c0c0c0;
            border: 2px solid #808080;
            padding: 10px;
            z-index: 1000;
        }
        .rd-alert-header {
            background: #000080;
            color: white;
            padding: 2px;
            margin: -10px -10px 10px -10px;
        }
        @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }
    `;
    document.head.appendChild(style);
});