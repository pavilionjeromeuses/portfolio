// WiFiAnalyzer.js
let networks = [];
let selectedNetwork = null;

function openWiFiAnalyzer() {
    const wifiContent = `
        <div class="wifi-analyzer">
            <div class="toolbar">
                <button class="btn btn-sm btn-secondary" onclick="scanNetworks()">🔍 Scan</button>
                <div class="signal-legend">
                    <div class="legend-item"><div class="bar excellent"></div> Excellent</div>
                    <div class="legend-item"><div class="bar good"></div> Good</div>
                    <div class="legend-item"><div class="bar weak"></div> Weak</div>
                </div>
            </div>

            <div class="main-content">
                <div class="network-list">
                    ${networks.map(network => `
                        <div class="network-item ${selectedNetwork?.ssid === network.ssid ? 'selected' : ''}" 
                             onclick="selectNetwork('${network.ssid}')">
                            <div class="signal-strength">
                                <div class="bar" style="width: ${network.strength}%"></div>
                                <div class="channel">Ch ${network.channel}</div>
                            </div>
                            <div class="network-info">
                                <div class="ssid">📶 ${network.ssid}</div>
                                <div class="details">
                                    ${network.security} • ${network.speed} Mbps
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="visualization">
                    <div class="channel-graph">
                        <canvas id="channelChart"></canvas>
                    </div>
                    <div class="network-details">
                        ${selectedNetwork ? `
                            <h5>${selectedNetwork.ssid}</h5>
                            <div class="detail-item"><label>Security:</label> ${selectedNetwork.security}</div>
                            <div class="detail-item"><label>Channel:</label> ${selectedNetwork.channel}</div>
                            <div class="detail-item"><label>Signal:</label> ${selectedNetwork.strength}%</div>
                        ` : 'Select a network for details'}
                    </div>
                </div>
            </div>
        </div>
    `;

    createWindow('wifi-analyzer', 'Wi-Fi Analyzer', wifiContent);
    generateNetworks();
    updateChannelChart();
    startSignalFluctuation();
}

function generateNetworks() {
    const ssids = [
        'HomeNetwork', 'FBI Surveillance Van', 'Linksys', 
        'NETGEAR', 'Starbucks WiFi', 'NeighborHouse', 
        'VirusInfected', 'Free Public WiFi'
    ];
    
    networks = ssids.map(ssid => ({
        ssid: ssid,
        strength: Math.floor(Math.random() * 40 + 60),
        channel: Math.floor(Math.random() * 11 + 1),
        security: Math.random() > 0.3 ? 'WPA2' : 'Open',
        speed: Math.random() > 0.5 ? '54' : '150'
    })).sort((a, b) => b.strength - a.strength);
}

function scanNetworks() {
    generateNetworks();
    document.querySelector('.network-list').innerHTML = networks.map(network => `
        <div class="network-item ${selectedNetwork?.ssid === network.ssid ? 'selected' : ''}" 
             onclick="selectNetwork('${network.ssid}')">
            <div class="signal-strength">
                <div class="bar" style="width: ${network.strength}%"></div>
                <div class="channel">Ch ${network.channel}</div>
            </div>
            <div class="network-info">
                <div class="ssid">📶 ${network.ssid}</div>
                <div class="details">
                    ${network.security} • ${network.speed} Mbps
                </div>
            </div>
        </div>
    `).join('');
    updateChannelChart();
}

function selectNetwork(ssid) {
    selectedNetwork = networks.find(n => n.ssid === ssid);
    document.querySelectorAll('.network-item').forEach(item => 
        item.classList.remove('selected'));
    event.target.closest('.network-item').classList.add('selected');
    document.querySelector('.network-details').innerHTML = `
        <h5>${selectedNetwork.ssid}</h5>
        <div class="detail-item"><label>Security:</label> ${selectedNetwork.security}</div>
        <div class="detail-item"><label>Channel:</label> ${selectedNetwork.channel}</div>
        <div class="detail-item"><label>Signal:</label> ${selectedNetwork.strength}%</div>
    `;
}

function updateChannelChart() {
    const canvas = document.getElementById('channelChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 150;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw channel grid
    ctx.strokeStyle = '#c0c0c0';
    ctx.setLineDash([2, 2]);
    for(let i = 1; i <= 11; i++) {
        const x = (i * canvas.width) / 12;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // Draw network signals
    networks.forEach(network => {
        const x = ((network.channel - 1) * canvas.width) / 11;
        const height = (network.strength / 100) * canvas.height;
        ctx.fillStyle = network.security === 'Open' ? '#ff0000' : '#000080';
        ctx.fillRect(x, canvas.height - height, 20, height);
    });
}

function startSignalFluctuation() {
    setInterval(() => {
        networks.forEach(network => {
            network.strength = Math.min(100, Math.max(0, 
                network.strength + Math.random() * 4 - 2
            ));
        });
        document.querySelectorAll('.signal-strength .bar').forEach((bar, i) => {
            bar.style.width = `${networks[i].strength}%`;
        });
        updateChannelChart();
    }, 1000);
}

// Add WiFi Analyzer styles
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .wifi-analyzer {
            background: #c0c0c0;
            padding: 15px;
        }
        .toolbar {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
        }
        .signal-legend {
            display: flex;
            gap: 15px;
        }
        .legend-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .bar {
            height: 10px;
            background: linear-gradient(to right, #008000, #ffff00, #ff0000);
        }
        .excellent { width: 80px; }
        .good { width: 50px; }
        .weak { width: 20px; }
        .main-content {
            display: flex;
            gap: 15px;
        }
        .network-list {
            width: 300px;
            background: white;
            border: 2px solid #808080;
            padding: 5px;
        }
        .network-item {
            display: flex;
            gap: 10px;
            padding: 8px;
            border-bottom: 1px solid #808080;
            cursor: pointer;
        }
        .network-item.selected {
            background: #000080;
            color: white;
        }
        .signal-strength {
            width: 80px;
            position: relative;
        }
        .signal-strength .bar {
            height: 20px;
            background: linear-gradient(to right, #008000, #ffff00, #ff0000);
        }
        .channel {
            position: absolute;
            right: 2px;
            bottom: 2px;
            font-size: 0.8em;
            background: rgba(0,0,0,0.5);
            color: white;
            padding: 0 2px;
        }
        .visualization {
            flex-grow: 1;
            background: white;
            border: 2px solid #808080;
            padding: 10px;
        }
        .channel-graph {
            height: 150px;
            margin-bottom: 15px;
        }
        .network-details {
            background: #c0c0c0;
            padding: 10px;
            border: 2px solid #808080;
        }
        .detail-item {
            margin: 5px 0;
        }
        .detail-item label {
            display: inline-block;
            width: 80px;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
});