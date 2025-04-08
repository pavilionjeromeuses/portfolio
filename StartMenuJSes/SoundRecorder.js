// SoundRecorder.js
function openSoundRecorder() {
    const recorderContent = `
        <div class="sound-recorder">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h4>🎤 Windows 95 Sound Recorder</h4>
                <span id="recording-status" style="color: red; display: none;">● REC</span>
            </div>
            
            <div class="waveform-display mb-3 p-2" style="background: white; border: 2px solid #808080;">
                <canvas id="audio-waveform" width="300" height="80"></canvas>
            </div>
            
            <div class="controls mb-3">
                <div class="btn-group">
                    <button id="record-btn" class="btn btn-secondary" onclick="toggleRecording()">
                        ⏺️ Record
                    </button>
                    <button id="stop-btn" class="btn btn-secondary" onclick="stopRecording()" disabled>
                        ⏹️ Stop
                    </button>
                    <button id="play-btn" class="btn btn-secondary" onclick="playRecording()" disabled>
                        ▶️ Play
                    </button>
                </div>
                <input type="text" id="tape-name" class="ms-2" placeholder="Name your tape" 
                       style="border: 2px inset #808080; padding: 2px;">
            </div>
            
            <div class="library">
                <h5>📼 Tape Library</h5>
                <div id="tape-list" style="max-height: 150px; overflow-y: auto;">
                    ${generateDemoTapes()}
                </div>
            </div>
        </div>
    `;

    createWindow('sound-recorder', 'Sound Recorder', recorderContent);
    initializeRecorder();
}

function generateDemoTapes() {
    const tapes = [
        { name: "Secret Message.wav", date: "1995-08-24", duration: "0:30" },
        { name: "System Sounds.mp3", date: "1996-02-14", duration: "1:15" },
        { name: "Error Beeps.rec", date: "1997-12-01", duration: "0:45" }
    ];

    return tapes.map(tape => `
        <div class="tape-item p-1" style="border-bottom: 1px solid #808080;">
            <span>${tape.name}</span>
            <div class="d-flex justify-content-between">
                <small>${tape.date}</small>
                <div>
                    <span class="me-2">${tape.duration}</span>
                    <button class="btn btn-xs" onclick="playTape(this)">▶</button>
                    <button class="btn btn-xs" onclick="deleteTape(this)">🗑️</button>
                </div>
            </div>
        </div>
    `).join('');
}

function initializeRecorder() {
    let isRecording = false;
    let isPlaying = false;
    let animationInterval;
    const canvas = document.getElementById('audio-waveform');
    const ctx = canvas.getContext('2d');
    
    window.toggleRecording = () => {
        const recordBtn = document.getElementById('record-btn');
        const stopBtn = document.getElementById('stop-btn');
        const status = document.getElementById('recording-status');
        
        if (!isRecording) {
            if (!document.getElementById('tape-name').value) {
                alert("Please name your tape first!");
                return;
            }
            
            isRecording = true;
            recordBtn.innerHTML = "⏺️ Recording...";
            stopBtn.disabled = false;
            status.style.display = 'inline';
            startWaveformAnimation();
        } else {
            isRecording = false;
            recordBtn.innerHTML = "⏺️ Record";
            stopBtn.disabled = true;
            status.style.display = 'none';
            stopWaveformAnimation();
        }
    };

    window.stopRecording = () => {
        isRecording = false;
        document.getElementById('record-btn').innerHTML = "⏺️ Record";
        document.getElementById('stop-btn').disabled = true;
        document.getElementById('play-btn').disabled = false;
        document.getElementById('recording-status').style.display = 'none';
        stopWaveformAnimation();
        addNewTape();
    };

    window.playRecording = () => {
        const playBtn = document.getElementById('play-btn');
        if (!isPlaying) {
            isPlaying = true;
            playBtn.innerHTML = "⏸️ Pause";
            startPlayheadAnimation();
        } else {
            isPlaying = false;
            playBtn.innerHTML = "▶️ Play";
            stopPlayheadAnimation();
        }
    };

    function startWaveformAnimation() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animationInterval = setInterval(() => {
            ctx.fillStyle = '#c0c0c0';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Generate random waveform
            ctx.beginPath();
            ctx.moveTo(0, canvas.height/2);
            for(let x = 0; x < canvas.width; x++) {
                const y = canvas.height/2 + Math.sin(x * 0.3 + Date.now()*0.01) * 30;
                ctx.lineTo(x, y);
            }
            ctx.strokeStyle = '#000080';
            ctx.stroke();
        }, 50);
    }

    function stopWaveformAnimation() {
        clearInterval(animationInterval);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function startPlayheadAnimation() {
        const playhead = document.createElement('div');
        playhead.id = 'playhead';
        playhead.style.position = 'absolute';
        playhead.style.height = '80px';
        playhead.style.width = '2px';
        playhead.style.background = 'red';
        playhead.style.left = '0';
        document.querySelector('.waveform-display').appendChild(playhead);
        
        let position = 0;
        animationInterval = setInterval(() => {
            position = (position + 2) % canvas.width;
            playhead.style.left = `${position}px`;
        }, 50);
    }

    function stopPlayheadAnimation() {
        clearInterval(animationInterval);
        document.getElementById('playhead')?.remove();
    }

    window.playTape = (btn) => {
        const tapeItem = btn.closest('.tape-item');
        tapeItem.style.background = '#000080';
        tapeItem.style.color = 'white';
        setTimeout(() => {
            tapeItem.style.background = '';
            tapeItem.style.color = '';
        }, 1000);
    };

    window.deleteTape = (btn) => {
        if (confirm("Delete this tape forever?")) {
            btn.closest('.tape-item').remove();
        }
    };

    function addNewTape() {
        const tapeName = document.getElementById('tape-name').value;
        const newTape = {
            name: `${tapeName}.wav`,
            date: new Date().toISOString().split('T')[0],
            duration: `${Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
        };

        const tapeList = document.getElementById('tape-list');
        tapeList.innerHTML += `
            <div class="tape-item p-1" style="border-bottom: 1px solid #808080;">
                <span>${newTape.name}</span>
                <div class="d-flex justify-content-between">
                    <small>${newTape.date}</small>
                    <div>
                        <span class="me-2">${newTape.duration}</span>
                        <button class="btn btn-xs" onclick="playTape(this)">▶</button>
                        <button class="btn btn-xs" onclick="deleteTape(this)">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    }
}

// Add retro styling
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .sound-recorder {
            font-family: 'Arial', sans-serif;
        }
        #record-btn, #stop-btn, #play-btn {
            background: #c0c0c0;
            border: 2px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
            color: black;
        }
        #record-btn:active, #stop-btn:active, #play-btn:active {
            border-color: #808080 #ffffff #ffffff #808080;
        }
        .waveform-display {
            border-style: inset !important;
        }
        .tape-item:hover {
            background: #a0a0a0 !important;
        }
        @keyframes blink {
            50% { opacity: 0; }
        }
        #recording-status {
            animation: blink 1s infinite;
        }
    `;
    document.head.appendChild(style);
});