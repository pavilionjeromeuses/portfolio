// TaskManager.js
function openTaskManager() {
    const taskManagerContent = `
        <div class="task-manager">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="btn-group">
                    <button class="btn btn-sm btn-secondary" onclick="refreshProcesses()">Refresh</button>
                    <button class="btn btn-sm btn-secondary" onclick="createDummyProcess()">Create Dummy Process</button>
                </div>
                <span>CPU Usage: ${Math.floor(Math.random() * 100)}%</span>
            </div>
            
            <table class="table table-sm table-borderless">
                <thead>
                    <tr>
                        <th>Process Name</th>
                        <th>PID</th>
                        <th>CPU</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="process-list">
                    ${generateProcessList()}
                </tbody>
            </table>
        </div>
    `;

    createWindow('task-manager', 'Task Manager', taskManagerContent);
    addProcessEvents();
}

function generateProcessList() {
    const processes = [
        { name: 'System Idle Process', pid: 0 },
        { name: 'winlogin.exe', pid: 452 },
        { name: 'explorer.exe', pid: 892 },
        { name: 'taskmgr.exe', pid: 1024 },
        { name: 'browser.exe', pid: 567 },
        { name: 'antivirus.exe', pid: 789 }
    ];

    return processes.map(proc => `
        <tr class="process-item">
            <td>${proc.name}</td>
            <td>${proc.pid}</td>
            <td>${Math.floor(Math.random() * 30)}%</td>
            <td><button class="btn btn-xs btn-danger end-task">End Task</button></td>
        </tr>
    `).join('');
}

function refreshProcesses() {
    document.getElementById('process-list').innerHTML = generateProcessList();
    addProcessEvents();
}

function createDummyProcess() {
    const dummyProcs = [
        'dummy_service.exe', 
        'background_task.exe',
        'update_helper.exe',
        'system_tray.exe'
    ];
    
    const newProcess = {
        name: dummyProcs[Math.floor(Math.random() * dummyProcs.length)],
        pid: Math.floor(Math.random() * 5000) + 1000
    };

    const processList = document.getElementById('process-list');
    processList.innerHTML += `
        <tr class="process-item">
            <td>${newProcess.name}</td>
            <td>${newProcess.pid}</td>
            <td>${Math.floor(Math.random() * 30)}%</td>
            <td><button class="btn btn-xs btn-danger end-task">End Task</button></td>
        </tr>
    `;
    
    addProcessEvents();
}

function addProcessEvents() {
    document.querySelectorAll('.end-task').forEach(button => {
        button.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            row.classList.add('terminating');
            setTimeout(() => row.remove(), 500);
        });
    });
}

// Add some visual effects
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .process-item {
            transition: all 0.3s ease;
            background: #c0c0c0 !important;
        }
        .process-item:hover {
            background: #a0a0a0 !important;
        }
        .terminating {
            opacity: 0;
            transform: translateX(100%);
        }
        .task-manager table {
            background: #ffffff;
            border: 2px solid #808080;
        }
        .task-manager th {
            background: #000080;
            color: white;
        }
    `;
    document.head.appendChild(style);
});