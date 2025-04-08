// StickyNotes.js
let notes = [];
let isDragging = false;
let currentNote = null;
let offsetX, offsetY;

function openStickyNotes() {
    const notesContent = `
        <div class="sticky-notes">
            <button class="new-note-btn" onclick="createNote()">📌 New Note</button>
            <div class="notes-container" id="notesContainer"></div>
        </div>
    `;

    createWindow('sticky-notes', 'Sticky Notes', notesContent);
    loadSavedNotes();
}

function createNote(content = '', color = '#ffff88', x = 50, y = 50) {
    const noteId = Date.now();
    const note = document.createElement('div');
    note.className = 'sticky-note';
    note.id = noteId;
    note.style.backgroundColor = color;
    note.style.left = `${x}px`;
    note.style.top = `${y}px`;
    
    note.innerHTML = `
        <div class="note-header">
            <div class="color-picker">
                <div class="color yellow" onclick="changeNoteColor(${noteId}, '#ffff88')"></div>
                <div class="color blue" onclick="changeNoteColor(${noteId}, '#88ffff')"></div>
                <div class="color pink" onclick="changeNoteColor(${noteId}, '#ff88ff')"></div>
            </div>
            <button class="delete-btn" onclick="deleteNote(${noteId})">×</button>
        </div>
        <textarea class="note-content">${content}</textarea>
    `;

    note.addEventListener('mousedown', startDragging);
    document.getElementById('notesContainer').appendChild(note);
    notes.push({id: noteId, content, color, x, y});
    saveNotes();
    return note;
}

function startDragging(e) {
    isDragging = true;
    currentNote = e.target.closest('.sticky-note');
    offsetX = e.clientX - currentNote.offsetLeft;
    offsetY = e.clientY - currentNote.offsetTop;
    currentNote.style.zIndex = 1000;
    
    document.addEventListener('mousemove', dragNote);
    document.addEventListener('mouseup', stopDragging);
}

function dragNote(e) {
    if (!isDragging) return;
    
    const container = document.getElementById('notesContainer');
    const rect = container.getBoundingClientRect();
    
    let x = e.clientX - offsetX - rect.left;
    let y = e.clientY - offsetY - rect.top;
    
    // Boundary checks
    x = Math.max(0, Math.min(x, rect.width - currentNote.offsetWidth));
    y = Math.max(0, Math.min(y, rect.height - currentNote.offsetHeight));
    
    currentNote.style.left = `${x}px`;
    currentNote.style.top = `${y}px`;
    
    // Update position in storage
    const noteIndex = notes.findIndex(n => n.id == currentNote.id);
    if (noteIndex > -1) {
        notes[noteIndex].x = x;
        notes[noteIndex].y = y;
        saveNotes();
    }
}

function stopDragging() {
    isDragging = false;
    currentNote.style.zIndex = 1;
    document.removeEventListener('mousemove', dragNote);
    document.removeEventListener('mouseup', stopDragging);
}

function changeNoteColor(noteId, color) {
    const note = document.getElementById(noteId);
    note.style.backgroundColor = color;
    
    const noteIndex = notes.findIndex(n => n.id == noteId);
    if (noteIndex > -1) {
        notes[noteIndex].color = color;
        saveNotes();
    }
}

function deleteNote(noteId) {
    const note = document.getElementById(noteId);
    note.parentNode.removeChild(note);
    notes = notes.filter(n => n.id != noteId);
    saveNotes();
}

function saveNotes() {
    notes.forEach(note => {
        const textarea = document.getElementById(note.id)?.querySelector('textarea');
        if (textarea) note.content = textarea.value;
    });
    localStorage.setItem('stickyNotes', JSON.stringify(notes));
}

function loadSavedNotes() {
    const savedNotes = JSON.parse(localStorage.getItem('stickyNotes') || '[]');
    savedNotes.forEach(note => {
        createNote(note.content, note.color, note.x, note.y);
    });
}

// Add Sticky Notes styles
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .sticky-notes {
            background: #008080;
            padding: 10px;
            height: 100%;
        }
        .new-note-btn {
            background: #c0c0c0;
            border: 2px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
            padding: 2px 15px;
            margin-bottom: 10px;
            cursor: pointer;
        }
        .new-note-btn:active {
            border-color: #808080 #ffffff #ffffff #808080;
        }
        .notes-container {
            position: relative;
            height: calc(100% - 40px);
            overflow: hidden;
        }
        .sticky-note {
            position: absolute;
            width: 200px;
            min-height: 150px;
            background: #ffff88;
            border: 2px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
            padding: 5px;
            cursor: move;
        }
        .note-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        .color-picker {
            display: none;
            position: absolute;
            background: #c0c0c0;
            border: 2px solid #808080;
            padding: 2px;
            z-index: 1001;
        }
        .sticky-note:hover .color-picker {
            display: flex;
            gap: 2px;
        }
        .color {
            width: 16px;
            height: 16px;
            border: 2px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
            cursor: pointer;
        }
        .yellow { background: #ffff88; }
        .blue { background: #88ffff; }
        .pink { background: #ff88ff; }
        .delete-btn {
            background: #c0c0c0;
            border: 2px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
            width: 18px;
            height: 18px;
            text-align: center;
            line-height: 12px;
            cursor: pointer;
        }
        .note-content {
            width: 100%;
            height: calc(100% - 30px);
            border: none;
            background: transparent;
            resize: none;
            font-family: 'Comic Sans MS', cursive;
            font-size: 12px;
        }
        .note-content:focus {
            outline: 1px dotted #000000;
        }
    `;
    document.head.appendChild(style);
});