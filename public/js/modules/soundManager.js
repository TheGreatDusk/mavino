let audioContext = null;
const sounds = {};

export function initializeSoundManager() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    console.log('✓ Sound manager ready');
}

export function playSound(type) {
    if (!localStorage.getItem('sound') || localStorage.getItem('sound') === 'false') {
        return;
    }

    if (!audioContext) {
        initializeSoundManager();
    }

    const now = audioContext.currentTime;

    switch (type) {
        case 'success':
            playSuccessSound(now);
            break;
        case 'error':
            playErrorSound(now);
            break;
        case 'notification':
            playNotificationSound(now);
            break;
        case 'click':
            playClickSound(now);
            break;
    }
}

function playSuccessSound(now) {
    const osc1 = audioContext.createOscillator();
    const osc2 = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc1.frequency.value = 523.25; // C5
    osc2.frequency.value = 659.25; // E5

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(audioContext.destination);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc1.start(now);
    osc1.stop(now + 0.15);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.3);
}

function playErrorSound(now) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.frequency.setValueAtTime(400, now);
    osc.frequency.setValueAtTime(300, now + 0.1);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.start(now);
    osc.stop(now + 0.2);
}

function playNotificationSound(now) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.frequency.setValueAtTime(800, now);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.1);
}

function playClickSound(now) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.frequency.value = 600;

    osc.connect(gain);
    gain.connect(audioContext.destination);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.start(now);
    osc.stop(now + 0.05);
}

export function playNote(frequency, duration = 0.5) {
    if (!audioContext) {
        initializeSoundManager();
    }

    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.frequency.value = frequency;
    osc.connect(gain);
    gain.connect(audioContext.destination);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.start(now);
    osc.stop(now + duration);
}
