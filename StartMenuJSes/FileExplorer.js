// FileExplorer.js
const fileSystem = {
    name: 'C:',
    type: 'drive',
    children: [
        {
            name: 'Windows',
            type: 'folder',
            children: [
                { name: 'System32', type: 'folder', children: [] },
                { name: 'explorer.exe', type: 'exe' }
            ]
        },
        {
            name: 'Program Files',
            type: 'folder',
            children: [
                { name: 'Internet Explorer', type: 'folder', children: [] },
                { name: 'readme.txt', type: 'txt', content: 'Welcome to WebOS 93!' }
            ]
        },
        { name: 'autoexec.bat', type: 'bat' },
        { name: 'config.sys', type: 'sys' }
    ]
};

let currentPath = [fileSystem];

function openFileExplorer() {
    const fileExplorerContent = `
        <div class="file-explorer">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="btn-group">
                    <button class="btn btn-sm btn-secondary" onclick="goBack()" id="back-btn">← Back</button>
                    <button class="btn btn-sm btn-secondary" onclick="createNewFolder()">New Folder</button>
                    <button class="btn btn-sm btn-secondary" onclick="createNewFile()">New File</button>
                </div>
                <span id="current-path">${getCurrentPath()}</span>
            </div>
            
            <div class="file-list" style="height: 250px; overflow-y: auto;">
                ${renderFileSystem(currentPath[currentPath.length - 1])}
            </div>
        </div>
    `;

    createWindow('file-explorer', 'File Explorer', fileExplorerContent);
    addFileEvents();
}

function renderFileSystem(currentDir) {
    return currentDir.children.map(item => `
        <div class="file-item d-flex align-items-center p-2 ${item.type}">
            <img src="${getIconForType(item.type)}" class="me-2" style="width: 32px; height: 32px;">
            <span class="name">${item.name}</span>
        </div>
    `).join('');
}

function getIconForType(type) {
    const icons = {
        folder: 'IMGs/StartMenuFileExplorer/fileExplorerFolderPNG.png',
        txt: 'IMGs/StartMenuFileExplorer/fileExplorerTxtPNG.png',
        exe: 'IMGs/StartMenuFileExplorer/fileExplorerExePNG.png',
        bat: 'IMGs/StartMenuFileExplorer/fileExplorerBatPNG.png',
        sys: 'IMGs/StartMenuFileExplorer/fileExplorerSysPNG.png',
        drive: 'IMGs/StartMenuFileExplorer/fileExplorerDrivePNG.png'
    };
    return icons[type] || 'IMGs/StartMenuFileExplorer/fileExplorerDocPNG.png';
}

function navigateTo(item) {
    currentPath.push(item);
    updateFileExplorer();
}

function goBack() {
    if (currentPath.length > 1) {
        currentPath.pop();
        updateFileExplorer();
    }
}

function updateFileExplorer() {
    document.querySelector('#current-path').textContent = getCurrentPath();
    document.querySelector('.file-list').innerHTML = renderFileSystem(currentPath[currentPath.length - 1]);
    addFileEvents();
    document.getElementById('back-btn').disabled = currentPath.length === 1;
}

function getCurrentPath() {
    return currentPath.map(item => item.name).join(' > ');
}

function createNewFolder() {
    const folderName = prompt('Enter new folder name:');
    if (folderName && isValidName(folderName)) {
        if (!currentPath[currentPath.length - 1].children.some(item => item.name === folderName)) {
            currentPath[currentPath.length - 1].children.push({
                name: folderName,
                type: 'folder',
                children: []
            });
            updateFileExplorer();
        } else {
            alert('A folder with this name already exists!');
        }
    }
}

function createNewFile() {
    const fileName = prompt('Enter new file name (include extension):');
    if (fileName && isValidName(fileName)) {
        if (!currentPath[currentPath.length - 1].children.some(item => item.name === fileName)) {
            const extension = fileName.split('.').pop();
            currentPath[currentPath.length - 1].children.push({
                name: fileName,
                type: extension,
                content: 'New file content'
            });
            updateFileExplorer();
        } else {
            alert('A file with this name already exists!');
        }
    }
}

function isValidName(name) {
    return !/[<>:"/\\|?*]/.test(name);
}

function addFileEvents() {
    document.querySelectorAll('.file-item').forEach(item => {
        const fileObj = currentPath[currentPath.length - 1].children.find(
            f => f.name === item.querySelector('.name').textContent
        );

        item.addEventListener('dblclick', () => {
            if (fileObj.type === 'folder') {
                navigateTo(fileObj);
            } else {
                openFile(fileObj);
            }
        });
    });
}

function openFile(file) {
    if (file.type === 'txt') {
        createWindow(
            `file-${file.name}`,
            file.name,
            `<textarea style="width: 100%; height: 100%">${file.content}</textarea>`
        );
    } else {
        alert(`Cannot open ${file.type.toUpperCase()} files!\nThis is a simulation.`);
    }
}

// Add file explorer styles
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .file-item {
            cursor: pointer;
            background: #c0c0c0;
            border: 1px solid #808080;
            margin: 2px 0;
            transition: all 0.2s ease;
        }
        .file-item:hover {
            background: #000080 !important;
            color: white;
        }
        .file-list {
            background: white;
            border: 2px solid #808080;
        }
        .folder {
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
});