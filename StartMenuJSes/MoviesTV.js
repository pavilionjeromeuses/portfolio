// MoviesTV.js
function openMoviesTV() {
    const moviesContent = `
        <div class="movies-app">
            <div class="row mb-3">
                <div class="col-8">
                    <div class="video-container" style="background: #000; border: 3px inset #c0c0c0;">
                        <div id="fake-video" style="height: 240px; position: relative;">
                            <div class="scanline"></div>
                            <div id="video-overlay" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 24px; display: none;">
                                📼 PLAYING
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-4">
                    <div class="player-controls">
                        <button class="btn btn-secondary mb-2" onclick="togglePlayback()">▶️ Play</button>
                        <button class="btn btn-secondary mb-2" onclick="stopPlayback()">⏹ Stop</button>
                        <div class="volume-control">
                            <span>🔊 Volume:</span>
                            <input type="range" min="0" max="100" value="75" 
                                   style="vertical-align: middle;"
                                   oninput="updateVolume(this.value)">
                            <span id="volume-display">75%</span>
                        </div>
                        <div class="progress mt-2">
                            <div id="video-progress" 
                                 style="width: 0%; height: 10px; background: #000080; transition: width 0.3s linear;">
                            </div>
                        </div>
                        <div id="time-display" class="mt-1">00:00 / 00:00</div>
                    </div>
                </div>
            </div>
            
            <div class="video-store">
                <h5>📼 Featured Content</h5>
                <div class="video-grid">
                    ${generateVideoTiles()}
                </div>
            </div>
        </div>
    `;

    createWindow('movies-tv', 'Movies & TV', moviesContent);
    initializeVideoPlayer();
}

function generateVideoTiles() {
    const movies = [
        { title: "Hackers (1995)", genre: "Cyberpunk", runtime: "1:47", rating: "★★★★☆" },
        { title: "Space Quest: The Movie", genre: "Sci-Fi", runtime: "2:12", rating: "★★★☆☆" },
        { title: "LAN Party Massacre", genre: "Horror", runtime: "1:32", rating: "★★☆☆☆" },
        { title: "The Big Debug", genre: "Comedy", runtime: "1:58", rating: "★★★★★" },
        { title: "404: Love Not Found", genre: "Romance", runtime: "1:25", rating: "★☆☆☆☆" },
        { title: "Pizza Delivery Simulator", genre: "Documentary", runtime: "3:14", rating: "★★★★☆" }
    ];

    return movies.map(movie => `
        <div class="video-tile p-2" onclick="selectMovie('${movie.title}')"
             style="cursor: pointer; border: 2px solid #808080; margin: 5px; background: #c0c0c0;">
            <div class="video-thumbnail" 
                 style="height: 80px; background: #000080; margin-bottom: 5px;"></div>
            <div class="video-title"><strong>${movie.title}</strong></div>
            <div class="video-info">
                ${movie.genre} • ${movie.runtime}<br>
                ${movie.rating}
            </div>
        </div>
    `).join('');
}

function initializeVideoPlayer() {
    let isPlaying = false;
    let progressInterval = null;
    const totalTime = 7544; // 2:05:44 in seconds
    
    window.togglePlayback = () => {
        const overlay = document.getElementById('video-overlay');
        const progress = document.getElementById('video-progress');
        
        if (!isPlaying) {
            isPlaying = true;
            overlay.style.display = 'block';
            progressInterval = setInterval(() => {
                const currentWidth = parseFloat(progress.style.width) || 0;
                progress.style.width = Math.min(currentWidth + 0.5, 100) + '%';
            }, 1000);
        } else {
            isPlaying = false;
            overlay.style.display = 'none';
            clearInterval(progressInterval);
        }
    };

    window.stopPlayback = () => {
        const progress = document.getElementById('video-progress');
        isPlaying = false;
        document.getElementById('video-overlay').style.display = 'none';
        clearInterval(progressInterval);
        progress.style.width = '0%';
    };

    window.updateVolume = (value) => {
        document.getElementById('volume-display').textContent = `${value}%`;
    };

    window.selectMovie = (title) => {
        const overlay = document.getElementById('video-overlay');
        overlay.innerHTML = `📼 LOADING<br><small>${title}</small>`;
        overlay.style.display = 'block';
        
        setTimeout(() => {
            overlay.innerHTML = `📼 PLAYING<br><small>${title}</small>`;
            document.getElementById('video-progress').style.width = '0%';
            if (isPlaying) togglePlayback();
        }, 2000);
    };
}

// Add retro styling
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .video-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 10px;
        }
        .video-tile:hover {
            background: #a0a0a0 !important;
        }
        .scanline {
            position: absolute;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom,
                transparent 50%,
                rgba(0,0,0,0.1) 51%,
                transparent 51%);
            background-size: 100% 4px;
            pointer-events: none;
        }
        .player-controls button {
            background: #c0c0c0;
            border: 2px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
            color: black;
            width: 100%;
        }
        .player-controls button:active {
            border-color: #808080 #ffffff #ffffff #808080;
        }
        input[type="range"] {
            -webkit-appearance: none;
            background: #c0c0c0;
            border: 2px inset #808080;
            height: 15px;
            width: 100px;
        }
    `;
    document.head.appendChild(style);
});