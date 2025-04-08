// BackupRestore.js
let backups = [];
let backupInterval;

function openBackupRestore() {
    const backupContent = `
        <div class="backup-app">
            <div class="d-flex justify-content-between mb-3">
                <div class="backup-controls">
                    <button class="btn btn-secondary" onclick="startNewBackup()">
                        💾 Create New Backup
                    </button>
                    <button class="btn btn-secondary" onclick="startRestore()" id="restore-btn">
                        🔄 Restore
                    </button>
                </div>
                <div class="storage-meter">
                    <div class="d-flex align-items-center">
                        🗄️ Storage: 
                        <div style="width: 100px; height: 20px; border: 2px inset #808080; margin-left: 10px;">
                            <div id="storage-bar" style="width: 30%; height: 100%; background: #000080;"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="backup-progress mb-3" style="display: none;" id="backup-progress">
                <div class="d-flex justify-content-between">
                    <span>Progress:</span>
                    <span id="progress-status">Initializing...</span>
                </div>
                <div style="height: 20px; border: 2px inset #808080;">
                    <div id="progress-bar" style="width: 0%; height: 100%; background: #008000;"></div>
                </div>
            </div>

            <div class="backup-list">
                <h5>📦 Existing Backups:</h5>
                <div id="backup-items" style="max-height: 200px; overflow-y: auto;">
                    ${generateBackupList()}
                </div>
            </div>

            <div class="backup-tips mt-3 p-2" style="background: #c0c0c0;">
                <strong>💡 Did You Know:</strong> ${getBackupTip()}
            </div>
        </div>
    `;

    createWindow('backup-restore', 'System Backup & Restore', backupContent);
    initializeBackupEvents();
}

function generateBackupList() {
    return backups.map((backup, index) => `
        <div class="backup-item p-2 mb-1 ${backup.active ? 'active-backup' : ''}" 
             data-index="${index}"
             onclick="selectBackup(this)"
             style="cursor: pointer; background: #c0c0c0; border: 2px solid #808080;">
            <div class="d-flex justify-content-between">
                <div>
                    📅 ${backup.date}<br>
                    <small>${backup.size}MB • ${backup.fileCount} files</small>
                </div>
                <div class="backup-status">
                    ${backup.type === 'auto' ? '🤖 Automatic' : '👨💻 Manual'}
                </div>
            </div>
        </div>
    `).join('');
}

function getBackupTip() {
    const tips = [
        "Backups are stored in highly secure .zip files protected by imaginary encryption",
        "System ghosts help maintain backup integrity during full moons",
        "Our backup hamsters can run at speeds up to 12mph",
        "Deleted files go to a nice farm upstate where they can play with other files"
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

function startNewBackup() {
    const progressBar = document.getElementById('backup-progress');
    const progressStatus = document.getElementById('progress-status');
    const storageBar = document.getElementById('storage-bar');
    
    progressBar.style.display = 'block';
    let progress = 0;
    
    backupInterval = setInterval(() => {
        progress += Math.random() * 3;
        if(progress >= 100) {
            progress = 100;
            clearInterval(backupInterval);
            addNewBackup();
            storageBar.style.width = `${Math.min(100, parseFloat(storageBar.style.width) + 15)}%`;
        }
        
        document.getElementById('progress-bar').style.width = `${progress}%`;
        progressStatus.innerHTML = getBackupStage(progress);
    }, 100);
}

function getBackupStage(progress) {
    const stages = [
        [0, "Locating hamsters..."],
        [20, "Collecting system ghosts..."],
        [40, "Polishing .zip files..."],
        [60, "Feeding backup turtles..."],
        [80, "Applying digital bubble wrap..."],
        [100, "Backup complete!"]
    ];
    
    return stages.findLast(([threshold]) => progress >= threshold)[1];
}

function addNewBackup() {
    const newBackup = {
        date: new Date().toLocaleString(),
        size: Math.floor(Math.random() * 500 + 100),
        fileCount: Math.floor(Math.random() * 5000 + 1000),
        type: Math.random() > 0.5 ? 'auto' : 'manual',
        active: false
    };
    
    backups.unshift(newBackup);
    document.getElementById('backup-items').innerHTML = generateBackupList();
}

function selectBackup(element) {
    document.querySelectorAll('.backup-item').forEach(item => {
        item.classList.remove('active-backup');
        item.style.background = '#c0c0c0';
    });
    
    element.classList.add('active-backup');
    element.style.background = '#000080';
    element.style.color = 'white';
    backups[element.dataset.index].active = true;
}

function startRestore() {
    const selectedBackup = backups.find(backup => backup.active);
    if(!selectedBackup) {
        alert("Please select a backup to restore!");
        return;
    }

    const progressBar = document.getElementById('backup-progress');
    const progressStatus = document.getElementById('progress-status');
    const progressElement = document.getElementById('progress-bar');
    
    progressBar.style.display = 'block';
    progressElement.style.background = '#008080';
    let progress = 0;
    
    backupInterval = setInterval(() => {
        progress += Math.random() * 4;
        if(progress >= 100) {
            progress = 100;
            clearInterval(backupInterval);
            progressStatus.innerHTML = "✨ Restoration complete!";
            setTimeout(() => progressBar.style.display = 'none', 2000);
        }
        
        progressElement.style.width = `${progress}%`;
        progressStatus.innerHTML = getRestoreStage(progress);
    }, 100);
}

function getRestoreStage(progress) {
    const stages = [
        [0, "Reviving digital ghosts..."],
        [25, "Unpacking virtual boxes..."],
        [50, "Teaching files to dance..."],
        [75, "Applying system nostalgia..."],
        [100, "Finalizing restoration..."]
    ];
    
    return stages.findLast(([threshold]) => progress >= threshold)[1];
}

function initializeBackupEvents() {
    // Initialize any additional event listeners if needed
}

// Add retro styling
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .backup-app {
            font-family: 'Arial', sans-serif;
        }
        .backup-item:hover {
            background: #a0a0a0 !important;
        }
        .active-backup {
            border-color: #008000 !important;
        }
        .btn-secondary {
            background: #c0c0c0;
            border: 2px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
            color: black;
        }
        .btn-secondary:active {
            border-color: #808080 #ffffff #ffffff #808080;
        }
    `;
    document.head.appendChild(style);
});