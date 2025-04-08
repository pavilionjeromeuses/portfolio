// DiskManagement.js
const disks = [
    { 
        number: 0,
        type: 'Basic',
        size: 1024,
        partitions: [
            { 
                name: 'System Reserved',
                size: 100,
                fs: 'NTFS',
                status: 'Healthy',
                color: '#000080'
            },
            {
                name: 'Free Space',
                size: 924,
                fs: '',
                status: 'Unallocated',
                color: '#808080'
            }
        ]
    }
];

let selectedPartition = null;

function openDiskManagement() {
    const diskContent = `
        <div class="disk-management">
            <div class="disk-visualization mb-3">
                ${disks.map(disk => `
                    <div class="disk">
                        <div class="disk-header">Disk ${disk.number} - ${disk.type}</div>
                        <div class="partitions">
                            ${disk.partitions.map(part => `
                                <div class="partition" 
                                     style="width: ${(part.size / disk.size) * 100}%;
                                            background: ${part.color}"
                                     onclick="selectPartition(${disk.number}, '${part.name}')"
                                     data-tooltip="${part.name} - ${part.size}MB (${part.status})">
                                    ${part.status === 'Healthy' ? part.fs : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="partition-controls">
                <button class="btn btn-sm btn-secondary" onclick="createNewVolume()">New Volume</button>
                <button class="btn btn-sm btn-danger" ${!selectedPartition ? 'disabled' : ''} 
                    onclick="deleteVolume()">Delete Volume</button>
                <button class="btn btn-sm btn-warning" ${!selectedPartition ? 'disabled' : ''} 
                    onclick="formatVolume()">Format</button>
            </div>
            
            <div class="partition-info mt-3 p-2">
                ${selectedPartition ? `
                    <h5>${selectedPartition.name}</h5>
                    <p>Size: ${selectedPartition.size}MB</p>
                    <p>File System: ${selectedPartition.fs || 'None'}</p>
                    <p>Status: ${selectedPartition.status}</p>
                ` : 'Select a partition to view details'}
            </div>
        </div>
    `;

    createWindow('disk-management', 'Disk Management', diskContent);
    addTooltips();
}

function selectPartition(diskNumber, partitionName) {
    const disk = disks.find(d => d.number === diskNumber);
    selectedPartition = disk.partitions.find(p => p.name === partitionName);
    document.querySelectorAll('.partition').forEach(el => el.classList.remove('selected'));
    event.target.classList.add('selected');
    openDiskManagement(); // Refresh UI
}

function createNewVolume() {
    const disk = disks[0];
    const freeSpace = disk.partitions.find(p => p.status === 'Unallocated');
    
    if (!freeSpace || freeSpace.size < 100) {
        alert('Not enough free space!');
        return;
    }

    const volSize = parseInt(prompt('Enter new volume size (MB):', freeSpace.size));
    if (volSize > freeSpace.size) {
        alert('Size exceeds free space!');
        return;
    }

    const volName = prompt('Enter volume name:', 'New Volume');
    const newVol = {
        name: volName,
        size: volSize,
        fs: 'NTFS',
        status: 'Healthy',
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
    };

    // Update free space
    freeSpace.size -= volSize;
    
    // Add new volume before free space
    disk.partitions.splice(disk.partitions.length - 1, 0, newVol);
    
    // Animate addition
    const newPart = document.createElement('div');
    newPart.className = 'partition';
    newPart.style.width = `${(volSize / disk.size) * 100}%`;
    newPart.style.background = newVol.color;
    newPart.innerHTML = newVol.fs;
    document.querySelector('.partitions').insertBefore(newPart, 
        document.querySelector('.partition:last-child'));
    
    openDiskManagement(); // Refresh UI
}

function deleteVolume() {
    if (!selectedPartition || selectedPartition.status === 'Unallocated') return;
    
    if (confirm(`Delete volume ${selectedPartition.name}? All data will be lost!`)) {
        const disk = disks[0];
        const freeSpace = disk.partitions.find(p => p.status === 'Unallocated');
        freeSpace.size += selectedPartition.size;
        
        disk.partitions = disk.partitions.filter(p => p !== selectedPartition);
        selectedPartition = null;
        
        // Animate removal
        event.target.parentElement.style.transform = 'scaleX(0)';
        setTimeout(() => openDiskManagement(), 500);
    }
}

function formatVolume() {
    if (!selectedPartition) return;
    
    const fsType = prompt('Enter file system (NTFS/FAT32):', 'NTFS').toUpperCase();
    if (['NTFS', 'FAT32'].includes(fsType)) {
        selectedPartition.fs = fsType;
        selectedPartition.color = fsType === 'NTFS' ? '#000080' : '#008000';
        openDiskManagement();
    }
}

function addTooltips() {
    tippy('[data-tooltip]', {
        content: reference => reference.getAttribute('data-tooltip'),
        placement: 'top',
        arrow: true,
        animation: 'scale'
    });
}

// Add disk management styles
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .disk-management {
            background: #c0c0c0;
            padding: 15px;
        }
        .disk {
            margin-bottom: 20px;
            border: 2px solid #808080;
        }
        .disk-header {
            background: #000080;
            color: white;
            padding: 5px;
        }
        .partitions {
            display: flex;
            height: 50px;
            background: #808080;
            margin: 5px;
        }
        .partition {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-shadow: 1px 1px black;
            border-right: 2px solid #404040;
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        .partition.selected {
            transform: scaleY(1.1);
            box-shadow: 0 0 5px #000080;
        }
        .partition-info {
            background: white;
            border: 2px solid #808080;
            min-height: 100px;
        }
        .partition-controls {
            display: flex;
            gap: 5px;
            margin-bottom: 10px;
        }
        .tippy-box {
            background: #000080;
            border: 2px solid #ffffff;
        }
    `;
    document.head.appendChild(style);
});