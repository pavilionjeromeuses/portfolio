// WindowsMediaPlayer.js
function openWindowsMediaPlayer() {
    const mediaPlayerContent = `
        <div class="media-player">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5>🎵 Windows Media Player 95</h5>
                <span id="player-status">Stopped</span>
            </div>
            
            <div class="visualization-container mb-3" style="background: black; height: 100px;">
                <canvas id="audio-visualizer" width="300" height="100"></canvas>
            </div>
            
            <div class="track-info mb-2">
                <div id="now-playing">📻 No track selected</div>
                <div class="progress" style="height: 20px; border: 2px inset #c0c0c0;">
                    <div id="track-progress" 
                         style="width: 0; height: 100%; background: #000080; transition: width 0.3s ease;">
                    </div>
                </div>
            </div>
            
            <div class="controls d-flex justify-content-center gap-2 mb-3">
                <button class="btn btn-sm" onclick="mediaPrev()">⏮</button>
                <button class="btn btn-lg" id="play-btn" onclick="mediaPlayPause()">▶️</button>
                <button class="btn btn-sm" onclick="mediaNext()">⏭</button>
            </div>
            
            <div class="d-flex align-items-center gap-3">
                <span>🔊</span>
                <input type="range" id="volume" min="0" max="100" value="75" 
                       style="width: 120px; accent-color: #000080;">
                <span id="volume-value">75%</span>
            </div>
            
            <div class="playlist mt-3 p-2" style="background: #c0c0c0; border: 2px inset #c0c0c0;">
                <h6>📜 Playlist</h6>
                <div id="track-list">
                    ${generateTrackList()}
                </div>
            </div>
        </div>
    `;

    createWindow('media-player', 'Windows Media Player', mediaPlayerContent);
    initializeMediaPlayer();
}

function generateTrackList() {
    const tracks = [
        { title: "Startup Sound (Extended Remix)", duration: "3:14" },
        { title: "MODEM_Connection_Symphony.wav", duration: "4:33" },
        { title: "Windows_Error_Soundscape.mp3", duration: "2:18" },
        { title: "Dial-up Internet ASMR", duration: "7:62" },
        { title: "CRT Monitor Humming", duration: "∞" }
    ];

    return tracks.map((track, index) => `
        <div class="track-item p-1" data-index="${index}" 
             onclick="selectTrack(${index})"
             style="cursor: pointer; ${index === 0 ? 'background: #000080; color: white;' : ''}">
            ${index + 1}. ${track.title} (${track.duration})
        </div>
    `).join('');
}

function initializeMediaPlayer() {
    let isPlaying = false;
    let currentTrack = 0;
    let progress = 0;
    let animationFrame;
    
    window.selectTrack = (index) => {
        document.querySelectorAll('.track-item').forEach(track => {
            track.style.background = '#c0c0c0';
            track.style.color = 'black';
        });
        currentTrack = index;
        document.querySelector(`.track-item[data-index="${index}"]`).style.background = '#000080';
        document.querySelector(`.track-item[data-index="${index}"]`).style.color = 'white';
        document.getElementById('now-playing').textContent = `🎧 Now Playing: ${tracks[index].title}`;
    };

    window.mediaPlayPause = () => {
        const btn = document.getElementById('play-btn');
        isPlaying = !isPlaying;
        btn.innerHTML = isPlaying ? '⏸️' : '▶️';
        document.getElementById('player-status').textContent = isPlaying ? 'Playing' : 'Paused';
        
        if(isPlaying) {
            startVisualization();
            simulatePlayback();
        } else {
            cancelAnimationFrame(animationFrame);
        }
    };

    function simulatePlayback() {
        const progressBar = document.getElementById('track-progress');
        let width = progress;
        
        function animate() {
            if(width < 100 && isPlaying) {
                width += 0.1;
                progressBar.style.width = width + '%';
                progress = width;
                animationFrame = requestAnimationFrame(animate);
            }
        }
        animate();
    }

    function startVisualization() {
        const canvas = document.getElementById('audio-visualizer');
        const ctx = canvas.getContext('2d');
        let analyserData = new Uint8Array(64);
        
        function draw() {
            if(!isPlaying) return;
            
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Generate random visualization data
            analyserData = analyserData.map(() => Math.random() * 100);
            
            ctx.fillStyle = '#000080';
            analyserData.forEach((value, i) => {
                const height = value * 2;
                ctx.fillRect(i * 5, canvas.height - height, 3, height);
            });
            
            requestAnimationFrame(draw);
        }
        draw();
    }

    // Volume control
    document.getElementById('volume').addEventListener('input', (e) => {
        document.getElementById('volume-value').textContent = `${e.target.value}%`;
    });

    window.mediaPrev = () => {
        currentTrack = Math.max(0, currentTrack - 1);
        selectTrack(currentTrack);
    };

    window.mediaNext = () => {
        currentTrack = Math.min(tracks.length - 1, currentTrack + 1);
        selectTrack(currentTrack);
    };

    const tracks = [
        { title: "Startup Sound (Extended Remix)", duration: "3:14" },
        { title: "MODEM_Connection_Symphony.wav", duration: "4:33" },
        { title: "Windows_Error_Soundscape.mp3", duration: "2:18" },
        { title: "Dial-up Internet ASMR", duration: "7:62" },
        { title: "CRT Monitor Humming", duration: "∞" }
    ];
}

// Add retro styling
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .media-player {
            background: #c0c0c0;
            padding: 15px;
        }
        .track-item:hover {
            background: #a0a0a0 !important;
        }
        button {
            background: #c0c0c0;
            border: 2px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
            color: black;
        }
        button:active {
            border-color: #808080 #ffffff #ffffff #808080;
        }
        #audio-visualizer {
            border: 2px inset #c0c0c0;
        }
    `;
    document.head.appendChild(style);
});