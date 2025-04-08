// Narrator.js
let isSpeaking = false;
let currentVoice = 0;
let voices = [];
let speechQueue = [];

function openNarrator() {
    const narratorContent = `
        <div class="narrator">
            <div class="status-bar">
                <div class="led ${isSpeaking ? 'active' : ''}"></div>
                <span>${isSpeaking ? 'Speaking...' : 'Ready'}</span>
            </div>
            
            <div class="text-input">
                <textarea id="narratorText" placeholder="Enter text to speak..." rows="4"></textarea>
            </div>
            
            <div class="controls">
                <div class="control-group">
                    <label>Voice:</label>
                    <select id="voiceSelect" onchange="changeVoice(this.value)"></select>
                </div>
                
                <div class="control-group">
                    <label>Speed:</label>
                    <input type="range" min="0.5" max="2" step="0.1" value="1" 
                        oninput="updateRate(this.value)">
                    <span id="rateValue">1x</span>
                </div>
                
                <div class="button-group">
                    <button class="btn btn-sm" onclick="speak()" ${isSpeaking ? 'disabled' : ''}>▶️ Speak</button>
                    <button class="btn btn-sm" onclick="stop()">⏹️ Stop</button>
                    <button class="btn btn-sm" onclick="togglePunctuation()">🔣 ${localStorage.punctuationMode === 'on' ? 'Punc: On' : 'Punc: Off'}</button>
                </div>
            </div>
            
            <div class="keyboard">
                ${['!', '@', '#', '$', '%', '^', '&', '*'].map(char => `
                    <button class="btn btn-sm" onclick="insertChar('${char}')">${char}</button>
                `).join('')}
            </div>
        </div>
    `;

    createWindow('narrator', 'Screen Narrator', narratorContent);
    initializeVoices();
}

function initializeVoices() {
    // Simulated classic voices
    voices = [
        { name: 'Microsoft Sam', lang: 'en-US' },
        { name: 'Microsoft Mary', lang: 'en-US' },
        { name: 'Microsoft Mike', lang: 'en-US' }
    ];
    
    const voiceSelect = document.getElementById('voiceSelect');
    voiceSelect.innerHTML = voices.map((voice, index) => `
        <option value="${index}">${voice.name}</option>
    `).join('');
}

function speak() {
    const text = document.getElementById('narratorText').value;
    if(!text) return;

    isSpeaking = true;
    updateStatus();
    simulateSpeech(text);
}

function stop() {
    isSpeaking = false;
    speechQueue = [];
    updateStatus();
}

function simulateSpeech(text) {
    const words = text.split(' ');
    let index = 0;
    
    const speakNextWord = () => {
        if(!isSpeaking || index >= words.length) {
            isSpeaking = false;
            updateStatus();
            return;
        }
        
        const word = words[index];
        const punctuation = localStorage.punctuationMode === 'on' ? ' ' : '';
        
        // Simulate voice output
        console.log(`Speaking: ${word}`);
        speechQueue.push({ word, voice: voices[currentVoice].name });
        
        index++;
        setTimeout(speakNextWord, Math.random() * 500 + 200);
    };
    
    speakNextWord();
}

function changeVoice(index) {
    currentVoice = parseInt(index);
    console.log(`Switched to voice: ${voices[currentVoice].name}`);
}

function updateRate(value) {
    document.getElementById('rateValue').textContent = `${value}x`;
}

function togglePunctuation() {
    localStorage.punctuationMode = localStorage.punctuationMode === 'on' ? 'off' : 'on';
    document.querySelector('.button-group button:last-child').textContent = 
        `🔣 ${localStorage.punctuationMode === 'on' ? 'Punc: On' : 'Punc: Off'}`;
}

function insertChar(char) {
    const textarea = document.getElementById('narratorText');
    textarea.value += char;
}

function updateStatus() {
    const statusBar = document.querySelector('.status-bar');
    statusBar.querySelector('.led').classList.toggle('active', isSpeaking);
    statusBar.querySelector('span').textContent = 
        isSpeaking ? 'Speaking...' : 'Ready';
}

// Add Narrator styles
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .narrator {
            background: #c0c0c0;
            padding: 10px;
            border: 3px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
        }
        .status-bar {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
            font-family: 'Arial', sans-serif;
        }
        .led {
            width: 12px;
            height: 12px;
            border: 2px solid #808080;
            background: #800000;
        }
        .led.active {
            background: #008000;
        }
        .text-input textarea {
            width: 100%;
            margin-bottom: 10px;
            border: 2px solid #808080;
            padding: 5px;
            font-family: 'Courier New', monospace;
        }
        .controls {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 10px;
        }
        .control-group {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        select, input[type="range"] {
            border: 2px solid #808080;
            background: #ffffff;
        }
        .button-group {
            display: flex;
            gap: 5px;
        }
        .keyboard {
            display: grid;
            grid-template-columns: repeat(8, 1fr);
            gap: 2px;
        }
        .btn {
            border: 2px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
            background: #c0c0c0;
            min-width: 40px;
        }
        .btn:active {
            border-color: #808080 #ffffff #ffffff #808080;
        }
    `;
    document.head.appendChild(style);
});