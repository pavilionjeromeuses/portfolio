// OnScreenKeyboard.js
function openOnScreenKeyboard() {
    const keyboardContent = `
        <div class="osk-container">
            <textarea id="osk-output" 
                      rows="4" 
                      style="width: 100%; 
                             margin-bottom: 10px; 
                             border: 2px inset #808080;
                             font-family: 'Arial', sans-serif;"></textarea>
            
            <div class="keyboard-rows">
                ${generateKeyboardRows()}
            </div>
            
            <div class="d-flex justify-content-between mt-2">
                <div class="status-light" style="width: 12px; height: 12px; background: #ff0000; border: 2px solid #000;"></div>
                <span style="font-size: 0.8em;">Num Lock: OFF</span>
            </div>
        </div>
    `;

    createWindow('on-screen-keyboard', 'Virtual Keyboard', keyboardContent);
    initializeKeyboardEvents();
}

function generateKeyboardRows() {
    const keyboardLayout = [
        ['1','2','3','4','5','6','7','8','9','0','-','=','←'],
        ['q','w','e','r','t','y','u','i','o','p','[',']','\\'],
        ['a','s','d','f','g','h','j','k','l',';','\'','Enter'],
        ['⇧','z','x','c','v','b','n','m',',','.','/','⇧'],
        ['☰','Ctrl','Alt','Space','Alt','Ctrl','←','↑','→','↓']
    ];

    return keyboardLayout.map(row => `
        <div class="keyboard-row">
            ${row.map(key => `
                <div class="key ${specialKeys[key] ? 'special-key' : ''}" 
                     onclick="handleKeyPress('${key}')"
                     data-shifted="${getShiftedChar(key)}"
                     style="${getKeyStyle(key)}">
                    ${key}
                </div>
            `).join('')}
        </div>
    `).join('');
}

const specialKeys = {
    '←': 'backspace',
    'Enter': 'enter',
    '⇧': 'shift',
    '☰': 'win',
    'Ctrl': 'ctrl',
    'Alt': 'alt',
    'Space': 'space',
    '↑': 'up',
    '↓': 'down',
    '←': 'left',
    '→': 'right'
};

function getShiftedChar(key) {
    const shiftMap = {
        '1': '!', '2': '@', '3': '#', '4': '$', '5': '%',
        '6': '^', '7': '&', '8': '*', '9': '(', '0': ')',
        '-': '_', '=': '+', '[': '{', ']': '}', '\\': '|',
        ';': ':', '\'': '"', ',': '<', '.': '>', '/': '?'
    };
    return shiftMap[key] || key.toUpperCase();
}

function getKeyStyle(key) {
    const sizes = {
        '←': 'flex: 2 0 0;',
        'Enter': 'flex: 2 0 0;',
        '⇧': 'flex: 2 0 0;',
        'Space': 'flex: 5 0 0;',
        'Ctrl': 'flex: 1.5 0 0;',
        'Alt': 'flex: 1.5 0 0;'
    };
    return sizes[key] || 'flex: 1 0 0;';
}

function initializeKeyboardEvents() {
    let isShiftActive = false;
    let isCapsLock = false;
    
    window.handleKeyPress = (key) => {
        const textarea = document.getElementById('osk-output');
        const currentPos = textarea.selectionStart;
        let value = textarea.value;
        
        // Add visual feedback
        const keyElement = event.target;
        keyElement.style.borderStyle = 'inset';
        setTimeout(() => keyElement.style.borderStyle = 'outset', 100);

        switch(key) {
            case '←':
                textarea.value = value.slice(0, -1);
                break;
            case 'Enter':
                textarea.value += '\n';
                break;
            case 'Space':
                textarea.value += ' ';
                break;
            case '⇧':
                isShiftActive = !isShiftActive;
                updateKeyboardDisplay();
                break;
            default:
                const char = getCharacter(key, isShiftActive);
                textarea.value = value.slice(0, currentPos) + char + value.slice(currentPos);
                if (!isCapsLock && isShiftActive) isShiftActive = false;
        }
        
        textarea.focus();
    };

    function getCharacter(key, shifted) {
        if (key.length > 1) return '';
        return shifted ? key.toUpperCase() : key.toLowerCase();
    }

    function updateKeyboardDisplay() {
        document.querySelectorAll('.key:not(.special-key)').forEach(key => {
            const baseChar = key.textContent;
            const shiftedChar = key.dataset.shifted;
            key.textContent = isShiftActive ? shiftedChar : baseChar.toLowerCase();
        });
    }
}

// Add retro styling
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .osk-container {
            background: #c0c0c0;
            padding: 10px;
            border: 3px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
        }
        .keyboard-row {
            display: flex;
            gap: 2px;
            margin-bottom: 2px;
        }
        .key {
            background: #ffffff;
            border: 2px solid;
            border-color: #808080 #ffffff #ffffff #808080;
            padding: 8px 0;
            text-align: center;
            cursor: pointer;
            font-family: 'Arial', sans-serif;
            font-size: 0.9em;
        }
        .key:hover {
            background: #f0f0f0;
        }
        .special-key {
            background: #c0c0c0;
            font-weight: bold;
        }
        #osk-output {
            background: #ffffff;
            resize: none;
        }
    `;
    document.head.appendChild(style);
});