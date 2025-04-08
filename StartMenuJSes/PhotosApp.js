// PhotosApp.js
function openPhotosApp() {
    const photosContent = `
        <div class="photos-app">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="btn-group">
                    <button class="btn btn-sm btn-secondary" onclick="startSlideshow()">▶️ Slideshow</button>
                    <button class="btn btn-sm btn-secondary" onclick="shufflePhotos()">🔀 Shuffle</button>
                </div>
                <span id="film-counter">📷 24 exposures left</span>
            </div>
            
            <div class="photo-gallery row g-2" id="photo-grid">
                ${generatePhotoGrid()}
            </div>
            
            <div class="photo-preview mt-3" style="display: none;" id="preview-container">
                <div class="position-relative">
                    <img id="preview-image" style="max-width: 100%; border: 2px solid #000;">
                    <div class="photo-meta" id="photo-metadata" style="position: absolute; bottom: 5px; left: 5px; background: rgba(0,0,0,0.5); color: white; padding: 2px 5px;"></div>
                </div>
                <div class="d-flex justify-content-center mt-2">
                    <button class="btn btn-sm btn-secondary mx-1" onclick="applyVintageFilter()">🎞️ Vintage Filter</button>
                    <button class="btn btn-sm btn-secondary mx-1" onclick="rotatePhoto()">↩️ Rotate</button>
                    <button class="btn btn-sm btn-secondary mx-1" onclick="addSticker()">🌟 Add Sticker</button>
                </div>
            </div>
            
            <div class="develop-notice mt-2 p-1" style="background: #ffff99; border: 1px dashed black;">
                ⏳ Digital development in progress...
            </div>
        </div>
    `;

    createWindow('photos-app', 'Windows Photography Studio', photosContent);
    initializePhotoEvents();
}

function generatePhotoGrid() {
    const photos = Array(9).fill().map((_, i) => ({
        id: i + 1,
        url: `https://picsum.photos/150/100?random=${i}&grayscale`,
        date: generateFakeDate(),
        filmType: ['Kodak Gold 200', 'Fuji Superia 400', 'Ilford HP5'][i % 3]
    }));

    return photos.map(photo => `
        <div class="col-4" onclick="openPhotoPreview(${photo.id})">
            <div class="photo-thumbnail" data-id="${photo.id}" 
                 data-date="${photo.date}" 
                 data-film="${photo.filmType}"
                 style="position: relative; cursor: pointer; border: 2px solid #000;">
                <img src="${photo.url}" class="img-fluid" style="filter: brightness(0.9);">
                <div class="photo-badge">${photo.filmType}</div>
            </div>
        </div>
    `).join('');
}

function generateFakeDate() {
    const year = 1993 + Math.floor(Math.random() * 5);
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

function initializePhotoEvents() {
    let currentRotation = 0;
    let slideshowInterval = null;
    
    window.openPhotoPreview = (id) => {
        const thumbnail = document.querySelector(`[data-id="${id}"]`);
        const imgSrc = thumbnail.querySelector('img').src;
        
        document.getElementById('preview-container').style.display = 'block';
        document.getElementById('preview-image').src = imgSrc;
        document.getElementById('photo-metadata').textContent = 
            `📅 ${thumbnail.dataset.date} | ${thumbnail.dataset.film}`;
    };

    window.applyVintageFilter = () => {
        const img = document.getElementById('preview-image');
        img.style.filter = 'sepia(0.7) contrast(1.2) brightness(0.9)';
        img.style.borderColor = '#654321';
    };

    window.rotatePhoto = () => {
        currentRotation = (currentRotation + 90) % 360;
        document.getElementById('preview-image').style.transform = `rotate(${currentRotation}deg)`;
    };

    window.addSticker = () => {
        const stickers = ['⭐', '❤️', '🔴', '💙', '🌸', '🌈'];
        const sticker = document.createElement('div');
        sticker.textContent = stickers[Math.floor(Math.random() * stickers.length)];
        sticker.style.position = 'absolute';
        sticker.style.fontSize = '24px';
        sticker.style.left = `${Math.random() * 80}%`;
        sticker.style.top = `${Math.random() * 80}%`;
        document.querySelector('.position-relative').appendChild(sticker);
    };

    window.startSlideshow = () => {
        let currentIndex = 0;
        const thumbnails = document.querySelectorAll('.photo-thumbnail');
        
        slideshowInterval = setInterval(() => {
            openPhotoPreview(thumbnails[currentIndex].dataset.id);
            currentIndex = (currentIndex + 1) % thumbnails.length;
        }, 3000);
    };

    window.shufflePhotos = () => {
        document.getElementById('photo-grid').innerHTML = generatePhotoGrid();
    };
}

// Add retro styling
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .photo-thumbnail {
            transition: all 0.3s ease;
            background: #c0c0c0 !important;
            padding: 2px;
        }
        .photo-thumbnail:hover {
            transform: scale(1.05);
            z-index: 100;
        }
        .photo-badge {
            position: absolute;
            bottom: 2px;
            left: 2px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 1px 3px;
            font-size: 0.8em;
        }
        .photos-app {
            background: #c0c0c0;
            padding: 10px;
        }
        .develop-notice {
            font-family: 'Comic Sans MS', cursive;
        }
    `;
    document.head.appendChild(style);
});