document.getElementById('upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            const imgHere = document.getElementById('imgHere');
            imgHere.innerHTML = '';
            imgHere.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('uploadText').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            const textHere = document.getElementById('textHere');
            textHere.style.color = 'white';
            textHere.textContent = text;
        };
        reader.readAsText(file);
    }
});

document.getElementById('downloadBtn').addEventListener('click', function() {
    // Create a container to capture both divs
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '-9999px';
    document.body.appendChild(container);

    const imgDiv = document.getElementById('imgHere').cloneNode(true);
    const textDiv = document.getElementById('textHere').cloneNode(true);
    container.appendChild(imgDiv);
    container.appendChild(textDiv);

    html2canvas(container, { backgroundColor: null }).then(canvas => {
        // Convert canvas to an image blob and download it
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'download.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 'image/png');
        document.body.removeChild(container);
    });
});
