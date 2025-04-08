// SystemRestore.js
function openSystemRestore() {
    const restoreContent = `
        <div class="system-restore">
            <div class="timeline-container mb-3">
                <div class="timeline-header">📅 System Restore Timeline</div>
                <div class="timeline" id="restore-timeline">
                    ${generateTimelinePoints()}
                </div>
            </div>
            
            <div class="d-flex justify-content-between mb-3">
                <button class="btn btn-secondary" onclick="scanAffectedPrograms()">
                    🔍 Scan for affected programs
                </button>
                <button class="btn btn-primary" id="restore-button" onclick="startRestore()">
                    ⚙️ Begin System Restore
                </button>
            </div>
            
            <div class="restore-details">
                <div class="affected-programs" id="affected-programs"></div>
                <div class="restore-progress" id="restore-progress">
                    <div class="progress-bar" style="width: 0%"></div>
                </div>
                <div class="status-messages" id="status-messages"></div>
            </div>
            
            <div class="restore-tips mt-2">
                <strong>💡 Did You Know?</strong> ${getRandomRestoreTip()}
            </div>
        </div>
    `;

    createWindow('system-restore', 'Time Machine Restorer 95', restoreContent);
    initializeRestoreEvents();
}

function generateTimelinePoints() {
    const points = [
        { date: "1995-08-24", name: "Windows 95 Launch Day", type: "critical" },
        { date: "1996-01-01", name: "New Year's Y2K Prep", type: "update" },
        { date: "1997-05-07", name: "DOOM Installation", type: "application" },
        { date: "1998-04-01", name: "April Fools' Update", type: "critical" },
        { date: "1999-12-31", name: "Y2K Armageddon Patch", type: "critical" }
    ];

    return points.map(point => `
        <div class="timeline-point ${point.type}" 
             onclick="selectRestorePoint(this)" 
             data-date="${point.date}">
            <div class="point-icon">${getPointIcon(point.type)}</div>
            <div class="point-date">${point.date}</div>
            <div class="point-name">${point.name}</div>
        </div>
    `).join('');
}

function getPointIcon(type) {
    const icons = {
        critical: "🔥",
        update: "🔄",
        application: "💿"
    };
    return icons[type] || "📌";
}

function getRandomRestoreTip() {
    const tips = [
        "System Restore can recover deleted game saves... allegedly!",
        "Restoring to 1999 might re-enable Clippy!",
        "We store restore points in Narnia for safety!",
        "50% of all restores are done just to fix Solitaire!",
        "Restoring system time might make you younger!"
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

function initializeRestoreEvents() {
    let currentRestorePoint = null;
    let isRestoring = false;
    
    window.selectRestorePoint = (element) => {
        document.querySelectorAll('.timeline-point').forEach(point => {
            point.classList.remove('selected');
        });
        element.classList.add('selected');
        currentRestorePoint = element;
    };

    window.scanAffectedPrograms = () => {
        const programs = [
            "MS Paint DLC Pack",
            "Bonzi Buddy Extension",
            "3D Space Cadet Pinball",
            "Microsoft Bob Compatibility",
            "Windows 95 Screensaver Pack"
        ];
        
        const affectedList = document.getElementById('affected-programs');
        affectedList.innerHTML = `
            <h5>⚠️ Potentially Affected Programs:</h5>
            <ul>
                ${programs.map(prog => `<li>${prog}</li>`).join('')}
            </ul>
            <div class="mt-2">(Note: These programs might become 10x more awesome)</div>
        `;
    };

    window.startRestore = () => {
        if (!currentRestorePoint) {
            alert("Please select a restore point first!");
            return;
        }
        
        const progressBar = document.querySelector('.progress-bar');
        const statusMessages = document.getElementById('status-messages');
        const restoreButton = document.getElementById('restore-button');
        let progress = 0;
        
        restoreButton.disabled = true;
        isRestoring = true;
        
        const fakeMessages = [
            "Reversing Y2K compliance...",
            "Downgrading to Netscape Navigator...",
            "Installing ActiveX controls...",
            "Defragmenting hamster wheel...",
            "Calibrating flux capacitor...",
            "Rewinding system clock..."
        ];

        const restoreInterval = setInterval(() => {
            progress += Math.random() * 3;
            if(progress >= 100) {
                progress = 100;
                clearInterval(restoreInterval);
                
                statusMessages.innerHTML = `
                    <div class="text-success mt-2">
                        ✅ Restore complete! Enjoy your ${currentRestorePoint.dataset.date} nostalgia!
                    </div>
                `;
                restoreButton.disabled = false;
                isRestoring = false;
            }
            
            progressBar.style.width = `${progress}%`;
            
            if(progress % 20 < 2) {
                statusMessages.innerHTML = `
                    <div class="text-info">
                        ${fakeMessages[Math.floor(Math.random() * fakeMessages.length)]}
                    </div>
                `;
            }
        }, 150);
    };
}

// Retro styling
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .system-restore {
            font-family: 'Arial', sans-serif;
        }
        .timeline-container {
            border: 2px inset #808080;
            padding: 10px;
            background: white;
        }
        .timeline {
            display: flex;
            overflow-x: auto;
            gap: 20px;
            padding: 10px 0;
        }
        .timeline-point {
            min-width: 150px;
            padding: 10px;
            border: 2px outset #808080;
            background: #c0c0c0;
            cursor: pointer;
        }
        .timeline-point.selected {
            background: #000080;
            color: white;
            border-style: inset;
        }
        .progress-bar {
            height: 20px;
            background: #000080;
            transition: width 0.3s ease;
        }
        .affected-programs {
            background: white;
            padding: 10px;
            border: 2px inset #808080;
            margin-bottom: 10px;
        }
        .restore-tips {
            border: 2px inset #808080;
            padding: 5px;
            background: #c0c0c0;
        }
    `;
    document.head.appendChild(style);
});