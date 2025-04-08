// UPLOAD IMAGE
document.getElementById('upload').addEventListener('change', function (event) {
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

// UPLOAD TEXT FILE
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

// COMBINE UPLOADED IMAGE AND Text, THEN DELETES THE FIRST TWO DIVS
document.getElementById('combine').addEventListener('click', function() {
    const imgHere = document.getElementById('imgHere').querySelector('img');
    const textHere = document.getElementById('textHere').textContent;
    const imgAndText = document.getElementById('img&text');

    if (imgHere && textHere) {
        imgAndText.style.cssText = `
            font-size: 4px;
            line-height: 4px;
            text-align: justify;
            background-image: url(${imgHere.src});
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            background-attachment: fixed;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            color: white;
            height: 100%; // Ensure div is large enough to display background
            overflow: hidden;
        `;
        imgAndText.textContent = textHere.repeat(500); // Repeat text to cover image area
        
        // Clear the image and text containers
        document.getElementById('imgHere').innerHTML = '';
        document.getElementById('textHere').innerHTML = '';
    } else {
        imgAndText.textContent = 'Please upload both an image and a text file.';
        imgAndText.style.color = 'red';
    }
});

// DOWNLOAD COMBINED IMAGE AND TEXT
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