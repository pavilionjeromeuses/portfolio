// CommandPrompt.js
let commandHistory = [];
let historyIndex = -1;

function openCommandPrompt() {
    const cmdContent = `
        <div class="terminal">
            <div class="terminal-output" id="cmd-output"></div>
            <div class="input-line">
                <span class="prompt">C:\WebOS93&gt;</span>
                <input type="text" class="cmd-input" id="cmd-input" autocomplete="off">
            </div>
        </div>
    `;

    createWindow('command-prompt', 'Command Prompt', cmdContent);
    setupTerminal();
}

function setupTerminal() {
    const output = document.getElementById('cmd-output');
    const input = document.getElementById('cmd-input');
    
    input.focus();
    
    // Add ASCII art
    appendOutput(`Microsoft(R) WebOS93 Terminal\n(c) 2024 WebOS Corporation. All rights reserved.\nType "help" for available commands\n`);

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = input.value.trim();
            if (command) {
                commandHistory.unshift(command);
                historyIndex = -1;
                processCommand(command);
                input.value = '';
            }
        }
        
        // History navigation
        if (e.key === 'ArrowUp') {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex];
            }
        }
        if (e.key === 'ArrowDown') {
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex];
            } else {
                historyIndex = -1;
                input.value = '';
            }
        }
    });
}

function appendOutput(text) {
    const output = document.getElementById('cmd-output');
    output.innerHTML += text + '\n';
    output.scrollTop = output.scrollHeight;
}

function processCommand(cmd) {
    const args = cmd.split(' ');
    const command = args[0].toLowerCase();
    const output = document.getElementById('cmd-output');
    
    appendOutput(`C:\WebOS93&gt; ${cmd}`);

    const commands = {
        help: () => `
Available commands:
- help ........ Show this help
- echo [text] . Display message
- cls ......... Clear screen
- time ........ Show current time
- matrix ...... Enter the Matrix
- game ........ Start text adventure
- color [hex] . Change text color
- dir ......... List directory (simulated)
- ver ......... Show OS version
- shutdown .... Close terminal
        `,
        echo: () => args.slice(1).join(' '),
        cls: () => output.innerHTML = '',
        time: () => new Date().toLocaleTimeString(),
        matrix: () => startMatrixEffect(),
        game: () => startTextAdventure(),
        color: () => {
            const color = args[1] || '#0f0';
            document.querySelector('.terminal').style.color = color;
            return `Text color changed to ${color}`;
        },
        dir: () => ` Volume in drive C is WEBOS93\n Directory of C:\\WebOS93\n\nSYSTEM~1  DIR\nCOMMAND~1 EXE\nCONFIG   SYS\n${Math.floor(Math.random()*100)} file(s)  ${Math.floor(Math.random()*1000)}KB free`,
        ver: () => `WebOS93 Terminal v1.0 (Build 9501)`,
        shutdown: () => closeWindow('command-prompt'),
        _default: () => `'${command}' is not recognized as an internal or external command, operable program or batch file.`
    };

    const result = commands[command] ? commands[command]() : commands._default();
    appendOutput(typeof result === 'string' ? result : '');
}

function startMatrixEffect() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    const output = document.getElementById('cmd-output');
    output.innerHTML = '';
    let running = true;

    const matrixInterval = setInterval(() => {
        if (!running) return;
        const col = document.createElement('div');
        col.style.whiteSpace = 'pre';
        
        for (let i = 0; i < 50; i++) {
            col.textContent += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        output.appendChild(col);
        output.scrollTop = output.scrollHeight;
    }, 100);

    document.getElementById('cmd-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            running = false;
            clearInterval(matrixInterval);
            appendOutput('\nMatrix simulation terminated');
        }
    });
}

function startTextAdventure() {
    let state = { room: 1 };
    appendOutput(`Welcome to Text Adventure!\nYou're in a dark room. Exits: NORTH, EAST\n>`);
    
    const processGameCommand = (cmd) => {
        const action = cmd.toLowerCase();
        switch(state.room) {
            case 1:
                if (action === 'north') {
                    state.room = 2;
                    return `You enter a forest clearing. There's a sword here.\nExits: SOUTH\n>`;
                }
                if (action === 'east') {
                    return `You hit a wall. Ouch!\n>`;
                }
                return `Invalid command\n>`;
            case 2:
                if (action === 'south') {
                    state.room = 1;
                    return `Returned to dark room\n>`;
                }
                return `Invalid command\n>`;
        }
    };

    const input = document.getElementById('cmd-input');
    const originalHandler = input.onkeydown;
    
    input.onkeydown = (e) => {
        if (e.key === 'Enter') {
            const result = processGameCommand(input.value);
            appendOutput(input.value + '\n' + result);
            input.value = '';
        }
    };

    document.querySelector('.window').addEventListener('click', () => {
        input.onkeydown = originalHandler;
    });
}

// Add terminal styles
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .terminal {
            background: #000;
            color: #0f0;
            padding: 10px;
            font-family: 'Courier New', monospace;
            height: 100%;
        }
        .terminal-output {
            height: calc(100% - 30px);
            overflow-y: auto;
            white-space: pre-wrap;
        }
        .input-line {
            display: flex;
            align-items: center;
            border-top: 1px solid #0f0;
            padding-top: 5px;
        }
        .prompt {
            margin-right: 5px;
        }
        .cmd-input {
            background: transparent;
            border: none;
            color: #0f0;
            font-family: 'Courier New', monospace;
            flex-grow: 1;
            outline: none;
        }
        @keyframes blink {
            50% { opacity: 0; }
        }
        .cursor {
            animation: blink 1s step-end infinite;
        }
    `;
    document.head.appendChild(style);
});