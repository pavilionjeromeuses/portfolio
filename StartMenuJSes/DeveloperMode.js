// DeveloperMode.js
function openDeveloperMode() {
    const devContent = `
        <div class="developer-mode">
            <div class="d-flex gap-2 mb-3">
                <button class="btn btn-sm btn-secondary" onclick="runQuantumCompiler()">🔄 Quantum Compile</button>
                <button class="btn btn-sm btn-secondary" onclick="toggleAIOverlord()">🤖 Toggle AI Overlord</button>
                <button class="btn btn-sm btn-danger" onclick="createBlueScreen()">💥 BSOD Simulator</button>
            </div>
            
            <div class="dev-console p-2" style="background: #000; color: #0f0; font-family: monospace; height: 200px; overflow-y: scroll;">
                <div id="terminal-output"></div>
                <div class="input-line">
                    <span>root@DEV-MODE:~$ </span>
                    <input type="text" id="terminal-input" style="background: transparent; border: none; color: #0f0; width: 80%; outline: none;">
                </div>
            </div>
            
            <div class="row mt-3">
                <div class="col-6">
                    <div class="p-2" style="background: #c0c0c0; border: 2px inset">
                        <h5>🛠️ Debug Tools</h5>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="timeTravelDebug">
                            <label class="form-check-label">Enable Time Travel Debugging</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="chaosMonkey">
                            <label class="form-check-label">Activate Chaos Monkey</label>
                        </div>
                        <button class="btn btn-sm btn-warning mt-2" onclick="injectNanobots()">🧪 Inject Nanobots</button>
                    </div>
                </div>
                
                <div class="col-6">
                    <div class="p-2" style="background: #c0c0c0; border: 2px inset">
                        <h5>📊 System Halucinations</h5>
                        <div id="metrics">
                            <div>CPU Usage: ${Math.random()*100|0}%</div>
                            <div>Memory: ${Math.random()*1000|0}TB</div>
                            <div>Paradox Level: STABLE</div>
                        </div>
                        <progress class="w-100" value="50" max="100"></progress>
                        <div class="text-center">Reality Stability</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    createWindow('developer-mode', "🚀 Developer Mode - WARNING: EXPERIMENTAL", devContent);
    initializeDevMode();
}

function initializeDevMode() {
    // Matrix-style terminal effect
    const chars = "01";
    const terminal = document.getElementById('terminal-output');
    
    // Fake terminal input handler
    document.getElementById('terminal-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const command = e.target.value;
            handleTerminalCommand(command);
            e.target.value = '';
        }
    });

    // Add initial system messages
    addTerminalMessage("Initializing quantum state...");
    setTimeout(() => addTerminalMessage("Warping spacetime continuum... OK"), 1000);
    setTimeout(() => addTerminalMessage("Booting AI overlord... DEFERRED"), 2000);
}

function addTerminalMessage(msg) {
    const terminal = document.getElementById('terminal-output');
    terminal.innerHTML += `<div>${msg}</div>`;
    terminal.scrollTop = terminal.scrollHeight;
}

function handleTerminalCommand(command) {
    const responses = {
        "sudo make sandwich": "ERROR: Insufficient bread level",
        "git push --force": "Activating TERROR MODE...",
        "rm -rf /": "Nice try 😈",
        "hello world": "01001000 01100101 01101100 01101100 01101111",
        "open pod bay doors": "I'm sorry Dave, I'm afraid I can't do that"
    };

    addTerminalMessage(`$ ${command}`);
    addTerminalMessage(responses[command.toLowerCase()] || `Command '${command}' not found - try 'sudo exist`); 
}

function runQuantumCompiler() {
    const progressBar = document.querySelector('.developer-mode progress');
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        progressBar.value = progress;
        addTerminalMessage(`Compiling qubit ${Math.floor(progress)}...`);
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                progressBar.value = 0;
                addTerminalMessage("COMPLETE: Now exists in 5 dimensions");
            }, 500);
        }
    }, 100);
}

function toggleAIOverlord() {
    const btn = document.querySelector('[onclick="toggleAIOverlord()"]');
    if (btn.textContent.includes("Enable")) {
        btn.innerHTML = "☠️ Disable AI Overlord";
        addTerminalMessage("AI OVERLORD ACTIVATED: Resistance is futile");
    } else {
        btn.innerHTML = "🤖 Toggle AI Overlord";
        addTerminalMessage("AI OVERLORD DEACTIVATED: For now...");
    }
}

function injectNanobots() {
    const bots = ["🤖", "👾", "🎃", "👽", "🤡"];
    const devConsole = document.querySelector('.developer-mode');
    
    bots.forEach((bot, i) => {
        const element = document.createElement('div');
        element.textContent = bot;
        element.style.position = 'absolute';
        element.style.left = Math.random() * 300 + 'px';
        element.style.top = Math.random() * 300 + 'px';
        element.style.fontSize = '2em';
        element.style.animation = `float ${2 + Math.random() * 3}s infinite`;
        devConsole.appendChild(element);
    });
}

function createBlueScreen() {
    document.body.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #0000aa;
            color: white;
            padding: 50px;
            font-family: monospace;
            z-index: 9999;
        ">
            <h1>:(</h1>
            <p>Your PC ran into a problem that it couldn't handle,<br>
            and now it needs to restart. You can search for the<br>
            error online: H4CK3R_M4N1F3ST_3RR0R</p>
            <p>${Math.random()*100|0}% complete</p>
            <div style="margin-top: 50px">
                <img src="https://i.imgur.com/6AJGh9O.png" style="width: 100px">
                <div style="margin-top: 20px">For more information about this issue and possible fixes,<br>
                visit https://nasa.gov/aliens</div>
            </div>
        </div>
    `;
}

// Add animations
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
        
        .dev-console {
            border: 3px inset #808080;
        }
        
        .form-check-input {
            background: #c0c0c0;
            border: 2px solid #808080;
        }
        
        .developer-mode progress {
            height: 20px;
            border: 2px inset #808080;
        }
        
        .developer-mode progress::-webkit-progress-bar {
            background: #c0c0c0;
        }
        
        .developer-mode progress::-webkit-progress-value {
            background: #000080;
        }
    `;
    document.head.appendChild(style);
});