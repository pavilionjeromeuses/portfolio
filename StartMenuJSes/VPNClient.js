// VPNClient.js
function openVPNClient() {
    const vpnContent = `
        <div class="vpn-client">
            <div class="status-bar mb-3 p-2" id="vpn-status" style="background: #000080; color: white;">
                🔒 Not Connected
            </div>
            
            <div class="server-list mb-3">
                <h5>Available Locations:</h5>
                <div id="server-container">
                    ${generateServerList()}
                </div>
            </div>
            
            <div class="d-flex justify-content-between align-items-center mb-3">
                <button class="btn btn-secondary" id="connect-button" onclick="toggleVPNConnection()">
                    🚀 Connect
                </button>
                <div class="connection-stats">
                    <span id="current-protocol">Protocol: FakeVPN</span>
                    <span id="current-ping">Ping: --ms</span>
                </div>
            </div>
            
            <div class="traffic-graph p-2" style="background: white; border: 2px solid #808080;">
                <h6>📈 Fake Traffic Graph</h6>
                <canvas id="vpn-traffic" width="300" height="100"></canvas>
            </div>
            
            <div class="vpn-tips mt-3 p-2" style="background: #c0c0c0;">
                <strong>💡 Pro Tip:</strong> ${getRandomVPNTip()}
            </div>
        </div>
    `;

    createWindow('vpn-client', 'FakeVPN Client', vpnContent);
    initializeVPNEvents();
}

function generateServerList() {
    const servers = [
        { country: "🇺🇸 Freedom Island", ping: Math.floor(Math.random() * 150) + 50 },
        { country: "🇨🇭 Chocolate Mountains", ping: Math.floor(Math.random() * 100) + 30 },
        { country: "🇯🇵 Anime Kingdom", ping: Math.floor(Math.random() * 200) + 80 },
        { country: "🇧🇷 Carnival Beach", ping: Math.floor(Math.random() * 250) + 100 },
        { country: "🦄 Rainbow Network", ping: Math.floor(Math.random() * 300) + 150 }
    ];

    return servers.map(server => `
        <div class="server-item p-2 mb-1" data-ping="${server.ping}" 
             onclick="selectServer(this)" 
             style="cursor: pointer; background: #c0c0c0; border: 2px solid #808080;">
            <span class="server-flag">${server.country}</span>
            <span class="server-ping">${server.ping}ms</span>
        </div>
    `).join('');
}

function getRandomVPNTip() {
    const tips = [
        "Connecting to Rainbow Network might make your data 20% more colorful!",
        "Our free plan includes complimentary digital cookies 🍪",
        "VPN stands for Very Powerful Narwhal",
        "For maximum security, rotate between servers every 5 minutes",
        "Premium users get access to the secret 🥓 Bacon Protocol"
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

function initializeVPNEvents() {
    let selectedServer = null;
    let isConnected = false;
    let trafficInterval = null;
    
    window.selectServer = (element) => {
        document.querySelectorAll('.server-item').forEach(server => {
            server.style.background = '#c0c0c0';
        });
        element.style.background = '#000080';
        element.style.color = 'white';
        selectedServer = element;
        document.getElementById('current-ping').textContent = `Ping: ${element.dataset.ping}ms`;
    };

    window.toggleVPNConnection = () => {
        const statusElement = document.getElementById('vpn-status');
        const button = document.getElementById('connect-button');
        
        if (!isConnected) {
            if (!selectedServer) {
                alert("Please select a server first!");
                return;
            }
            
            isConnected = true;
            button.innerHTML = "⏳ Connecting...";
            button.disabled = true;
            
            setTimeout(() => {
                statusElement.innerHTML = `🔓 Connected to ${selectedServer.querySelector('.server-flag').textContent}`;
                statusElement.style.background = '#008000';
                button.innerHTML = "🛑 Disconnect";
                button.disabled = false;
                startTrafficAnimation();
            }, 2000);
        } else {
            isConnected = false;
            statusElement.innerHTML = "🔒 Not Connected";
            statusElement.style.background = '#000080';
            button.innerHTML = "🚀 Connect";
            stopTrafficAnimation();
        }
    };

    function startTrafficAnimation() {
        const canvas = document.getElementById('vpn-traffic');
        const ctx = canvas.getContext('2d');
        let dataPoints = Array(30).fill(50);
        
        trafficInterval = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Generate fake network traffic
            dataPoints = [...dataPoints.slice(1), Math.random() * 100];
            
            ctx.beginPath();
            ctx.moveTo(0, dataPoints[0]);
            dataPoints.forEach((point, index) => {
                ctx.lineTo((index * 10), point);
            });
            ctx.strokeStyle = '#000080';
            ctx.lineWidth = 2;
            ctx.stroke();
        }, 100);
    }

    function stopTrafficAnimation() {
        clearInterval(trafficInterval);
        const canvas = document.getElementById('vpn-traffic');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// Add retro styling
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .vpn-client {
            font-family: 'Arial', sans-serif;
        }
        .server-item:hover {
            background: #a0a0a0 !important;
        }
        #connect-button {
            background: #c0c0c0;
            border: 2px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
            color: black;
        }
        #connect-button:active {
            border-color: #808080 #ffffff #ffffff #808080;
        }
        .traffic-graph {
            border-style: inset !important;
        }
    `;
    document.head.appendChild(style);
});