function toggleStartMenu() {
    const menu = document.querySelector('.start-menu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// 2
// Generic window creation function
// Modify createWindow() to update content if window exists
function createWindow(id, title, content) {
    const existingWindow = document.getElementById(id);
    if (existingWindow) {
        existingWindow.querySelector('.title-bar span').textContent = title;
        existingWindow.querySelector('.window-content').innerHTML = content;
        existingWindow.style.display = 'block';
        $(`#${id}`).draggable({ handle: ".title-bar" });
        return;
    }


    // Removed Minimize & Maximize Buttons
    const newWindow = document.createElement('div');
    newWindow.id = id;
    newWindow.className = 'window';
    newWindow.innerHTML = `
        <div class="title-bar">
            <span>${title}</span>
            <div>
                <button class="btn btn-xs btn-success mx-1" onclick="closeWindow('${id}')">×</button>
            </div>
        </div>
        <div class="window-content">${content}</div>
    `;

    document.body.appendChild(newWindow);
    $(`#${id}`).draggable({ handle: ".title-bar" });
}

function closeWindow(windowId) {
    const windowElement = document.getElementById(windowId);
    if (windowElement) {
        windowElement.style.display = 'none';
    }
}