// SpeechRecognition.js
function openSpeechRecognition() {
    const speechContent = `
        <div class="speech-recognition">
            <div class="status-bar mb-3 p-2" style="background: #000080; color: white;">
                🎤 <span id="recognition-status">Ready</span>
            </div>
            
            <div class="transcript-box p-2 mb-3" 
                 style="height: 200px; border: 2px inset #808080; overflow-y: auto; background: white;">
                <div id="transcript-display"></div>
            </div>
            
            <div class="controls d-flex justify-content-between align-items-center">
                <button class="btn btn-secondary" id="start-btn" onclick="toggleRecognition()">
                    ▶ Start Listening
                </button>
                <div class="visual-feedback" id="visual-feedback">
                    ${Array(3).fill('<div class="audio-bar"></div>').join('')}
                </div>
            </div>
            
            <div class="mt-3 p-2" style="background: #c0c0c0;">
                <strong>💡 Try saying:</strong>
                <ul class="mb-0">
                    <li>"Hello computer"</li>
                    <li>"Make it rain"</li>
                    <li>"Open the pod bay doors"</li>
                </ul>
            </div>
        </div>
    `;

    createWindow('speech-recognition', 'Voice Commander 95', speechContent);
    initializeSpeechRecognition();
}

function initializeSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let isListening = false;
    
    if (!SpeechRecognition) {
        document.getElementById('start-btn').disabled = true;
        document.getElementById('recognition-status').textContent = "API not supported";
        return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
        
        const display = document.getElementById('transcript-display');
        display.innerHTML += `<div>${transcript}</div>`;
        display.scrollTop = display.scrollHeight;
        
        processVoiceCommand(transcript.toLowerCase());
    };

    recognition.onerror = (event) => {
        document.getElementById('recognition-status').textContent = `Error: ${event.error}`;
    };

    recognition.onstart = () => {
        isListening = true;
        document.getElementById('recognition-status').textContent = "Listening...";
        document.getElementById('start-btn').textContent = "⏹ Stop Listening";
        startVisualFeedback();
    };

    recognition.onend = () => {
        isListening = false;
        document.getElementById('recognition-status').textContent = "Ready";
        document.getElementById('start-btn').textContent = "▶ Start Listening";
        stopVisualFeedback();
    };

    window.toggleRecognition = () => {
        if (!isListening) {
            recognition.start();
        } else {
            recognition.stop();
        }
    };

    function startVisualFeedback() {
        const bars = document.querySelectorAll('.audio-bar');
        let count = 0;
        
        const animation = setInterval(() => {
            bars.forEach((bar, index) => {
                const height = Math.random() * 30 + 5;
                bar.style.height = `${height}px`;
                bar.style.backgroundColor = `hsl(${count * 10}, 70%, 50%)`;
            });
            count++;
        }, 100);
        
        window.visualFeedbackInterval = animation;
    }

    function stopVisualFeedback() {
        clearInterval(window.visualFeedbackInterval);
        document.querySelectorAll('.audio-bar').forEach(bar => {
            bar.style.height = "5px";
            bar.style.backgroundColor = "#000080";
        });
    }

    window.processVoiceCommand = (command) => {
        const easterEggs = {
            'hello computer': () => alert("Why hello there, human!"),
            'make it rain': () => document.body.style.background = "linear-gradient(to bottom, #000080, #008080)",
            'open the pod bay doors': () => alert("I'm sorry Dave, I'm afraid I can't do that"),
            'what is the meaning of life': () => alert("42, obviously"),
            'activate turbo mode': () => document.title = "⚡TURBO MODE⚡ " + document.title,
            'give me money': () => {
                const moneyDisplay = document.createElement('div');
                moneyDisplay.textContent = "💵".repeat(100);
                document.getElementById('transcript-display').appendChild(moneyDisplay);
            }
        };

        for (const [key, action] of Object.entries(easterEggs)) {
            if (command.includes(key)) {
                action();
                break;
            }
        }
    };
}

// Add retro styling
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .speech-recognition {
            font-family: 'Arial', sans-serif;
        }
        #start-btn {
            background: #c0c0c0;
            border: 2px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
            color: black;
        }
        #start-btn:active {
            border-color: #808080 #ffffff #ffffff #808080;
        }
        .audio-bar {
            width: 20px;
            height: 5px;
            background: #000080;
            margin: 2px;
            transition: all 0.1s ease;
        }
        #transcript-display div {
            margin: 5px 0;
            padding: 2px;
            border-bottom: 1px dotted #808080;
        }
    `;
    document.head.appendChild(style);
});