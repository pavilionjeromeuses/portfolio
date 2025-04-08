// VoiceRecorder.js
let isRecording = false;
let isPlaying = false;
let currentTime = 0;
let recordings = [];
let currentRecording = null;
let timerInterval;

function openVoiceRecorder() {
    const recorderContent = `
        <div class="voice-recorder">
            <div class="display">
                <div class="time">${formatTime(currentTime)}</div>
                <div class="waveform"></div>
            </div>
            
            <div class="controls">
                <button class="btn btn-sm ${isRecording ? 'recording' : ''}" 
                    onclick="toggleRecording()">⏺️</button>
                <button class="btn btn-sm" onclick="stopRecording()" ${!isRecording ? 'disabled' : ''}>⏹️</button>
                <button class="btn btn-sm" onclick="playRecording()" ${recordings.length === 0 ? 'disabled' : ''}>▶️</button>
            </div>
            
            <div class="recordings-list">
                <h5>Recordings (${recordings.length})</h5>
                <div id="recordings">
                    ${recordings.map((rec, index) => `
                        <div class="recording-item" onclick="selectRecording(${index})">
                            <div>Recording ${index + 1}</div>
                            <div>${rec.duration} - ${rec.date}</div>
                            <button class="btn btn-xs" onclick="deleteRecording(${index})">🗑️</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    createWindow('voice-recorder', 'Voice Recorder', recorderContent);
    updateWaveform();
}

function toggleRecording() {
    isRecording = !isRecording;
    document.querySelector('.btn').classList.toggle('recording', isRecording);
    
    if(isRecording) {
        currentTime = 0;
        timerInterval = setInterval(() => {
            currentTime++;
            document.querySelector('.time').textContent = formatTime(currentTime);
            updateWaveform();
        }, 1000);
    } else {
        clearInterval(timerInterval);
    }
}

function stopRecording() {
    if(isRecording) {
        toggleRecording();
        recordings.push({
            duration: formatTime(currentTime),
            date: new Date().toLocaleDateString(),
            data: [] // Simulated audio data
        });
        openVoiceRecorder();
    }
}

function playRecording() {
    if(!currentRecording) return;
    
    isPlaying = true;
    let playTime = 0;
    const totalTime = timeToSeconds(currentRecording.duration);
    
    document.querySelector('.time').textContent = formatTime(playTime);
    const playInterval = setInterval(() => {
        playTime++;
        document.querySelector('.time').textContent = formatTime(playTime);
        updateWaveform();
        
        if(playTime >= totalTime) {
            clearInterval(playInterval);
            isPlaying = false;
            document.querySelector('.time').textContent = formatTime(0);
        }
    }, 1000);
}

function selectRecording(index) {
    currentRecording = recordings[index];
    document.querySelectorAll('.recording-item').forEach(item => 
        item.classList.remove('selected'));
    event.target.closest('.recording-item').classList.add('selected');
}

function deleteRecording(index) {
    if(confirm("Delete this recording?")) {
        recordings.splice(index, 1);
        openVoiceRecorder();
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function timeToSeconds(time) {
    const [mins, secs] = time.split(':').map(Number);
    return mins * 60 + secs;
}

function updateWaveform() {
    const waveform = document.querySelector('.waveform');
    if(waveform) {
        waveform.innerHTML = Array.from({length: 20}, () => 
            `<div class="bar" style="height: ${Math.random() * 30 + 5}px"></div>`
        ).join('');
    }
}

// Add Voice Recorder styles
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .voice-recorder {
            background: #c0c0c0;
            padding: 15px;
            border: 3px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
        }
        .display {
            background: #000;
            color: #0f0;
            padding: 10px;
            margin-bottom: 15px;
            font-family: 'Courier New', monospace;
        }
        .time {
            font-size: 24px;
            text-align: center;
        }
        .waveform {
            display: flex;
            justify-content: center;
            gap: 2px;
            height: 50px;
            margin-top: 10px;
        }
        .bar {
            width: 4px;
            background: #0f0;
            animation: pulse 0.5s infinite alternate;
        }
        .controls {
            display: flex;
            justify-content: center;
            gap: 5px;
            margin-bottom: 15px;
        }
        .btn {
            border: 2px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
            background: #c0c0c0;
            min-width: 50px;
        }
        .btn:active {
            border-color: #808080 #ffffff #ffffff #808080;
        }
        .recording {
            background: #ff0000 !important;
        }
        .recordings-list {
            background: white;
            border: 2px solid #808080;
            padding: 10px;
        }
        .recording-item {
            display: flex;
            justify-content: space-between;
            padding: 5px;
            border-bottom: 1px solid #808080;
            cursor: pointer;
        }
        .recording-item.selected {
            background: #000080;
            color: white;
        }
        @keyframes pulse {
            from { opacity: 0.5; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});