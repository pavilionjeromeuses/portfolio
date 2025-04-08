// WindowsSandbox.js
function openWindowsSandbox() {
    const sandboxContent = `
        <div class="sandbox-env">
            <div class="sandbox-desktop" style="height: 400px; background: #008080; position: relative;">
                <!-- Desktop Icons -->
                <div class="desktop-icon" onclick="openSandboxApp('notepad')" style="left: 20px; top: 20px">
                    <img src="https://win98icons.alexmeub.com/icons/png/notepad-1.png" class="icon-img">
                    <div>Sandpad</div>
                </div>
                <div class="desktop-icon" onclick="openSandboxApp('paint')" style="left: 20px; top: 120px">
                    <img src="IMGs/StartMenuFileExplorer/WindowsSandboxSandPaintPNG.png" class="icon-img">
                    <div>SandPaint</div>
                </div>
                
                <!-- Running Apps Container -->
                <div id="sandbox-apps"></div>
                
                <!-- Taskbar -->
                <div class="taskbar" style="position: absolute; bottom: 0; width: 100%">
                    <button class="start-button" onclick="toggleSandboxMenu()">▶️ Start</button>
                    <div class="d-flex align-items-center">
                        <span id="sandbox-clock">--:-- --</span>
                    </div>
                </div>
            </div>
            
            <!-- Start Menu -->
            <div class="start-menu" id="sandbox-menu" style="bottom: 40px; left: 5px; display: none">
                <div class="p-2 border-bottom">Sandbox Menu</div>
                <div class="p-2" onclick="openSandboxApp('notepad')">📝 Sandpad</div>
                <div class="p-2" onclick="openSandboxApp('paint')">🎨 SandPaint</div>
                <div class="p-2" onclick="openSandboxApp('game')">🎮 Cookie Baker</div>
                <div class="p-2" onclick="crashSandbox()">💥 Crash Test</div>
            </div>
        </div>
    `;

    createWindow('windows-sandbox', 'Windows Sandbox', sandboxContent);
    initializeSandbox();
}

function initializeSandbox() {
    // Sandbox clock
    function updateSandboxClock() {
        const now = new Date();
        document.getElementById('sandbox-clock').textContent = 
            now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    setInterval(updateSandboxClock, 1000);
    updateSandboxClock();

    // Initialize apps
    window.openSandboxApp = (app) => {
        const apps = {
            notepad: {
                title: 'Sandpad',
                content: `
                    <textarea style="width: 100%; height: 100%; 
                        background: #ffffff; border: none">Welcome to Sandbox Notepad!</textarea>`
            },
            paint: {
                title: 'SandPaint',
                content: `
                    <canvas id="sandpaint-canvas" width="300" height="200" 
                        style="border: 2px inset #808080"></canvas>
                    <div class="mt-2">
                        <button class="btn btn-sm btn-secondary" onclick="changeColor('red')">🔴</button>
                        <button class="btn btn-sm btn-secondary" onclick="changeColor('blue')">🔵</button>
                        <button class="btn btn-sm btn-secondary" onclick="changeColor('green')">🟢</button>
                        <button class="btn btn-sm btn-danger" onclick="clearCanvas()">Clear</button>
                    </div>`
            },
            game: {
                title: 'Cookie Baker',
                content: `
                    <div class="text-center">
                        <h3>🍪 Cookies: <span id="cookie-count">0</span></h3>
                        <button class="btn btn-lg btn-warning" onclick="bakeCookie()">
                            Bake Cookie!
                        </button>
                        <div class="mt-2">
                            <button class="btn btn-sm btn-secondary" onclick="buyCursor()">
                                Buy Auto-Baker (🪙 10)
                            </button>
                        </div>
                    </div>`
            }
        };

        createSandboxWindow(apps[app].title, apps[app].content);
        if (app === 'paint') initializePaint();
    };

    window.toggleSandboxMenu = () => {
        const menu = document.getElementById('sandbox-menu');
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    };

    window.crashSandbox = () => {
        document.getElementById('sandbox-apps').innerHTML = `
            <div class="bsod" style="position: absolute; width: 100%; height: 100%;
                background: #000080; color: white; padding: 20px; z-index: 9999">
                <h1>💥 SANDBOX_ERROR</h1>
                <p>An error has occurred in the sandbox environment.</p>
                <p>Please shut down and restart your imaginary computer.</p>
                <p>Error Code: 0xSANDB0X</p>
                <button class="btn btn-danger" onclick="closeWindow('windows-sandbox')">
                    Emergency Shutdown
                </button>
            </div>`;
    };
}

function createSandboxWindow(title, content) {
    const windowId = `sandbox-${title.toLowerCase()}`;
    const windowHtml = `
        <div class="window" style="left: ${Math.random() * 200}px; top: ${Math.random() * 100}px">
            <div class="title-bar">
                <span>${title}</span>
                <div>
                    <button class="btn btn-xs btn-danger mx-1">—</button>
                    <button class="btn btn-xs btn-warning mx-1">□</button>
                    <button class="btn btn-xs btn-success mx-1" 
                        onclick="document.getElementById('${windowId}').remove()">×</button>
                </div>
            </div>
            <div class="window-content">${content}</div>
        </div>`;

    const existing = document.getElementById(windowId);
    if (!existing) {
        const div = document.createElement('div');
        div.id = windowId;
        div.innerHTML = windowHtml;
        document.getElementById('sandbox-apps').appendChild(div);
        $(div).draggable({ handle: ".title-bar" });
    }
}

// Paint functions
function initializePaint() {
    const canvas = document.getElementById('sandpaint-canvas');
    const ctx = canvas.getContext('2d');
    let painting = false;
    let color = 'black';

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    window.changeColor = (newColor) => {
        color = newColor;
        ctx.strokeStyle = color;
    };

    window.clearCanvas = () => {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // Drawing functionality
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);

    function startPosition(e) {
        painting = true;
        draw(e);
    }

    function endPosition() {
        painting = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!painting) return;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
}

// Cookie game functions
let cookies = 0;
let autoBakers = 0;

window.bakeCookie = () => {
    cookies++;
    updateCookieDisplay();
};

window.buyCursor = () => {
    if (cookies >= 10) {
        cookies -= 10;
        autoBakers++;
        updateCookieDisplay();
        startAutoBaking();
    }
};

function updateCookieDisplay() {
    const countElement = document.getElementById('cookie-count');
    if (countElement) countElement.textContent = cookies;
}

function startAutoBaking() {
    if (!window.autoBakerInterval) {
        window.autoBakerInterval = setInterval(() => {
            cookies += autoBakers;
            updateCookieDisplay();
        }, 1000);
    }
}

// Style initialization
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .sandbox-desktop .desktop-icon {
            position: absolute;
            color: white;
            text-shadow: 1px 1px black;
            cursor: pointer;
            width: 80px;
            text-align: center;
        }
        .sandbox-desktop .window {
            z-index: 1000;
        }
        #sandpaint-canvas {
            background: white;
        }
        .bsod {
            font-family: 'Arial', sans-serif;
            cursor: default;
        }
    `;
    document.head.appendChild(style);
});