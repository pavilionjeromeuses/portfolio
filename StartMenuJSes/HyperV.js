// HyperV.js
function openHyperV() {
    const hyperVContent = `
        <div class="hyper-v">
            <div class="d-flex justify-content-between mb-3">
                <button class="btn btn-secondary" onclick="createNewVM()">➕ Create VM</button>
                <div class="resource-meter">
                    <span>⚡ Fake Resources: <span id="vm-resources">85%</span></span>
                    <div class="meter-bar" style="background: #c0c0c0; height: 10px; width: 200px;">
                        <div id="meter-fill" style="background: #000080; height: 100%; width: 85%;"></div>
                    </div>
                </div>
            </div>

            <div class="vm-list mb-3">
                ${generateVMList()}
            </div>

            <div class="vm-console p-2" style="background: black; color: lime; height: 150px; overflow-y: scroll;">
                <pre id="console-output">📟 Hyper-V Fake Console\n> Ready...</pre>
            </div>
        </div>
    `;

    createWindow('hyper-v', "Hyper-V Manager", hyperVContent);
    initializeHyperVEvents();
}

function generateVMList() {
    const vms = [
        { name: "Windows 93", status: "running", os: "🪟 Windows 93", resources: 35 },
        { name: "LinuxLite", status: "stopped", os: "🐧 Fake Linux", resources: 25 },
        { name: "DOSBox", status: "paused", os: "💾 MS-DOS 6.22", resources: 15 }
    ];

    return vms.map(vm => `
        <div class="vm-item p-2 mb-2" style="background: #c0c0c0; border: 2px solid #808080;">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h5>${vm.name}</h5>
                    <div>${vm.os} - ${vm.resources}% Resources</div>
                </div>
                <div class="vm-controls">
                    <span class="status-light ${vm.status}" style="width: 10px; height: 10px; border-radius: 50%; display: inline-block;"></span>
                    <button class="btn btn-xs btn-secondary" onclick="vmAction('${vm.name}', 'start')" ${vm.status === 'running' ? 'disabled' : ''}>▶ Start</button>
                    <button class="btn btn-xs btn-secondary" onclick="vmAction('${vm.name}', 'stop')" ${vm.status !== 'running' ? 'disabled' : ''}>⏹ Stop</button>
                </div>
            </div>
        </div>
    `).join('');
}

function initializeHyperVEvents() {
    let resources = 85;
    const consoleOutput = document.getElementById('console-output');
    
    window.createNewVM = () => {
        if (resources < 20) {
            alert("❌ Not enough fake resources!");
            return;
        }

        const vmName = prompt("Enter VM name:");
        if (vmName) {
            resources -= 15;
            updateResources();
            appendToConsole(`Creating VM "${vmName}"...`);
            setTimeout(() => appendToConsole(`VM "${vmName}" created!`), 1000);
        }
    };

    window.vmAction = (name, action) => {
        appendToConsole(`${action === 'start' ? '🚀 Starting' : '🛑 Stopping'} ${name}...`);
        const vmItem = [...document.querySelectorAll('.vm-item')].find(item => 
            item.querySelector('h5').textContent === name
        );

        if (action === 'start') {
            resources -= 15;
            vmItem.querySelector('.status-light').classList.add('running');
            vmItem.querySelectorAll('button')[0].disabled = true;
            vmItem.querySelectorAll('button')[1].disabled = false;
        } else {
            resources += 15;
            vmItem.querySelector('.status-light').classList.remove('running');
            vmItem.querySelectorAll('button')[0].disabled = false;
            vmItem.querySelectorAll('button')[1].disabled = true;
        }

        updateResources();
    };

    function updateResources() {
        document.getElementById('vm-resources').textContent = `${resources}%`;
        document.getElementById('meter-fill').style.width = `${resources}%`;
        document.getElementById('meter-fill').style.backgroundColor = 
            resources > 50 ? '#000080' : resources > 20 ? '#808080' : '#800000';
    }

    window.appendToConsole = (text) => {
        const console = document.getElementById('console-output');
        console.textContent += `\n> ${text}`;
        console.scrollTop = console.scrollHeight;
    };
}

// Add retro styling
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .hyper-v {
            font-family: 'Arial', sans-serif;
        }
        .vm-item {
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .vm-item:hover {
            background: #a0a0a0 !important;
        }
        .status-light {
            background: #808080;
        }
        .status-light.running {
            background: #00ff00;
            box-shadow: 0 0 5px lime;
        }
        .vm-console {
            border: 3px inset #808080;
            font-family: 'Courier New', monospace;
        }
        .meter-bar {
            border: 2px inset #808080;
        }
    `;
    document.head.appendChild(style);
});