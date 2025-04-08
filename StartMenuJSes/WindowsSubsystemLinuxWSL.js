// WindowsSubsystemLinuxWSL.js
function openWindowsSubsystemLinuxWSL() {
    const wslContent = `
        <div class="wsl-terminal">
            <div class="terminal-bar bg-dark text-white p-2 d-flex justify-content-between">
                <span>Ubuntu 20.04 LTS</span>
                <span>WSL 2</span>
            </div>
            <div class="terminal-body bg-black text-success p-2" id="terminal-output" 
                 style="height: 400px; overflow-y: auto; font-family: 'Courier New', monospace;">
                <div>Microsoft Windows [Version 10.0.19041.329]</div>
                <div>WSL 2 Kernel Version 4.19.104-microsoft-standard</div>
                <div>──────────────────────────────────────────────</div>
                <div>Type 'help' for available commands</div>
                <div class="terminal-line">user@DESKTOP-PRETEND:~$ <span class="cursor">█</span></div>
            </div>
            <input type="text" class="form-control rounded-0" id="terminal-input" 
                   placeholder="Enter Linux command..." style="font-family: 'Courier New', monospace;">
        </div>
    `;

    createWindow('wsl-terminal', 'Windows Subsystem for Linux', wslContent);
    initializeWSLTerminal();
}

function initializeWSLTerminal() {
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');
    let currentDir = '~';
    const fileSystem = {
        '~': {
            'Documents': { type: 'dir' },
            'Downloads': { type: 'dir' },
            'file.txt': { type: 'file', content: 'This is a sample file' }
        }
    };

    // Add ASCII art for neofetch
    const neofetchArt = `
        user@DESKTOP-PRETEND
        --------------------
        OS: Fake Ubuntu 20.04 LTS x86_64
        Host: Microsoft Corporation Pretend Machine
        Kernel: 4.19.104-microsoft-fake
        Uptime: 69 days, 4 hours, 20 minutes
        Shell: bash 5.0.17
        Terminal: js-term
        CPU: Intel i7-9700K (16) @ 3.600GHz
        Memory: 16384MB
    `;

    // Command definitions
    const commands = {
        help: () => `Available commands:
            ls        List directory contents
            cd        Change directory
            cat       Display file contents
            neofetch  Display system information
            cowsay    Generate ASCII cow saying message
            cmatrix   Launch fake matrix animation
            clear     Clear terminal screen
            exit      Close terminal`,

        ls: (args) => {
            const dirContents = Object.keys(fileSystem[currentDir])
                .map(name => `${fileSystem[currentDir][name].type === 'dir' ? '📁' : '📄'} ${name}`);
            return dirContents.join('\n');
        },

        cd: (args) => {
            if (!args[0]) return currentDir;
            const newDir = args[0];
            if (fileSystem[newDir]) {
                currentDir = newDir;
                return '';
            }
            return `bash: cd: ${newDir}: No such file or directory`;
        },

        cat: (args) => {
            if (!args[0]) return 'Usage: cat [file]';
            const file = fileSystem[currentDir][args[0]];
            return file ? file.content : `cat: ${args[0]}: No such file or directory`;
        },

        neofetch: () => neofetchArt,

        cowsay: (args) => {
            const message = args.join(' ') || 'Moo!';
            return `
                ${'<'.repeat(message.length + 2)}
                ${message} 
                ${'>'.repeat(message.length + 2)}
                        \\   ^__^
                         \\  (oo)\\_______
                            (__)\\       )\\/\\
                                ||----w |
                                ||     ||
            `;
        },

        cmatrix: () => {
            startMatrixAnimation();
            return 'Pretending to launch cmatrix... Press ESC to stop';
        },

        clear: () => {
            terminalOutput.innerHTML = '';
            return '';
        },

        exit: () => {
            closeWindow('wsl-terminal');
            return '';
        }
    };

    terminalInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const commandText = terminalInput.value.trim();
            terminalInput.value = '';
            
            // Add input to output
            const inputLine = document.createElement('div');
            inputLine.className = 'terminal-line';
            inputLine.innerHTML = `user@DESKTOP-PRETEND:${currentDir}$ ${commandText}`;
            terminalOutput.appendChild(inputLine);

            // Process command
            const [cmd, ...args] = commandText.split(' ');
            const output = commands[cmd] 
                ? commands[cmd](args) 
                : `${cmd}: command not found`;

            // Add output
            if (output) {
                const outputLine = document.createElement('div');
                outputLine.textContent = output;
                terminalOutput.appendChild(outputLine);
            }

            // Add new prompt
            const newPrompt = document.createElement('div');
            newPrompt.className = 'terminal-line';
            newPrompt.innerHTML = `user@DESKTOP-PRETEND:${currentDir}$ <span class="cursor">█</span>`;
            terminalOutput.appendChild(newPrompt);
            
            // Auto-scroll to bottom
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    });

    function startMatrixAnimation() {
        const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let running = true;
        
        const animate = () => {
            if (!running) return;
            const col = document.createElement('div');
            col.style.position = 'absolute';
            col.style.left = `${Math.random() * 100}%`;
            col.style.animation = 'matrix-fall 5s linear';
            col.textContent = chars.repeat(20).split('').sort(() => 0.5 - Math.random()).join('');
            terminalOutput.appendChild(col);
            
            setTimeout(() => col.remove(), 5000);
            setTimeout(animate, Math.random() * 300);
        };

        animate();
        
        // Stop on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') running = false;
        });
    }

    // Add matrix animation style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes matrix-fall {
            from { top: -100%; }
            to { top: 100%; }
        }
        .cursor {
            animation: blink 1s infinite;
        }
        @keyframes blink {
            50% { opacity: 0; }
        }
        .terminal-line {
            white-space: pre-wrap;
            margin: 2px 0;
        }
    `;
    document.head.appendChild(style);
}