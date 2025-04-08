// DiskCleanup.js
let diskSpace = 1024;
let files = [];

function generateFileSystem() {
    const fileTypes = [
        { name: 'Temporary Files', icon: '📄', count: Math.floor(Math.random()*50)+20 },
        { name: 'Cache Files', icon: '🗃️', count: Math.floor(Math.random()*30)+10 },
        { name: 'Error Logs', icon: '⚠️', count: Math.floor(Math.random()*20)+5 },
        { name: 'Old Updates', icon: '🔄', count: Math.floor(Math.random()*15)+3 },
        { name: 'Recycle Bin', icon: '🗑️', count: Math.floor(Math.random()*10)+1 }
    ];

    files = fileTypes.map(type => ({
        ...type,
        size: Math.floor(Math.random()*100)+50,
        selected: true
    }));
}

function openDiskCleanup() {
    generateFileSystem();
    const diskContent = `
        <div class="disk-cleanup">
            <div class="scanning" id="scanning">
                <div class="spinner">🖥️</div>
                <div>Scanning system files...</div>
            </div>
            <div class="results" style="display:none;">
                <h5>Disk Cleanup for Local Disk (C:)</h5>
                <div class="file-list mb-3">
                    ${files.map(file => `
                        <div class="file-item">
                            <label>
                                <input type="checkbox" ${file.selected ? 'checked' : ''} 
                                    onchange="toggleFile('${file.name}')">
                                ${file.icon} ${file.name} 
                                <span class="size">(${file.count} files, ${file.size}KB)</span>
                            </label>
                        </div>
                    `).join('')}
                </div>
                <div class="total-space">Total space to free: <span id="total-space">0KB</span></div>
                <div class="progress mb-3">
                    <div class="progress-bar" role="progressbar" style="width: 0%"></div>
                </div>
                <button class="btn btn-danger" onclick="startCleanup()">🧹 Clean Up System Files</button>
            </div>
        </div>
    `;

    createWindow('disk-cleanup', 'Disk Cleanup', diskContent);
    
    // Simulate scanning animation
    setTimeout(() => {
        document.getElementById('scanning').style.display = 'none';
        document.querySelector('.results').style.display = 'block';
        updateTotalSpace();
    }, 2000);
}

function toggleFile(name) {
    const file = files.find(f => f.name === name);
    file.selected = !file.selected;
    updateTotalSpace();
}

function updateTotalSpace() {
    const total = files.reduce((sum, file) => file.selected ? sum + (file.size * file.count) : sum, 0);
    document.getElementById('total-space').textContent = `${total}KB`;
}

function startCleanup() {
    const selectedFiles = files.filter(f => f.selected);
    if(selectedFiles.length === 0) return;

    const progressBar = document.querySelector('.progress-bar');
    let progress = 0;
    const totalSteps = 100;
    
    // Delete animation for files
    selectedFiles.forEach(file => {
        const element = document.querySelector(`input[onchange="toggleFile('${file.name}')`).parentNode;
        element.style.transition = 'all 0.5s ease';
        element.style.opacity = '0.5';
        element.style.textDecoration = 'line-through';
    });

    // Progress animation
    const cleanupInterval = setInterval(() => {
        progress += 2;
        progressBar.style.width = `${progress}%`;
        
        if(progress >= 100) {
            clearInterval(cleanupInterval);
            diskSpace += Math.floor(Math.random()*500)+100;
            showCompletion();
        }
    }, 50);
}

function showCompletion() {
    const completionContent = `
        <div class="completion">
            <div class="mb-3">✅ Disk cleanup completed successfully!</div>
            <div class="stats">
                <div>Space freed: ${document.getElementById('total-space').textContent}</div>
                <div>Total free space: ${diskSpace}KB</div>
            </div>
            <button class="btn btn-secondary mt-3" onclick="closeWindow('disk-cleanup')">Close</button>
        </div>
    `;
    
    document.querySelector('.results').innerHTML = completionContent;
}

// Add disk cleanup styles
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .disk-cleanup {
            background: #c0c0c0;
            padding: 15px;
        }
        .scanning {
            text-align: center;
            padding: 50px 0;
        }
        .spinner {
            font-size: 40px;
            animation: spin 1s linear infinite;
            margin-bottom: 10px;
        }
        .file-item {
            background: white;
            padding: 5px;
            margin: 2px 0;
            border: 2px solid #808080;
        }
        .progress {
            height: 20px;
            border: 2px solid #808080;
            background: #ffffff;
        }
        .progress-bar {
            background: #000080;
            transition: width 0.3s ease;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .completion {
            text-align: center;
            padding: 20px;
        }
        .stats {
            background: white;
            padding: 10px;
            border: 2px solid #808080;
        }
    `;
    document.head.appendChild(style);
});