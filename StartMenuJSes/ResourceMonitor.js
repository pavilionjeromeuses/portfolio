// ResourceMonitor.js
let monitoringInterval;
const processes = [
    { name: 'System', cpu: 2, mem: 20 },
    { name: 'Explorer', cpu: 15, mem: 50 },
    { name: 'Antivirus', cpu: 5, mem: 30 }
];

function openResourceMonitor() {
    const monitorContent = `
        <div class="resource-monitor">
            <div class="d-flex gap-3 mb-3">
                <button class="btn btn-sm btn-secondary active" data-tab="overview">📊 Overview</button>
                <button class="btn btn-sm btn-secondary" data-tab="cpu">💻 CPU</button>
                <button class="btn btn-sm btn-secondary" data-tab="memory">🧠 Memory</button>
                <button class="btn btn-sm btn-secondary" data-tab="disk">💾 Disk</button>
            </div>
            
            <!-- Overview Tab -->
            <div class="tab-content" id="overview">
                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="metric-box">
                            <h5>CPU Usage</h5>
                            <canvas id="cpuChart"></canvas>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="metric-box">
                            <h5>Memory Usage</h5>
                            <div class="memory-gauge" id="memoryGauge"></div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="metric-box">
                            <h5>Processes</h5>
                            <div class="process-list" id="processList"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- CPU Tab -->
            <div class="tab-content d-none" id="cpu">
                <div class="cpu-graph">
                    <canvas id="cpuHistory"></canvas>
                </div>
            </div>

            <!-- Memory Tab -->
            <div class="tab-content d-none" id="memory">
                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="metric-box">
                            <h5>Physical Memory</h5>
                            <div class="progress" style="height: 20px">
                                <div class="progress-bar" id="physMemBar" style="width: 0%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="metric-box">
                            <h5>Virtual Memory</h5>
                            <div class="progress" style="height: 20px">
                                <div class="progress-bar" id="virtMemBar" style="width: 0%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Disk Tab -->
            <div class="tab-content d-none" id="disk">
                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="metric-box">
                            <h5>C: Drive</h5>
                            <div class="progress" style="height: 20px">
                                <div class="progress-bar" id="diskCBar" style="width: 0%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="metric-box">
                            <h5>D: Drive</h5>
                            <div class="progress" style="height: 20px">
                                <div class="progress-bar" id="diskDBar" style="width: 0%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    createWindow('resource-monitor', 'Resource Monitor', monitorContent);
    setupTabs();
    initializeCharts();
    startMonitoring();
}

function setupTabs() {
    document.querySelectorAll('[data-tab]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-content').forEach(t => t.classList.add('d-none'));
            document.querySelectorAll('[data-tab]').forEach(b => b.classList.remove('active'));
            document.getElementById(btn.dataset.tab).classList.remove('d-none');
            btn.classList.add('active');
        });
    });
}

function initializeCharts() {
    // CPU Usage Pie Chart
    const cpuCtx = document.getElementById('cpuChart').getContext('2d');
    new Chart(cpuCtx, {
        type: 'doughnut',
        data: {
            labels: ['Used', 'Free'],
            datasets: [{
                data: [25, 75],
                backgroundColor: ['#000080', '#c0c0c0']
            }]
        }
    });

    // CPU History Line Chart
    const historyCtx = document.getElementById('cpuHistory').getContext('2d');
    new Chart(historyCtx, {
        type: 'line',
        data: {
            labels: Array(20).fill(''),
            datasets: [{
                label: 'CPU Usage',
                data: Array(20).fill(0),
                borderColor: '#000080',
                tension: 0.1
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function startMonitoring() {
    updateProcessList();
    monitoringInterval = setInterval(() => {
        updateCPUHistory();
        updateMemoryUsage();
        updateDiskUsage();
        updateProcesses();
    }, 1000);
}

function updateCPUHistory() {
    const chart = Chart.getChart('cpuHistory');
    if (chart) {
        const newData = Math.random() * 100;
        chart.data.datasets[0].data.push(newData);
        chart.data.datasets[0].data.shift();
        chart.update();
    }
}

function updateMemoryUsage() {
    const physUsage = Math.random() * 100;
    const virtUsage = Math.random() * 100;
    document.getElementById('physMemBar').style.width = `${physUsage}%`;
    document.getElementById('virtMemBar').style.width = `${virtUsage}%`;
}

function updateDiskUsage() {
    document.getElementById('diskCBar').style.width = `${Math.random() * 100}%`;
    document.getElementById('diskDBar').style.width = `${Math.random() * 100}%`;
}

function updateProcessList() {
    const list = document.getElementById('processList');
    list.innerHTML = processes.map(proc => `
        <div class="process-item">
            <div>${proc.name}</div>
            <div>${Math.round(proc.cpu)}%</div>
            <div>${Math.round(proc.mem)}MB</div>
            <button class="btn btn-xs btn-danger" onclick="endProcess('${proc.name}')">End</button>
        </div>
    `).join('');
}

function updateProcesses() {
    processes.forEach(proc => {
        proc.cpu = Math.min(100, proc.cpu + (Math.random() * 10 - 5));
        proc.mem = Math.min(1024, proc.mem + (Math.random() * 50 - 25));
    });
    updateProcessList();
}

function endProcess(name) {
    const procIndex = processes.findIndex(p => p.name === name);
    if (procIndex > -1) {
        processes.splice(procIndex, 1);
        updateProcessList();
    }
}

// Add resource monitor styles
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .resource-monitor {
            background: #c0c0c0;
            padding: 15px;
        }
        .metric-box {
            background: white;
            border: 2px solid #808080;
            padding: 10px;
            margin-bottom: 15px;
        }
        .process-item {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr auto;
            gap: 10px;
            padding: 5px;
            border-bottom: 1px solid #808080;
        }
        .progress {
            background: #ffffff;
            border: 2px solid #808080;
        }
        .progress-bar {
            background: #000080;
        }
        canvas {
            max-height: 200px;
        }
    `;
    document.head.appendChild(style);
});

// Close monitoring when window closes
window.addEventListener('beforeunload', () => {
    if (monitoringInterval) clearInterval(monitoringInterval);
});