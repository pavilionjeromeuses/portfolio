// StepsRecorder.js
function openStepsRecorder() {
    const stepsContent = `
        <div class="steps-recorder">
            <div class="status-bar mb-2 p-2" style="background: #000080; color: white;">
                <span id="recording-status">⏹️ Recording Inactive</span>
                <span id="step-counter" style="float: right;">Steps: 0</span>
            </div>
            
            <div class="controls mb-3">
                <button class="btn btn-secondary" id="record-button" onclick="toggleRecording()">
                    ⏺️ Start Recording
                </button>
                <button class="btn btn-secondary" id="save-button" disabled onclick="saveRecording()">
                    💾 Save Log
                </button>
            </div>
            
            <div class="fake-screenshot mb-3" style="border: 2px inset; background: #c0c0c0; height: 150px; position: relative;">
                <div class="screen-text" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                    📷 Fake Screenshot Preview
                </div>
            </div>
            
            <div class="activity-log" style="border: 2px inset; background: white; height: 200px; overflow-y: auto; padding: 10px;">
                <div id="log-entries"></div>
            </div>
        </div>
    `;

    createWindow('steps-recorder', 'Steps Recorder', stepsContent);
    initializeStepsRecorder();
}

function initializeStepsRecorder() {
    let isRecording = false;
    let stepCount = 0;
    let recordingInterval = null;
    const actions = [
        "Left click on Start button",
        "Right click on desktop",
        "Opened File Explorer",
        "Typed in Notepad",
        "Minimized window",
        "Changed system settings",
        "Accessed Control Panel",
        "Modified registry entry",
        "Connected to network",
        "Installed fake update"
    ];

    window.toggleRecording = () => {
        const recordButton = document.getElementById('record-button');
        const statusElement = document.getElementById('recording-status');
        
        if (!isRecording) {
            isRecording = true;
            recordButton.innerHTML = "⏸️ Stop Recording";
            document.getElementById('save-button').disabled = true;
            statusElement.innerHTML = "🔴 Recording Active";
            statusElement.style.color = 'red';
            
            recordingInterval = setInterval(() => {
                addStep(actions[Math.floor(Math.random() * actions.length)]);
            }, 3000);
            
            addStep("Recording started");
        } else {
            isRecording = false;
            recordButton.innerHTML = "⏺️ Start Recording";
            document.getElementById('save-button').disabled = false;
            statusElement.innerHTML = "⏹️ Recording Saved";
            statusElement.style.color = 'white';
            clearInterval(recordingInterval);
            addStep("Recording stopped");
        }
    };

    window.addStep = (action) => {
        if (!isRecording) return;
        
        stepCount++;
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.innerHTML = `
            <span style="color: #000080;">${new Date().toLocaleTimeString()}</span>
            ${action}
        `;
        document.getElementById('log-entries').prepend(logEntry);
        document.getElementById('step-counter').textContent = `Steps: ${stepCount}`;
    };

    window.saveRecording = () => {
        const logs = document.getElementById('log-entries').innerHTML;
        const fakeZip = `📁 Recording_${new Date().toISOString().slice(0,10)}.zip (${stepCount} steps)`;
        alert(`Saved recording as:\n${fakeZip}`);
        stepCount = 0;
        document.getElementById('log-entries').innerHTML = '';
        document.getElementById('step-counter').textContent = 'Steps: 0';
    };
}

// Add retro styling
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .steps-recorder button {
            background: #c0c0c0;
            border: 2px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
            color: black;
            margin-right: 5px;
        }
        .steps-recorder button:active {
            border-color: #808080 #ffffff #ffffff #808080;
        }
        .log-entry {
            padding: 2px 0;
            border-bottom: 1px dotted #c0c0c0;
            animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
        #recording-status {
            font-weight: bold;
            animation: ${Math.random() < 0.5 ? 'blink' : 'none'} 1s infinite;
        }
        @keyframes blink {
            50% { opacity: 0.5; }
        }
    `;
    document.head.appendChild(style);
});