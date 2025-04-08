// PowerShell.js
let psHistory = [];
let psHistoryIndex = -1;
let currentLocation = "C:\\WebOS93\\PS";

function openPowerShell() {
    const psContent = `
        <div class="powershell">
            <div class="ps-output" id="ps-output"></div>
            <div class="input-line">
                <span class="prompt">PS ${currentLocation}&gt;</span>
                <input type="text" class="ps-input" id="ps-input" autocomplete="off">
            </div>
        </div>
    `;

    createWindow('powershell', 'Windows PowerShell', psContent);
    setupPowerShell();
}

function setupPowerShell() {
    const output = document.getElementById('ps-output');
    const input = document.getElementById('ps-input');
    
    input.focus();
    
    appendPsOutput(`Windows PowerShell\nCopyright (C) 2024 WebOS93. All rights reserved.\nType 'help' for assistance.\n`);

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = input.value.trim();
            if (command) {
                psHistory.unshift(command);
                psHistoryIndex = -1;
                processPsCommand(command);
                input.value = '';
            }
        }
        
        if (e.key === 'ArrowUp') {
            if (psHistoryIndex < psHistory.length - 1) {
                psHistoryIndex++;
                input.value = psHistory[psHistoryIndex];
            }
        }
        if (e.key === 'ArrowDown') {
            if (psHistoryIndex > 0) {
                psHistoryIndex--;
                input.value = psHistory[psHistoryIndex];
            } else {
                psHistoryIndex = -1;
                input.value = '';
            }
        }
    });
}

function appendPsOutput(text, color = 'white') {
    const output = document.getElementById('ps-output');
    output.innerHTML += `<span style="color: ${color}">${text}</span>\n`;
    output.scrollTop = output.scrollHeight;
}

function processPsCommand(cmd) {
    const args = cmd.split(' ');
    const command = args[0].toLowerCase();
    const output = document.getElementById('ps-output');
    
    appendPsOutput(`PS ${currentLocation}&gt; ${cmd}`);

    const cmdlets = {
        help: () => `
Available commands:
- Get-Process ............. Show running processes
- Get-Service ............ List system services
- Get-ChildItem ........... List directory items
- Start-Hack ............. Initiate system hack
- Clear-Host ............. Clear the screen
- Get-Help [command] ...... Show command help
- Stop-Process [name] .... Terminate process
- Set-Location [path] .... Change directory
- Get-Random ............. Generate random number
- Exit .................. Close PowerShell
        `,
        'get-process': () => {
            const processes = ['System', 'Explorer', 'PowerShell', 'Antivirus', 'WebBrowser'];
            return processes.map(p => ({
                Name: p,
                Id: Math.floor(Math.random() * 10000),
                CPU: (Math.random() * 100).toFixed(1)
            })).map(p => `${p.Id} ${p.Name.padEnd(15)} ${p.CPU}%`).join('\n');
        },
        'get-service': () => {
            const services = [
                { Name: 'WinUpdate', Status: 'Running' },
                { Name: 'NetShare', Status: 'Stopped' },
                { Name: 'TimeSync', Status: 'Running' }
            ];
            return services.map(s => `${s.Status.padEnd(10)} ${s.Name}`).join('\n');
        },
        'get-childitem': () => {
            const items = [
                { Name: 'Documents', Type: 'Directory' },
                { Name: 'system.ini', Type: 'File' },
                { Name: 'Downloads', Type: 'Directory' }
            ];
            return items.map(i => `${i.Type.padEnd(14)} ${i.Name}`).join('\n');
        },
        'start-hack': () => {
            appendPsOutput('Initiating system hack...', '#0f0');
            let progress = 0;
            const hackInterval = setInterval(() => {
                progress += Math.random() * 10;
                if (progress >= 100) {
                    clearInterval(hackInterval);
                    appendPsOutput('SYSTEM HACKED SUCCESSFULLY!', '#0f0');
                    document.querySelector('.powershell').style.background = 'linear-gradient(45deg, #000, #030)';
                } else {
                    appendPsOutput(`Bypassing security... ${Math.min(100, progress.toFixed(0))}%`, '#0f0');
                }
            }, 500);
        },
        'clear-host': () => output.innerHTML = '',
        'set-location': () => {
            currentLocation = args[1] || currentLocation;
            return `Path\n----\n${currentLocation}`;
        },
        'stop-process': () => {
            if (args[1]) {
                return `Process '${args[1]}' terminated successfully`;
            }
            return 'Please specify a process name';
        },
        'get-random': () => `Random number: ${Math.floor(Math.random() * 1000)}`,
        'exit': () => closeWindow('powershell'),
        '_default': () => `The term '${command}' is not recognized as a cmdlet.`
    };

    try {
        const result = cmdlets[command] ? cmdlets[command]() : cmdlets._default();
        appendPsOutput(typeof result === 'string' ? result : '');
    } catch (error) {
        appendPsOutput(`ERROR: ${error.message}`, 'red');
    }
}

// Add PowerShell styles
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .powershell {
            background: #012456;
            color: #ffffff;
            padding: 10px;
            font-family: 'Consolas', monospace;
            height: 100%;
        }
        .ps-output {
            height: calc(100% - 30px);
            overflow-y: auto;
            white-space: pre-wrap;
        }
        .input-line {
            display: flex;
            align-items: center;
            border-top: 1px solid #3a3a3a;
            padding-top: 5px;
        }
        .prompt {
            margin-right: 5px;
            color: #00ff00;
        }
        .ps-input {
            background: transparent;
            border: none;
            color: #ffffff;
            font-family: 'Consolas', monospace;
            flex-grow: 1;
            outline: none;
        }
        @keyframes hack {
            0% { text-shadow: 0 0 5px #0f0; }
            50% { text-shadow: 0 0 10px #0f0; }
            100% { text-shadow: 0 0 5px #0f0; }
        }
        .hack-animation {
            animation: hack 0.5s infinite;
        }
    `;
    document.head.appendChild(style);
});