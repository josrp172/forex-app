class SoundManager {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.bgm = new Audio('/static/music.mp3'); // Expects a user-provided file
        this.bgm.loop = true;
        this.bgm.volume = 0.5;
        this.isMuted = false;

        // Initialize UI
        this.initMusicControl();
    }

    initMusicControl() {
        // Create Toggle Button
        const btn = document.createElement('button');
        btn.id = 'music-toggle';
        btn.innerHTML = '🎵'; // Optimistic: Default to "ON"
        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.right = '20px';
        btn.style.zIndex = '1000';
        btn.style.background = 'rgba(0,0,0,0.6)';
        btn.style.color = 'white';
        btn.style.border = '1px solid rgba(255,255,255,0.2)';
        btn.style.borderRadius = '50%';
        btn.style.width = '50px';
        btn.style.height = '50px';
        btn.style.fontSize = '24px';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'all 0.3s';

        // We track explicit user intent separately from audio state
        this.userExplicitlyPaused = false;

        btn.onclick = (e) => {
            e.stopPropagation();
            this.toggleMusic();
        };

        document.body.appendChild(btn);

        // --- AUTOPLAY LOGIC ---
        // Requirement: "Concentration Mode" for Chapters. No Music.
        const isChapter = window.location.pathname.includes('chapter');

        if (isChapter) {
            console.log("Concentration Mode: Music Autoplay Disabled for Chapter.");
            btn.innerHTML = '🔇';
            this.userExplicitlyPaused = true; // Treat as if user wanted it off
            // Music stays paused (default state of Audio element)
        } else {
            // Optimistic Autoplay for non-chapter pages (e.g., Index/Map)
            this.bgm.play().catch(() => {
                console.log("Autoplay blocked. Waiting for interaction...");
                btn.innerHTML = '🔇'; // Update UI to show it is currently off

                // Mobile/Tablet Fallback: Unlock on FIRST SUCCESSFUL interaction
                const unlockAudio = () => {
                    if (this.userExplicitlyPaused) return;

                    if (this.ctx.state === 'suspended') this.ctx.resume();

                    this.bgm.play().then(() => {
                        // Success! NOW we remove listeners
                        ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown'].forEach(evt =>
                            document.removeEventListener(evt, unlockAudio, { capture: true })
                        );
                        btn.innerHTML = '🎵';
                    }).catch(e => {
                        // Failed (e.g. scroll gesture). Keep listeners attached!
                        console.log("Unlock attempt failed, retrying on next input...", e);
                    });
                };

                ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown'].forEach(evt =>
                    document.addEventListener(evt, unlockAudio, { capture: true })
                );
            });
        }
    }

    toggleMusic() {
        // Ensure context is running if they click the toggle
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const btn = document.getElementById('music-toggle');

        if (this.bgm.paused) {
            // User wants to Play
            this.bgm.play();
            this.userExplicitlyPaused = false;
            btn.innerHTML = '🎵';
        } else {
            // User wants to Pause
            this.bgm.pause();
            this.userExplicitlyPaused = true;
            btn.innerHTML = '🔇';
        }
    }

    // --- SYNTHESIZED TONES (No files needed) ---

    playTone(freq, type, duration, vol = 0.1) {
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playClick() {
        // High pitched blip
        this.playTone(800, 'sine', 0.1, 0.05);
    }

    playHover() {
        // Very subtle tick
        this.playTone(400, 'triangle', 0.05, 0.02);
    }

    playSuccess() {
        // Major Chord Arpeggio
        const now = this.ctx.currentTime;
        this.playNote(523.25, 'sine', now);       // C5
        this.playNote(659.25, 'sine', now + 0.1); // E5
        this.playNote(783.99, 'sine', now + 0.2); // G5
        this.playNote(1046.50, 'sine', now + 0.3, 0.4); // C6
    }

    playError() {
        // Low buzz
        this.playTone(150, 'sawtooth', 0.3, 0.1);
        setTimeout(() => this.playTone(100, 'sawtooth', 0.3, 0.1), 150);
    }

    playNote(freq, type, startTime, duration = 0.3) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
    }
}

// Global Instance
const sfx = new SoundManager();

// Auto-attach hover/click sounds to common elements
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('button, a, .term-box, .level-card');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => sfx.playHover());
        btn.addEventListener('click', () => sfx.playClick());
    });
});
