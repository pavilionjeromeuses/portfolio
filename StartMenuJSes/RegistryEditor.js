// RegistryEditor.js
const registryData = {
    'HKEY_LOCAL_MACHINE': {
        'SOFTWARE': {
            'Microsoft': {
                'Windows': {
                    'CurrentVersion': {
                        'Run': {
                            values: {
                                'SystemTray': { type: 'REG_SZ', data: 'systray.exe' }
                            }
                        }
                    }
                }
            }
        }
    },
    'HKEY_CURRENT_USER': {
        'Control Panel': {
            'Desktop': {
                values: {
                    'Wallpaper': { type: 'REG_SZ', data: 'c:\\webos93\\background.bmp' },
                    'ScreenSaveActive': { type: 'REG_DWORD', data: '0x00000001' }
                }
            }
        }
    }
};

let selectedKeyPath = [];

function openRegistryEditor() {
    const regContent = `
        <div class="registry-editor">
            <div class="d-flex h-100">
                <div class="registry-tree border-end" id="registry-tree"></div>
                <div class="registry-values flex-grow-1 p-2">
                    <div id="value-list"></div>
                </div>
            </div>
        </div>
    `;

    createWindow('registry-editor', 'Registry Editor', regContent);
    buildRegistryTree();
    displayKeyValues();
}

function buildRegistryTree() {
    const treeContainer = document.getElementById('registry-tree');
    treeContainer.innerHTML = buildTreeItems(registryData, []);
}

function buildTreeItems(data, path) {
    return Object.keys(data).map(key => {
        const isKey = typeof data[key] === 'object' && !data[key].values;
        const hasChildren = isKey && Object.keys(data[key]).length > 0;
        const currentPath = [...path, key];
        
        return `
            <div class="tree-item" data-path="${currentPath.join('/')}">
                <div class="tree-node" onclick="toggleExpand('${currentPath.join('/')}')">
                    <span class="toggle">${hasChildren ? '▶' : ''}</span>
                    <img src="IMGs/StartMenuFileExplorer/registryPNG.png" 
                         style="width: 16px; height: 16px; margin-right: 5px;">
                    ${key}
                </div>
                <div class="tree-children" id="${currentPath.join('/')}" style="display: none;">
                    ${hasChildren ? buildTreeItems(data[key], currentPath) : ''}
                </div>
            </div>
        `;
    }).join('');
}

function toggleExpand(path) {
    const children = document.getElementById(path);
    const toggle = document.querySelector(`[data-path="${path}"] .toggle`);
    
    if (children.style.display === 'none') {
        children.style.display = 'block';
        toggle.textContent = '▼';
        selectedKeyPath = path.split('/');
        displayKeyValues();
    } else {
        children.style.display = 'none';
        toggle.textContent = '▶';
    }
}

function displayKeyValues() {
    const valueList = document.getElementById('value-list');
    const currentKey = getCurrentKey();
    
    valueList.innerHTML = `
        <div class="d-flex justify-content-between mb-3">
            <button class="btn btn-sm btn-secondary" onclick="createNewValue()">New Value</button>
            <button class="btn btn-sm btn-danger" onclick="deleteSelectedValue()">Delete</button>
        </div>
        <table class="table table-sm">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Data</th>
                </tr>
            </thead>
            <tbody>
                ${currentKey.values ? Object.keys(currentKey.values).map(name => `
                    <tr ondblclick="editValue('${name}')">
                        <td>${name}</td>
                        <td>${currentKey.values[name].type}</td>
                        <td>${currentKey.values[name].data}</td>
                    </tr>
                `).join('') : ''}
            </tbody>
        </table>
    `;
}

function getCurrentKey() {
    let current = registryData;
    for (const part of selectedKeyPath) {
        current = current[part];
    }
    return current;
}

function createNewValue() {
    const valueName = prompt('Enter new value name:');
    if (valueName) {
        const currentKey = getCurrentKey();
        if (!currentKey.values) currentKey.values = {};
        currentKey.values[valueName] = {
            type: 'REG_SZ',
            data: '(value not set)'
        };
        displayKeyValues();
    }
}

function deleteSelectedValue() {
    const valueName = prompt('Enter value name to delete:');
    if (valueName) {
        const currentKey = getCurrentKey();
        if (currentKey.values && currentKey.values[valueName]) {
            if (confirm(`Are you sure you want to delete ${valueName}?`)) {
                delete currentKey.values[valueName];
                displayKeyValues();
            }
        } else {
            alert('Value not found!');
        }
    }
}

function editValue(valueName) {
    const currentKey = getCurrentKey();
    const value = currentKey.values[valueName];
    const newData = prompt(`Edit ${valueName} (${value.type}):`, value.data);
    
    if (newData !== null) {
        value.data = newData;
        displayKeyValues();
    }
}

// Add registry editor styles
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .registry-editor {
            height: 100%;
        }
        .registry-tree {
            width: 300px;
            overflow-y: auto;
            padding: 10px;
            background: #ffffff;
        }
        .tree-item {
            margin-left: 15px;
        }
        .tree-node {
            cursor: pointer;
            padding: 2px;
            display: flex;
            align-items: center;
        }
        .tree-node:hover {
            background: #000080;
            color: white;
        }
        .toggle {
            width: 12px;
            margin-right: 5px;
        }
        .registry-values {
            background: #c0c0c0;
        }
        .table {
            background: white;
            border: 2px solid #808080;
        }
        .table th {
            background: #000080;
            color: white;
        }
        .table td {
            border-color: #808080;
        }
    `;
    document.head.appendChild(style);
});