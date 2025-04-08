// FileHistory.js
function openFileHistory() {
    const fileHistoryContent = `
        <div class="file-history">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5>📁 Time Machine for Files</h5>
                <div class="btn-group">
                    <button class="btn btn-sm btn-secondary" onclick="refreshFileHistory()">🔄 Refresh</button>
                </div>
            </div>
            
            <div class="time-machine-controls mb-3">
                <input type="date" id="history-date" class="form-control mb-2" 
                       max="${new Date().toISOString().split('T')[0]}" 
                       value="${new Date().toISOString().split('T')[0]}">
                <button class="btn btn-secondary w-100" onclick="travelInTime()">🕰️ Travel to Selected Date</button>
            </div>
            
            <div class="file-list">
                <div class="list-header d-flex justify-content-between mb-2">
                    <span>File Name</span>
                    <span>Last Saved</span>
                </div>
                <div id="file-entries">
                    ${generateFileHistoryEntries()}
                </div>
            </div>
            
            <div class="restore-section mt-3 p-2" style="background: #c0c0c0;">
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-success me-2" onclick="restoreSelectedFiles()">⏪ Restore Selected</button>
                    <span id="selected-count">0 files selected</span>
                </div>
                <div class="restore-progress mt-2" style="display: none;">
                    <div class="progress" style="height: 20px;">
                        <div class="progress-bar" role="progressbar" style="width: 0%">Restoring...</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    createWindow('file-history', 'File Time Machine', fileHistoryContent);
    initializeFileHistoryEvents();
}

function generateFileHistoryEntries() {
    const files = [
        { name: "secret_recipe.txt", date: "1999-12-31", size: "12KB" },
        { name: "vacation_photos.bmp", date: "2003-08-15", size: "3.4MB" },
        { name: "never_gonna_give_you_up.mp3", date: "2007-07-27", size: "4.2MB" },
        { name: "windows_activation_key.txt", date: "1995-08-24", size: "512B" },
        { name: "midi_collection.zip", date: "2001-09-11", size: "1.2MB" },
        { name: "dot_matrix_printer_driver.exe", date: "1998-03-12", size: "2.8MB" }
    ];

    return files.map(file => `
        <div class="file-entry d-flex justify-content-between p-2" 
             onclick="toggleFileSelection(this)"
             style="cursor: pointer; background: #c0c0c0; border: 2px solid #808080; margin-bottom: 2px;">
            <div>
                <input type="checkbox" class="me-2">
                <span class="file-name">📄 ${file.name}</span>
            </div>
            <div class="file-date">${file.date}</div>
        </div>
    `).join('');
}

function initializeFileHistoryEvents() {
    window.toggleFileSelection = (element) => {
        const checkbox = element.querySelector('input[type="checkbox"]');
        checkbox.checked = !checkbox.checked;
        element.style.background = checkbox.checked ? '#000080' : '#c0c0c0';
        element.style.color = checkbox.checked ? 'white' : 'inherit';
        updateSelectedCount();
    };

    window.updateSelectedCount = () => {
        const count = document.querySelectorAll('.file-entry input:checked').length;
        document.getElementById('selected-count').textContent = 
            `${count} file${count !== 1 ? 's' : ''} selected`;
    };

    window.travelInTime = () => {
        const selectedDate = document.getElementById('history-date').value;
        alert(`🕰️ Whoosh! Traveling to ${selectedDate}...\n(Just kidding, we didn't actually invent time travel yet)`);
    };

    window.restoreSelectedFiles = () => {
        const selectedFiles = document.querySelectorAll('.file-entry input:checked');
        if(selectedFiles.length === 0) {
            alert("❗ No files selected!\nPlease check some files to restore");
            return;
        }

        const progressBar = document.querySelector('.restore-progress .progress-bar');
        const progressContainer = document.querySelector('.restore-progress');
        progressContainer.style.display = 'block';
        
        let width = 0;
        const interval = setInterval(() => {
            width += Math.random() * 15;
            progressBar.style.width = `${width}%`;
            
            if(width >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    progressContainer.style.display = 'none';
                    progressBar.style.width = '0%';
                    if(Math.random() > 0.3) {
                        alert("✅ Restoration complete!\nYour files have been sent back to 1998");
                    } else {
                        alert("❌ Restoration failed!\nThe time police detected our activities");
                    }
                }, 500);
            }
        }, 200);
    };
}

// Add nostalgic styling
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .file-history {
            font-family: 'Arial', sans-serif;
        }
        .file-entry:hover {
            background: #a0a0a0 !important;
        }
        .list-header {
            background: #000080;
            color: white;
            padding: 5px;
        }
        .progress {
            border: 2px solid #808080;
            background: #c0c0c0;
        }
        .progress-bar {
            background: #000080;
            font-size: 12px;
        }
        input[type="date"] {
            border-style: inset;
            background: #c0c0c0;
        }
    `;
    document.head.appendChild(style);
});