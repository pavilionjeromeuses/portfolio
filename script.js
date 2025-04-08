// Update clock
function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

function toggleStartMenu() {
    const menu = document.querySelector('.start-menu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    
    // Add animation class
    const button = document.querySelector('.start-button');
    button.classList.add('pressed');
    
    // Remove animation class after animation completes
    setTimeout(() => {
        button.classList.remove('pressed');
    }, 200);
}

// For Draggable Windows
$(function() {
    $(".window").draggable({ handle: ".title-bar" });
});