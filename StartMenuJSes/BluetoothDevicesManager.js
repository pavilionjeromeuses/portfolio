// BluetoothDevicesManager.js
let bluetoothEnabled = true;
let devices = [];
let scanningInterval;

function openBluetoothManager() {
    const bluetoothContent = `
        <div class="bluetooth-manager">
            <div class="status-header">
                <div class="bluetooth-icon">🔵</div>
                <h4>Bluetooth & Devices</h4>
                <div class="status-indicator ${bluetoothEnabled ? 'on' : 'off'}">
                    ${bluetoothEnabled ? 'Enabled' : 'Disabled'}
                </div>
            </div>

            <div class="controls">
                <button class="btn btn-sm ${bluetoothEnabled ? 'btn-danger' : 'btn-success'}" 
                    onclick="toggleBluetooth()">
                    ${bluetoothEnabled ? 'Disable' : 'Enable'}
                </button>
                <button class="btn btn-sm btn-secondary" onclick="startScanning()">
                    🔍 Scan for Devices
                </button>
            </div>

            <div class="device-list">
                <div class="device-list-header">
                    <div>Device Name</div>
                    <div>Type</div>
                    <div>Battery</div>
                    <div>Status</div>
                </div>
                <div class="device-items" id="deviceItems">
                    ${devices.map(device => renderDevice(device)).join('')}
                </div>
            </div>

            <div class="device-details">
                <h5>Device Details</h5>
                <div id="deviceDetails">
                    ${devices.length > 0 ? getDeviceDetails(devices[0]) : 'Select a device'}
                </div>
            </div>
        </div>
    `;

    createWindow('bluetooth-manager', 'Bluetooth & Devices', bluetoothContent);
    if(bluetoothEnabled) populateDevices();
}

function renderDevice(device) {
    return `
        <div class="device-item ${device.connected ? 'connected' : ''}" 
             onclick="selectDevice('${device.id}')">
            <div class="device-name">
                ${getDeviceIcon(device.type)} ${device.name}
            </div>
            <div class="device-type">${device.type}</div>
            <div class="device-battery">
                <div class="battery-level" style="width: ${device.battery}%"></div>
                ${device.battery}%
            </div>
            <div class="device-status">
                ${device.connected ? 'Connected' : 'Paired'}
            </div>
        </div>
    `;
}

function getDeviceIcon(type) {
    const icons = {
        headphones: '🎧',
        phone: '📱',
        speaker: '🔊',
        keyboard: '⌨️',
        mouse: '🖱️'
    };
    return icons[type.toLowerCase()] || '💻';
}

function populateDevices() {
    const deviceTypes = ['Headphones', 'Phone', 'Speaker', 'Keyboard', 'Mouse'];
    devices = Array.from({length: 5}, (_, i) => ({
        id: Date.now() + i,
        name: `${deviceTypes[i]} ${Math.floor(1000 + Math.random() * 9000)}`,
        type: deviceTypes[i],
        battery: Math.floor(Math.random() * 100),
        connected: Math.random() > 0.5,
        paired: true,
        lastConnected: `${Math.floor(Math.random() * 24)}h ago`
    }));
    document.getElementById('deviceItems').innerHTML = devices.map(device => renderDevice(device)).join('');
}

function toggleBluetooth() {
    bluetoothEnabled = !bluetoothEnabled;
    document.querySelector('.status-indicator').className = `status-indicator ${bluetoothEnabled ? 'on' : 'off'}`;
    document.querySelector('.status-indicator').textContent = bluetoothEnabled ? 'Enabled' : 'Disabled';
    document.querySelector('.controls button').textContent = bluetoothEnabled ? 'Disable' : 'Enable';
    document.querySelector('.controls button').className = `btn btn-sm ${bluetoothEnabled ? 'btn-danger' : 'btn-success'}`;
    
    if(bluetoothEnabled) {
        populateDevices();
    } else {
        devices = [];
        document.getElementById('deviceItems').innerHTML = '';
    }
}

function startScanning() {
    if(!bluetoothEnabled) return;
    
    const scanButton = document.querySelector('.controls button:last-child');
    scanButton.innerHTML = '🔄 Scanning...';
    scanButton.disabled = true;

    // Add scanning animation
    const deviceList = document.getElementById('deviceItems');
    deviceList.style.animation = 'scanning 1s infinite';

    scanningInterval = setInterval(() => {
        devices.push({
            id: Date.now(),
            name: `Device ${Math.floor(1000 + Math.random() * 9000)}`,
            type: ['Headphones', 'Speaker', 'Phone'][Math.floor(Math.random()*3)],
            battery: Math.floor(Math.random() * 100),
            connected: false,
            paired: false,
            lastConnected: 'Never'
        });
        document.getElementById('deviceItems').innerHTML = devices.map(device => renderDevice(device)).join('');
    }, 2000);

    setTimeout(() => {
        clearInterval(scanningInterval);
        scanButton.innerHTML = '🔍 Scan for Devices';
        scanButton.disabled = false;
        deviceList.style.animation = '';
    }, 10000);
}

function selectDevice(deviceId) {
    const device = devices.find(d => d.id === deviceId);
    document.getElementById('deviceDetails').innerHTML = getDeviceDetails(device);
}

function getDeviceDetails(device) {
    return `
        <div class="detail-item"><label>Name:</label> ${device.name}</div>
        <div class="detail-item"><label>Type:</label> ${device.type}</div>
        <div class="detail-item"><label>Battery:</label> ${device.battery}%</div>
        <div class="detail-item"><label>Status:</label> ${device.connected ? 'Connected' : device.paired ? 'Paired' : 'Available'}</div>
        <div class="device-actions">
            ${device.connected ? 
                '<button class="btn btn-sm btn-danger" onclick="disconnectDevice()">Disconnect</button>' : 
                `<button class="btn btn-sm btn-success" onclick="connectDevice()">
                    ${device.paired ? 'Connect' : 'Pair'}
                </button>`}
            ${device.paired ? '<button class="btn btn-sm btn-secondary" onclick="unpairDevice()">Unpair</button>' : ''}
        </div>
    `;
}

function connectDevice() {
    alert('Connecting device... (Simulated)');
    // Add actual connection logic here
}

function disconnectDevice() {
    alert('Disconnecting device... (Simulated)');
}

function unpairDevice() {
    if(confirm('Are you sure you want to unpair this device?')) {
        alert('Device unpaired! (Simulated)');
    }
}

// Add Bluetooth Manager styles
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .bluetooth-manager {
            background: #c0c0c0;
            padding: 15px;
        }
        .status-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
        }
        .bluetooth-icon {
            font-size: 1.5em;
        }
        .status-indicator {
            margin-left: auto;
            padding: 5px 10px;
            border: 2px solid;
        }
        .status-indicator.on {
            border-color: #000080;
            color: #000080;
        }
        .status-indicator.off {
            border-color: #800000;
            color: #800000;
        }
        .controls {
            display: flex;
            gap: 5px;
            margin-bottom: 15px;
        }
        .device-list {
            background: white;
            border: 2px solid #808080;
            margin-bottom: 15px;
        }
        .device-list-header {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr;
            padding: 5px;
            background: #000080;
            color: white;
            font-weight: bold;
        }
        .device-item {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr;
            padding: 8px;
            border-bottom: 1px solid #808080;
            cursor: pointer;
        }
        .device-item:hover {
            background: #000080;
            color: white;
        }
        .device-item.connected {
            background: #e6ffe6;
        }
        .battery-level {
            background: #000080;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            opacity: 0.2;
        }
        .device-battery {
            position: relative;
            padding: 0 5px;
        }
        .device-details {
            background: white;
            border: 2px solid #808080;
            padding: 10px;
        }
        .detail-item {
            margin: 5px 0;
        }
        .detail-item label {
            display: inline-block;
            width: 80px;
            font-weight: bold;
        }
        @keyframes scanning {
            0% { background-position: 0 0; }
            100% { background-position: 0 20px; }
        }
    `;
    document.head.appendChild(style);
});