// WordPad.js
function openWordPad() {
    const wordPadContent = `
        <div class="wordpad-container">
            <div class="toolbar mb-2">
                <div class="d-flex flex-wrap gap-1">
                    <select id="fontFamily" class="form-select-sm" style="width: 120px;">
                        <option>Arial</option>
                        <option>Times New Roman</option>
                        <option>Courier New</option>
                        <option>Comic Sans MS</option>
                    </select>
                    <select id="fontSize" class="form-select-sm" style="width: 60px;">
                        ${Array.from({length: 24}, (_, i) => `<option>${i + 8}</option>`).join('')}
                    </select>
                    <button class="btn btn-sm" onclick="formatText('bold')"><b>B</b></button>
                    <button class="btn btn-sm" onclick="formatText('italic')"><i>I</i></button>
                    <button class="btn btn-sm" onclick="formatText('underline')"><u>U</u></button>
                    <input type="color" id="colorPicker" class="form-control form-control-sm" style="width: 40px;">
                    <div class="btn-group">
                        <button class="btn btn-sm" onclick="setAlignment('left')">←</button>
                        <button class="btn btn-sm" onclick="setAlignment('center')">↔</button>
                        <button class="btn btn-sm" onclick="setAlignment('right')">→</button>
                    </div>
                </div>
            </div>
            
            <div id="editor" 
                 contenteditable="true" 
                 class="editor-area" 
                 style="height: 300px; border: 2px inset; background: white; padding: 10px; overflow-y: auto;">
                Start typing here...
            </div>
            
            <div class="status-bar mt-2 p-1" style="background: #c0c0c0; border: 2px inset;">
                <span id="charCount">Characters: 0</span> | 
                <span id="wordCount">Words: 0</span>
            </div>
        </div>
    `;

    createWindow('wordpad', 'WordPad', wordPadContent);
    initializeWordPad();
}

function initializeWordPad() {
    // Initialize font controls
    const editor = document.getElementById('editor');
    const fontFamily = document.getElementById('fontFamily');
    const fontSize = document.getElementById('fontSize');
    
    fontFamily.value = 'Arial';
    fontSize.value = '12';
    
    fontFamily.addEventListener('change', () => {
        document.execCommand('fontName', false, fontFamily.value);
    });
    
    fontSize.addEventListener('change', () => {
        document.execCommand('fontSize', false, fontSize.value);
    });

    // Color picker
    document.getElementById('colorPicker').addEventListener('input', (e) => {
        document.execCommand('foreColor', false, e.target.value);
    });

    // Update character/word count
    editor.addEventListener('input', updateCounts);
    
    // Initial counts
    updateCounts();
}

function formatText(command) {
    document.execCommand(command, false, null);
    document.getElementById('editor').focus();
}

function setAlignment(align) {
    document.execCommand('justify' + align.charAt(0).toUpperCase() + align.slice(1));
    document.getElementById('editor').focus();
}

function updateCounts() {
    const text = document.getElementById('editor').innerText;
    const charCount = text.length;
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    document.getElementById('charCount').textContent = `Characters: ${charCount}`;
    document.getElementById('wordCount').textContent = `Words: ${wordCount}`;
}

// Add retro styling
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .wordpad-container {
            font-family: 'Arial', sans-serif;
        }
        .toolbar button {
            background: #c0c0c0;
            border: 2px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
        }
        .toolbar button:active {
            border-color: #808080 #ffffff #ffffff #808080;
        }
        .editor-area:focus {
            outline: 2px solid #000080;
        }
        .form-select-sm {
            background: white;
            border: 2px inset;
        }
        .status-bar {
            font-size: 0.9em;
        }
    `;
    document.head.appendChild(style);
});