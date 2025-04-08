// GrooveMusicLegacy.js
function openGrooveMusicLegacy() {
    const musicContent = `
        <div class="groove-music">
            <div class="d-flex">
                <div class="playlist-container p-2" style="width: 200px; border-right: 2px solid #808080;">
                    <h5>🎵 Playlist</h5>
                    <div id="playlist" style="height: 200px; overflow-y: auto;">
                        ${generatePlaylist()}
                    </div>
                    <button class="btn btn-sm btn-secondary mt-2" onclick="addRandomTrack()">+ Add Track</button>
                </div>
                
                <div class="player-main p-2" style="flex: 1">
                    <div id="album-art" class="mb-3" style="background: #000080; width: 150px; height: 150px; margin: 0 auto;">
                        <div class="cd-hole" style="
                            width: 40px;
                            height: 40px;
                            background: silver;
                            border-radius: 50%;
                            position: relative;
                            top: 55px;
                            left: 55px;
                        "></div>
                    </div>
                    
                    <div id="track-info" class="mb-3 text-center">
                        <h4 id="track-title">-- No Track Selected --</h4>
                        <div id="track-artist">--</div>
                    </div>
                    
                    <div class="progress mb-2" style="height: 20px; border: 2px inset #808080;">
                        <div id="progress-bar" 
                             style="height: 100%; 
                                    width: 0%; 
                                    background: #000080; 
                                    transition: width 0.3s linear;
                                    display: flex;
                                    align-items: center;
                                    padding-left: 5px;
                                    color: white;">0:00</div>
                    </div>
                    
                    <div class="d-flex justify-content-center align-items-center gap-2 mb-3">
                        <button class="btn btn-lg" onclick="previousTrack()">⏮</button>
                        <button class="btn btn-lg" id="play-button" onclick="togglePlay()">▶</button>
                        <button class="btn btn-lg" onclick="nextTrack()">⏭</button>
                    </div>
                    
                    <div class="d-flex align-items-center gap-2">
                        <span>🔊</span>
                        <input type="range" 
                               id="volume" 
                               min="0" 
                               max="100" 
                               value="100"
                               style="width: 100px;
                                      accent-color: #000080;
                                      border: 2px inset #808080;">
                        <span id="volume-percent">100%</span>
                    </div>
                </div>
            </div>
            
            <div class="visualizer" style="height: 60px; border-top: 2px solid #808080; margin-top: 10px;">
                <canvas id="music-visualizer" width="300" height="60"></canvas>
            </div>
        </div>
    `;

    createWindow('groove-music', 'Groove Music Legacy', musicContent);
    initializeMusicPlayer();
}

function generatePlaylist() {
    const tracks = [
        { title: "Windows 95 Startup", artist: "Microsoft Sound Team", duration: "0:25" },
        { title: "Error Symphony", artist: "BSOD Orchestra", duration: "1:30" },
        { title: "Dial-Up Boogie", artist: "Modem Monkeys", duration: "3:14" },
        { title: "Pixel Dreams", artist: "8-Bit Heroes", duration: "4:20" },
        { title: "Diskette Romance", artist: "Floppy Drive Quartet", duration: "2:45" }
    ];

    return tracks.map((track, index) => `
        <div class="playlist-item p-1" 
             data-index="${index}"
             onclick="selectTrack(${index})"
             style="cursor: pointer;
                    background: #c0c0c0;
                    border: 2px solid #808080;
                    margin-bottom: 2px;">
            <div>${track.title}</div>
            <small>${track.artist} • ${track.duration}</small>
        </div>
    `).join('');
}

function initializeMusicPlayer() {
    let currentTrack = null;
    let isPlaying = false;
    let progressInterval = null;
    const tracks = [
        { title: "Windows 95 Startup", artist: "Microsoft Sound Team", duration: 25 },
        { title: "Error Symphony", artist: "BSOD Orchestra", duration: 90 },
        { title: "Dial-Up Boogie", artist: "Modem Monkeys", duration: 194 },
        { title: "Pixel Dreams", artist: "8-Bit Heroes", duration: 260 },
        { title: "Diskette Romance", artist: "Floppy Drive Quartet", duration: 165 }
    ];

    window.selectTrack = (index) => {
        document.querySelectorAll('.playlist-item').forEach(item => {
            item.style.background = '#c0c0c0';
        });
        currentTrack = index;
        document.querySelector(`[data-index="${index}"]`).style.background = '#000080';
        document.getElementById('track-title').textContent = tracks[index].title;
        document.getElementById('track-artist').textContent = tracks[index].artist;
        resetProgress();
    };

    window.togglePlay = () => {
        const button = document.getElementById('play-button');
        if (!currentTrack) {
            alert("Please select a track first!");
            return;
        }
        
        isPlaying = !isPlaying;
        button.innerHTML = isPlaying ? "⏸" : "▶";
        
        if (isPlaying) {
            startProgress(tracks[currentTrack].duration);
            startVisualization();
        } else {
            clearInterval(progressInterval);
            stopVisualization();
        }
    };

    function startProgress(duration) {
        let seconds = 0;
        const progressBar = document.getElementById('progress-bar');
        
        progressInterval = setInterval(() => {
            seconds++;
            const progress = (seconds / duration) * 100;
            progressBar.style.width = `${progress}%`;
            progressBar.textContent = `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
            
            if (seconds >= duration) {
                togglePlay();
                nextTrack();
            }
        }, 1000);
    }

    function resetProgress() {
        const progressBar = document.getElementById('progress-bar');
        progressBar.style.width = '0%';
        progressBar.textContent = '0:00';
        clearInterval(progressInterval);
        isPlaying = false;
        document.getElementById('play-button').innerHTML = "▶";
    }

    window.nextTrack = () => {
        if (currentTrack === null) currentTrack = 0;
        currentTrack = (currentTrack + 1) % tracks.length;
        selectTrack(currentTrack);
        if (isPlaying) togglePlay();
    };

    window.previousTrack = () => {
        if (currentTrack === null) currentTrack = 0;
        currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
        selectTrack(currentTrack);
        if (isPlaying) togglePlay();
    };

    window.addRandomTrack = () => {
        const newTracks = [
            { title: "MIDI Memories", artist: "Sound Blaster Ensemble", duration: 210 },
            { title: "Screen Saver Jazz", artist: "Flying Windows Trio", duration: 180 },
            { title: "Defragment Sonata", artist: "Hard Drive Quartet", duration: 240 }
        ];
        const newTrack = newTracks[Math.floor(Math.random() * newTracks.length)];
        tracks.push(newTrack);
        
        const playlist = document.getElementById('playlist');
        playlist.innerHTML += `
            <div class="playlist-item p-1" 
                 data-index="${tracks.length - 1}"
                 onclick="selectTrack(${tracks.length - 1})"
                 style="cursor: pointer;
                        background: #c0c0c0;
                        border: 2px solid #808080;
                        margin-bottom: 2px;">
                <div>${newTrack.title}</div>
                <small>${newTrack.artist} • ${Math.floor(newTrack.duration / 60)}:${(newTrack.duration % 60).toString().padStart(2, '0')}</small>
            </div>
        `;
    };

    // Volume control
    document.getElementById('volume').addEventListener('input', (e) => {
        document.getElementById('volume-percent').textContent = `${e.target.value}%`;
    });

    // Visualization
    function startVisualization() {
        const canvas = document.getElementById('music-visualizer');
        const ctx = canvas.getContext('2d');
        let animationFrame;
        
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#000080';
            
            for(let i = 0; i < 20; i++) {
                const height = Math.random() * 60;
                ctx.fillRect(i * 15, 60 - height, 10, height);
            }
            
            animationFrame = requestAnimationFrame(draw);
        }
        draw();
    }

    function stopVisualization() {
        cancelAnimationFrame(animationFrame);
        const canvas = document.getElementById('music-visualizer');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// Retro styling
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .groove-music {
            font-family: 'Arial', sans-serif;
        }
        .playlist-item:hover {
            background: #a0a0a0 !important;
        }
        button {
            background: #c0c0c0 !important;
            border: 2px solid !important;
            border-color: #ffffff #808080 #808080 #ffffff !important;
        }
        button:active {
            border-color: #808080 #ffffff #ffffff #808080 !important;
        }
        #album-art {
            border: 2px inset #808080;
        }
        .cd-hole {
            border: 2px outset #808080;
        }
    `;
    document.head.appendChild(style);
});