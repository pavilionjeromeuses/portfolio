// MobileHotspot.js
let hotspotActive = false;
let connectedDevices = [];
let dataUsage = 0;
let hotspotInterval;

function openMobileHotspot() {
    const hotspotContent = `
        <div class="mobile-hotspot">
            <div class="hotspot-header">
                <div class="status-light ${hotspotActive ? 'active' : ''}"></div>
                <h4>📱 Mobile Hotspot</h4>
                <button class="btn btn-sm ${hotspotActive ? 'btn-danger' : 'btn-success'}" 
                    onclick="toggleHotspot()">
                    ${hotspotActive ? 'Turn Off' : 'Turn On'}
                </button>
            </div>

            <div class="hotspot-config">
                <div class="config-item">
                    <label>Network name:</label>
                    <input type="text" value="WebOS93_Hotspot" id="ssidInput">
                </div>
                <div class="config-item">
                    <label>Password:</label>
                    <div class="password-field">
                        <input type="password" value="password123" id="passwordInput">
                        <button class="btn btn-xs" onclick="generatePassword()">🎲</button>
                    </div>
                </div>
                <button class="btn btn-sm btn-secondary" onclick="shareHotspot()">📤 Share</button>
            </div>

            <div class="connected-devices">
                <h5>Connected Devices (${connectedDevices.length})</h5>
                <div class="device-list" id="deviceList">
                    ${connectedDevices.map(device => deviceItem(device)).join('')}
                </div>
            </div>

            <div class="data-usage">
                <h5>Data Usage</h5>
                <div class="usage-bar">
                    <div class="usage-progress" style="width: ${(dataUsage/500)*100}%"></div>
                </div>
                <div class="usage-text">
                    ${dataUsage}MB used of 500MB
                </div>
            </div>
        </div>
    `;

    createWindow('mobile-hotspot', 'Mobile Hotspot', hotspotContent);
}

function deviceItem(device) {
    return `
        <div class="device-item">
            <div class="device-icon">📱</div>
            <div class="device-info">
                <div>${device.name}</div>
                <small>IP: ${device.ip} • ${device.usage}MB</small>
            </div>
            <div class="device-time">${device.time}</div>
        </div>
    `;
}

function toggleHotspot() {
    hotspotActive = !hotspotActive;
    const btn = document.querySelector('.hotspot-header button');
    btn.className = `btn btn-sm ${hotspotActive ? 'btn-danger' : 'btn-success'}`;
    btn.textContent = hotspotActive ? 'Turn Off' : 'Turn On';
    document.querySelector('.status-light').classList.toggle('active', hotspotActive);
    
    if(hotspotActive) {
        startHotspotActivity();
    } else {
        stopHotspotActivity();
    }
}

function startHotspotActivity() {
    // Simulate device connections
    hotspotInterval = setInterval(() => {
        // Add new devices
        if(Math.random() > 0.8 && connectedDevices.length < 5) {
            connectedDevices.push({
                name: ['iPhone', 'Android', 'Laptop', 'Tablet'][Math.floor(Math.random()*4)],
                ip: `192.168.1.${Math.floor(Math.random()*50)+1}`,
                usage: Math.floor(Math.random()*50),
                time: `${Math.floor(Math.random()*24)}h ago`
            });
        }
        
        // Remove random devices
        if(Math.random() > 0.9 && connectedDevices.length > 0) {
            connectedDevices.splice(Math.floor(Math.random()*connectedDevices.length), 1);
        }
        
        // Update data usage
        dataUsage = Math.min(500, dataUsage + Math.random());
        updateHotspotUI();
    }, 2000);
}

function stopHotspotActivity() {
    clearInterval(hotspotInterval);
    connectedDevices = [];
    dataUsage = 0;
    updateHotspotUI();
}

function generatePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const newPass = Array.from({length: 8}, () => chars[Math.floor(Math.random()*chars.length)]).join('');
    document.getElementById('passwordInput').value = newPass;
}

function shareHotspot() {
    const ssid = document.getElementById('ssidInput').value;
    const password = document.getElementById('passwordInput').value;
    alert(`Share these hotspot details:\nSSID: ${ssid}\nPassword: ${password}`);
    navigator.clipboard.writeText(`WiFi Name: ${ssid}\nPassword: ${password}`);
}

function updateHotspotUI() {
    const deviceList = document.getElementById('deviceList');
    if(deviceList) {
        deviceList.innerHTML = connectedDevices.map(device => deviceItem(device)).join('');
    }
    
    const usageProgress = document.querySelector('.usage-progress');
    if(usageProgress) {
        usageProgress.style.width = `${(dataUsage/500)*100}%`;
    }
    
    const usageText = document.querySelector('.usage-text');
    if(usageText) {
        usageText.textContent = `${dataUsage.toFixed(1)}MB used of 500MB`;
    }
}

// Add Mobile Hotspot styles
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .mobile-hotspot {
            background: #c0c0c0;
            padding: 15px;
        }
        .hotspot-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
        }
        .status-light {
            width: 15px;
            height: 15px;
            border: 2px solid #808080;
            background: #800000;
        }
        .status-light.active {
            background: #008000;
        }
        .hotspot-config {
            background: white;
            border: 2px solid #808080;
            padding: 10px;
            margin-bottom: 15px;
        }
        .config-item {
            margin: 10px 0;
        }
        .config-item label {
            display: inline-block;
            width: 100px;
        }
        .password-field {
            display: flex;
            gap: 5px;
        }
        .connected-devices {
            background: white;
            border: 2px solid #808080;
            padding: 10px;
            margin-bottom: 15px;
        }
        .device-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px;
            border-bottom: 1px solid #808080;
        }
        .data-usage {
            background: white;
            border: 2px solid #808080;
            padding: 10px;
        }
        .usage-bar {
            height: 20px;
            background: #ffffff;
            border: 2px solid #808080;
            margin: 10px 0;
        }
        .usage-progress {
            height: 100%;
            background: #000080;
            transition: width 0.3s ease;
        }
        input {
            border: 2px solid #808080;
            padding: 2px 5px;
            background: #ffffff;
        }
    `;
    document.head.appendChild(style);
});