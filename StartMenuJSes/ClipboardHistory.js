// ClipboardHistory.js
let clipboardItems = [
    { content: "Welcome to WebOS 93!", type: "text", timestamp: "10:00 AM" },
    { content: "https://example.com", type: "link", timestamp: "9:55 AM" },
    { content: "data:image/png;base64,...", type: "image", timestamp: "9:50 AM" }
];

function openClipboardHistory() {
    const clipboardContent = `
        <div class="clipboard-history">
            <div class="toolbar mb-3">
                <button class="btn btn-sm btn-secondary" onclick="pasteFromClipboard()">📋 Paste</button>
                <button class="btn btn-sm btn-danger" onclick="clearClipboard()">🧹 Clear All</button>
            </div>
            
            <div class="clipboard-list">
                ${clipboardItems.map((item, index) => `
                    <div class="clipboard-item" onclick="selectItem(${index})">
                        <div class="preview">
                            ${getPreview(item)}
                        </div>
                        <div class="meta">
                            <span class="type">${item.type}</span>
                            <span class="time">${item.timestamp}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="current-selection mt-3">
                <input type="text" id="clipboardInput" class="form-control">
                <button class="btn btn-sm btn-primary mt-2" onclick="copyToClipboard()">📄 Copy</button>
            </div>
        </div>
    `;

    createWindow('clipboard-history', 'Clipboard History', clipboardContent);
    updateClipboardList();
}

function getPreview(item) {
    switch(item.type) {
        case 'text':
            return `<div class="text-preview">${item.content.substring(0, 30)}</div>`;
        case 'link':
            return `<div class="link-preview">🔗 ${item.content}</div>`;
        case 'image':
            return `<div class="image-preview">🖼️ Image (1.2MB)</div>`;
        default:
            return `<div class="unknown-preview">❓ Unknown format</div>`;
    }
}

function selectItem(index) {
    document.querySelectorAll('.clipboard-item').forEach(item => 
        item.classList.remove('selected'));
    document.querySelectorAll('.clipboard-item')[index].classList.add('selected');
    document.getElementById('clipboardInput').value = clipboardItems[index].content;
}

function copyToClipboard() {
    const text = document.getElementById('clipboardInput').value;
    if(text) {
        clipboardItems.unshift({
            content: text,
            type: 'text',
            timestamp: new Date().toLocaleTimeString()
        });
        updateClipboardList();
        alert('Copied to clipboard! (Simulated)');
    }
}

function pasteFromClipboard() {
    if(clipboardItems.length > 0) {
        const text = clipboardItems[0].content;
        document.getElementById('clipboardInput').value = text;
        alert('Pasted from clipboard! (Simulated)');
    }
}

function clearClipboard() {
    if(confirm('Clear all clipboard history?')) {
        clipboardItems = [];
        updateClipboardList();
    }
}

function updateClipboardList() {
    const list = document.querySelector('.clipboard-list');
    if(list) {
        list.innerHTML = clipboardItems.map((item, index) => `
            <div class="clipboard-item" onclick="selectItem(${index})">
                <div class="preview">
                    ${getPreview(item)}
                </div>
                <div class="meta">
                    <span class="type">${item.type}</span>
                    <span class="time">${item.timestamp}</span>
                </div>
            </div>
        `).join('');
    }
}

// Add Clipboard History styles
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .clipboard-history {
            background: #c0c0c0;
            padding: 15px;
        }
        .clipboard-list {
            background: white;
            border: 2px solid #808080;
            max-height: 300px;
            overflow-y: auto;
        }
        .clipboard-item {
            padding: 8px;
            border-bottom: 1px solid #808080;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .clipboard-item:hover {
            background: #000080;
            color: white;
        }
        .clipboard-item.selected {
            background: #000080;
            color: white;
        }
        .preview {
            margin-bottom: 3px;
        }
        .meta {
            display: flex;
            justify-content: space-between;
            font-size: 0.8em;
        }
        .type {
            color: #808080;
        }
        .time {
            color: #000080;
        }
        .form-control {
            border: 2px solid #808080;
            background: #ffffff;
        }
        .text-preview {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .link-preview {
            color: #0000ff;
            text-decoration: underline;
        }
    `;
    document.head.appendChild(style);
});