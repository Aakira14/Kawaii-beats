let isPlaying = false;
let currentTrack = 0;
const audio = document.getElementById('audioPlayer');
let currentVolume = 0.5;
const baseUrl = getBaseUrl();

const tracks = [
    {file: "assets/kawaii-drops-no-copy-right-386533.mp3", image: "assets/Pixel Art Girl Icon.jpeg", title: "Kawaii drops", theme: "#D6DDFF"},
    {file: "assets/sugar-heart-melodic-lo-fi-255510.mp3", image: "assets/6a2d1f6f-55a8-42c3-b75d-b868005d09a0.jpeg", title: "Suger Heart♥︎", theme: "linear-gradient(135deg, #f5f5dc, #d2b48c, #deb887)"},
    {file: "assets/Dxrkaii, Jiandro - New Jeans (Jersey Club - Slowed Down).mp3", image: "assets/Pixel Art Bookworm Icon.jpeg", title: "New Jeans", theme: "#800080"},
    {file: "assets/FIFTY FIFTY - Cupid (Twin Version) (Lyrics).mp3", image: "assets/Pixel art fall girl.jpeg", title: "Cupid{FIFTY-FIFTY(TWIN version)}", theme: "#834333"},
    {file: "assets/Chi Chi Chimo Chimo - (( Mitchino Timothy Kimi no Kimochi Lyrics)).mp3", image: "assets/bunny.jpeg", title: "Chi Chi Chimo Chimo", theme: "#F8C8DC"},
    {file: "assets/KATSEYE - Touch (Lyrics).mp3", image: "assets/Pixel art girl.jpeg", title: "Touch {KATSEYE}", theme: "#015482"},
    {file: "assets/愛♡スクリ～ム！.mp3", image: "assets/ac6e2d9b-a924-444f-a136-9cd421f8a41a.jpeg", title: "愛♡スクリ～ム", theme: "#E89EB8"}
];

function getBaseUrl() {
    const { origin, pathname } = window.location;

    // Ensure a directory base. Handles:
    // - /repo            -> /repo/
    // - /repo/           -> /repo/
    // - /repo/index.html -> /repo/
    let basePath = pathname;
    if (!basePath.endsWith('/')) {
        const lastSegment = basePath.split('/').filter(Boolean).pop() || '';
        if (lastSegment.includes('.')) {
            basePath = basePath.slice(0, basePath.lastIndexOf('/') + 1);
        } else {
            basePath += '/';
        }
    }

    return origin + basePath;
}

function togglePlay() {
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
    } else {
        // Set volume and unmute on first user interaction
        audio.volume = currentVolume || 0.5;
        if (audio.muted) {
            audio.muted = false;
        }
        audio.play().catch(e => console.error('Playback failed:', e));
        isPlaying = true;
    }
    const playBtn = document.getElementById('playBtn');
    const player = document.getElementById('musicPlayer');
    playBtn.innerHTML = isPlaying ? '⏸' : '▶';
    player.classList.toggle('playing', isPlaying);
}

function nextTrack() {
    currentTrack = (currentTrack + 1) % tracks.length;
    updateTrackDisplay();
    if (isPlaying) {
        audio.currentTime = 0;
        audio.play().catch(e => console.error('Playback failed:', e));
    }
}

function previousTrack() {
    currentTrack = currentTrack === 0 ? tracks.length - 1 : currentTrack - 1;
    updateTrackDisplay();
    if (isPlaying) {
        audio.currentTime = 0;
        audio.play().catch(e => console.error('Playback failed:', e));
    }
}

function updateTrackDisplay() {
    const displayImage = document.getElementById('displayImage');
    displayImage.src = new URL(tracks[currentTrack].image, baseUrl).toString();
    displayImage.alt = tracks[currentTrack].title;
    document.getElementById('songTitle').textContent = tracks[currentTrack].title;
    audio.src = new URL(tracks[currentTrack].file, baseUrl).toString();
    audio.load();
    document.getElementById('musicPlayer').style.background = tracks[currentTrack].theme;
    // Reset timeline on track change
    document.getElementById('currentTime').textContent = '0:00';
    document.getElementById('duration').textContent = '0:00';
    document.getElementById('progressFill').style.width = '0%';
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateTimeline() {
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const progressFill = document.getElementById('progressFill');

    if (audio.duration) {
        currentTimeEl.textContent = formatTime(audio.currentTime);
        durationEl.textContent = formatTime(audio.duration);
        const progress = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = progress + '%';
    }
}

function seek(event) {
    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = (x / rect.width);

    if (audio.duration) {
        audio.currentTime = percentage * audio.duration;
    }
}

function minimizePlayer() {
    const player = document.getElementById('musicPlayer');
    player.style.transform = 'scale(0.1)';
    player.style.opacity = '0.5';
    
    setTimeout(() => {
        player.style.transform = 'scale(1)';
        player.style.opacity = '1';
    }, 1000);
}

function closePlayer() {
    const player = document.getElementById('musicPlayer');
    player.style.animation = 'fadeOut 0.3s ease-out forwards';
    
    setTimeout(() => {
        player.style.display = 'none';
        setTimeout(() => {
            player.style.display = 'block';
            player.style.animation = 'none';
        }, 2000);
    }, 300);
}

// Add event listeners for timeline
audio.addEventListener('loadedmetadata', () => {
    updateTimeline();
});
audio.addEventListener('timeupdate', updateTimeline);
audio.addEventListener('ended', () => {
    nextTrack();
});

// Initialize
updateTrackDisplay();
