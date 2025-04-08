// CharacterMap.js
const unicodeRanges = [
    { start: 32, end: 127 },   // Basic Latin
    { start: 161, end: 255 },  // Latin-1 Supplement
    { start: 0x2500, end: 0x257F }, // Box Drawing
    { start: 0x2600, end: 0x26FF }, // Miscellaneous Symbols
    { start: 0x2700, end: 0x27BF }  // Dingbats
];

let selectedChar = null;

function openCharacterMap() {
    const charMapContent = `
        <div class="character-map">
            <div class="toolbar mb-3">
                <input type="text" id="charSearch" placeholder="Search characters..." 
                    class="search-box" oninput="filterCharacters()">
                <select id="fontSelector" onchange="filterCharacters()" class="form-select">
                    <option>Arial</option>
                    <option>Times New Roman</option>
                    <option>Courier New</option>
                </select>
            </div>
            
            <div class="char-grid" id="charGrid"></div>
            
            <div class="selected-char mt-3">
                <div class="preview-box" id="charPreview"></div>
                <div class="char-info" id="charInfo"></div>
                <button class="btn btn-sm btn-primary" onclick="copyCharacter()">📋 Copy</button>
            </div>
        </div>
    `;

    createWindow('character-map', 'Character Map', charMapContent);
    generateCharacterGrid();
}

function generateCharacterGrid() {
    const grid = document.getElementById('charGrid');
    grid.innerHTML = '';
    
    unicodeRanges.forEach(range => {
        for(let i = range.start; i <= range.end; i++) {
            const char = String.fromCharCode(i);
            if(char.trim()) { // Skip empty/control characters
                grid.innerHTML += `
                    <div class="char-cell" 
                         onclick="selectCharacter(${i}, '${escapeHtml(char)}')"
                         data-char="${char}"
                         data-code="${i.toString(16).toUpperCase()}">
                        ${char}
                    </div>
                `;
            }
        }
    });
}

function selectCharacter(code, char) {
    selectedChar = char;
    document.querySelectorAll('.char-cell').forEach(cell => 
        cell.classList.remove('selected'));
    event.target.classList.add('selected');
    
    document.getElementById('charPreview').textContent = char;
    document.getElementById('charInfo').innerHTML = `
        Unicode: U+${code.toString(16).toUpperCase().padStart(4, '0')}<br>
        ${getCharName(code) || 'Unknown Character'}
    `;
}

function getCharName(code) {
    try {
        return String.fromCharCode(code).codePointAt(0).toString(16);
    } catch {
        return null;
    }
}

function filterCharacters() {
    const searchTerm = document.getElementById('charSearch').value.toLowerCase();
    const font = document.getElementById('fontSelector').value;
    
    document.querySelectorAll('.char-cell').forEach(cell => {
        const char = cell.dataset.char;
        const code = cell.dataset.code;
        const matchesSearch = !searchTerm || 
            char.toLowerCase().includes(searchTerm) || 
            code.includes(searchTerm);
        
        cell.style.display = matchesSearch ? 'block' : 'none';
        cell.style.fontFamily = font;
    });
}

function copyCharacter() {
    if(selectedChar) {
        navigator.clipboard.writeText(selectedChar);
        alert(`Copied: ${selectedChar}`);
    }
}

function escapeHtml(unsafe) {
    return unsafe.replace(/[&<"'>]/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[m]));
}

// Add Character Map styles
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .character-map {
            background: #c0c0c0;
            padding: 15px;
        }
        .toolbar {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
        }
        .search-box {
            border: 2px solid #808080;
            padding: 2px 5px;
            flex-grow: 1;
        }
        .form-select {
            border: 2px solid #808080;
            background: #ffffff;
            width: 150px;
        }
        .char-grid {
            display: grid;
            grid-template-columns: repeat(16, 1fr);
            gap: 2px;
            background: #ffffff;
            border: 2px solid #808080;
            padding: 5px;
            max-height: 300px;
            overflow-y: auto;
        }
        .char-cell {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 30px;
            border: 1px solid #808080;
            cursor: pointer;
            background: #ffffff;
            font-size: 16px;
        }
        .char-cell:hover {
            background: #000080;
            color: white;
        }
        .char-cell.selected {
            background: #000080;
            color: white;
        }
        .selected-char {
            background: #ffffff;
            border: 2px solid #808080;
            padding: 10px;
            text-align: center;
        }
        .preview-box {
            font-size: 48px;
            margin-bottom: 10px;
            border: 2px solid #808080;
            padding: 10px;
        }
        .char-info {
            font-family: 'Courier New', monospace;
            margin-bottom: 10px;
        }
    `;
    document.head.appendChild(style);
});