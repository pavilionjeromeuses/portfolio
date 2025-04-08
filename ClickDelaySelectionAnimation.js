document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('click', function(event) {
        event.preventDefault(); // Prevents instant navigation

        // Remove selection from other icons
        document.querySelectorAll('.desktop-icon').forEach(el => el.classList.remove('selected'));

        // Add selection effect
        this.classList.add('selected');

        // Delay navigation to simulate XP selection behavior
        setTimeout(() => {
            window.location.href = this.href; // Navigate after delay
        }, 400); // Adjust delay as needed
    });
});
