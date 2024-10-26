document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const datetime = document.getElementById('datetime');
    const downButton = document.getElementById('down-button');
    const modules = document.querySelectorAll('.module');
    const sidebar = document.getElementById('sidebar');
    const toggleSidebarButton = document.getElementById('toggle-sidebar');
    const themeToggle = document.getElementById('theme-toggle');
    const audio = new Audio();
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');
    const playPauseButton = document.getElementById('play-pause');
    const stars = document.getElementById('stars');
    const sky = document.getElementById('sky');
    const volumeControl = document.getElementById('volume-control');
    const volumeIndicator = document.getElementById('volume-indicator');

    let currentModuleIndex = 0;
    let isAnimating = false;
    let currentSongIndex = 0;
    let isLightMode = new Date().getHours() >= 6 && new Date().getHours() < 18;

    // Additional Overlays
    const passwordOverlay = document.getElementById('password-generator-overlay');
    const regexOverlay = document.getElementById('regex-tester-overlay');
    const jsonOverlay = document.getElementById('json-formatter-overlay');
    const imageOverlay = document.getElementById('image-resizer-overlay');
    const ipOverlay = document.getElementById('ip-locator-overlay');
    const converterOverlay = document.getElementById('converter-overlay');
    const colorOverlay = document.getElementById('color-picker-overlay');
    const qrOverlay = document.getElementById('qr-generator-overlay');


    // Set initial mode based on time
    if (isLightMode) setLightMode();
    else setDarkMode();

    // Generate random stars
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDuration = `${Math.random() * 2 + 1}s`;
        stars.appendChild(star);
    }

    function updateTime() {
        const now = new Date();
        datetime.textContent = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    }
    setInterval(updateTime, 1000);
    updateTime();

    downButton.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;
        const currentModule = modules[currentModuleIndex];
        currentModuleIndex = (currentModuleIndex + 1) % modules.length;
        const nextModule = modules[currentModuleIndex];
        currentModule.classList.add('slide-up-out');
        currentModule.addEventListener('animationend', () => {
            currentModule.classList.remove('slide-up-out', 'active-module');
            currentModule.style.display = 'none';
            nextModule.style.display = 'flex';
            nextModule.classList.add('slide-up-in', 'active-module');
            nextModule.addEventListener('animationend', () => {
                nextModule.classList.remove('slide-up-in');
                isAnimating = false;
            }, { once: true });
        }, { once: true });
    });

    toggleSidebarButton.addEventListener('click', (event) => {
        event.stopPropagation();
        sidebar.classList.toggle('open');
        toggleSidebarButton.textContent = sidebar.classList.contains('open') ? '✖' : '☰';
    });

    const songs = [
        { title: 'Hope Is A Thing With Feathers', artist: 'Robin', src: 'https://files.catbox.moe/n9nikm.mp3' },
        { title: 'Flaaklypa', artist: 'K-391', src: 'https://files.catbox.moe/ko954o.mp3' },
        { title: 'I Really Want To Stay At Your House', artist: 'Rosa Walton', src: 'https://files.catbox.moe/ui85ed.mp3' },
        { title: 'Bad Apple', artist: 'Masayoshi Minoshima', src: 'https://files.catbox.moe/ay5par.mp3' }
    ];

    function loadSong(index) {
        const song = songs[index];
        audio.src = song.src;
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;
        audio.play();

        // Update the current song title in the header
        const currentSongDisplay = document.getElementById('current-song');
        currentSongDisplay.textContent = song.title;
        currentSongDisplay.style.opacity = 1; // Show the song title when a song is playing
    }

    // Optional: Reset the title when audio ends (if desired)
    audio.addEventListener('ended', () => {
        const currentSongDisplay = document.getElementById('current-song');
        currentSongDisplay.style.opacity = 0; // Hide the title when no song is playing
    });

    document.getElementById('prev-track').addEventListener('click', () => {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
    });

    playPauseButton.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playPauseButton.innerHTML = '&#11200;';
        } else {
            audio.pause();
            playPauseButton.innerHTML = '&#11208;';
        }
    });

    document.getElementById('next-track').addEventListener('click', () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
    });

    audio.addEventListener('timeupdate', () => {
        const progressBar = document.getElementById('progress');
        progressBar.value = (audio.currentTime / audio.duration) * 100;
        document.getElementById('current-time').textContent = formatTime(audio.currentTime);
        document.getElementById('duration').textContent = formatTime(audio.duration);
    });

    const progressBar = document.getElementById('progress');
    progressBar.addEventListener('input', () => {
        const seekTime = (progressBar.value / 100) * audio.duration;
        audio.currentTime = seekTime;
    });

    const volumeBar = document.getElementById('volume');
    volumeBar.addEventListener('input', () => {
        audio.volume = volumeBar.value;
    });

    loadSong(currentSongIndex);

    function setLightMode() {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        stars.style.display = 'none';
        sky.style.display = 'block';
        initializeClouds();
    }

    function setDarkMode() {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        stars.style.display = 'block';
        sky.style.display = 'none';
    }

    function initializeClouds() {
        const skyEffect = new Sky(12, 18);
        requestAnimationFrame(() => animateClouds(skyEffect));
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) setDarkMode();
        else setLightMode();
    });

    modules[0].style.display = 'flex';
    modules[0].classList.add('active-module');

    // Tool-specific functions for overlays
	window.openOverlay = (id) => document.getElementById(id).style.display = 'flex';
	window.closeOverlay = (id) => document.getElementById(id).style.display = 'none';

	// Password Generator
	window.generatePassword = () => {
		const includeLowercase = document.getElementById('include-lowercase').checked;
		const includeUppercase = document.getElementById('include-uppercase').checked;
		const includeNumbers = document.getElementById('include-numbers').checked;
		const includeSymbols = document.getElementById('include-symbols').checked;
		const passwordLength = document.getElementById('password-length').value;
		const generatedPasswordField = document.getElementById('generated-password');

		const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
		const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const numberChars = '0123456789';
		const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';

		let chars = '';
		if (includeLowercase) chars += lowercaseChars;
		if (includeUppercase) chars += uppercaseChars;
		if (includeNumbers) chars += numberChars;
		if (includeSymbols) chars += symbolChars;

		let password = '';
		for (let i = 0; i < passwordLength; i++) {
			password += chars.charAt(Math.floor(Math.random() * chars.length));
		}

		generatedPasswordField.value = password;
	};


    // Regex Tester
    window.testRegex = () => {
        const pattern = document.getElementById('regex-pattern').value;
        const text = document.getElementById('regex-text').value;
        const regex = new RegExp(pattern);
        const results = text.match(regex);
        document.getElementById('regex-results').innerText = results ? results.join(", ") : "No match found";
    };

    // JSON Formatter
    window.formatJSON = () => {
        const jsonInput = document.getElementById('json-input').value;
        try {
            const parsedJson = JSON.parse(jsonInput);
            document.getElementById('json-output').innerText = JSON.stringify(parsedJson, null, 2);
        } catch (e) {
            document.getElementById('json-output').innerText = "Invalid JSON";
        }
    };

    // Converters
    window.convertFromBinary = () => {
        const binary = document.getElementById('binary').value;
        document.getElementById('decimal').value = parseInt(binary, 2);
        document.getElementById('hexadecimal').value = parseInt(binary, 2).toString(16).toUpperCase();
    };

    window.convertFromDecimal = () => {
        const decimal = document.getElementById('decimal').value;
        document.getElementById('binary').value = parseInt(decimal, 10).toString(2);
        document.getElementById('hexadecimal').value = parseInt(decimal, 10).toString(16).toUpperCase();
    };

    window.convertFromHex = () => {
        const hex = document.getElementById('hexadecimal').value;
        document.getElementById('binary').value = parseInt(hex, 16).toString(2);
        document.getElementById('decimal').value = parseInt(hex, 16);
    };

    // QR Code Generator
    window.generateQR = () => {
        const text = document.getElementById('qr-input').value;
        document.getElementById('qr-image').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(text)}`;
    };
});


// Optimized Cloud and Sky classes
class CloudWisp {
    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'cloud-wisp';
        
        this.width = Math.random() * 300 + 200;
        this.height = Math.random() * 20 + 10;
        
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        
        this.reset();
    }

    reset() {
        this.x = Math.random() * (window.innerWidth + this.width) - this.width;
        this.y = Math.random() * window.innerHeight;
        
        this.direction = Math.random() < 0.5 ? -1 : 1;
        this.speed = (Math.random() * 0.2 + 0.1) * this.direction;
        this.verticalSpeed = Math.random() * 0.05 - 0.025;
        
        this.rotation = Math.random() * 20 - 10;
        this.element.style.transform = `rotate(${this.rotation}deg)`;
        
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.opacity = '1';
    }

    move() {
        this.x += this.speed;
        this.y += this.verticalSpeed;
        
        if (this.x > window.innerWidth || this.x < -this.width) {
            this.reset();
        } else {
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
        }
    }
}

class CloudCluster {
    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'cloud-cluster';
        this.width = Math.random() * 400 + 300;
        this.height = this.width * 0.7;
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        
        this.verticalOffset = 0;
        this.verticalDirection = Math.random() < 0.5 ? 1 : -1;
        
        this.createCloudParts();
        this.reset();
    }

    createCloudParts() {
        const numParts = Math.floor(this.width / 40);
        for (let i = 0; i < numParts; i++) {
            const part = document.createElement('div');
            part.className = 'cloud-part';

            const size = Math.random() * (this.width * 0.6) + (this.width * 0.1);
            part.style.width = `${size}px`;
            part.style.height = `${size}px`;

            const xPos = Math.random() * this.width - size / 2;
            const yPos = Math.random() * this.height - size / 2;
            part.style.left = `${xPos}px`;
            part.style.top = `${yPos}px`;

            part.style.opacity = (Math.random() * 0.2 + 0.5).toString();
            const animDuration = Math.random() * 25 + 25;
            part.style.animation = `shape-shift ${animDuration}s infinite ease-in-out`;

            this.element.appendChild(part);
        }
    }

    reset() {
        this.x = Math.random() * (window.innerWidth + this.width) - this.width;
        this.y = Math.random() * (window.innerHeight * 0.7);
        
        this.direction = Math.random() < 0.5 ? -1 : 1;
        this.speed = (Math.random() * 0.06 + 0.02) * this.direction;
        
        const rotation = Math.random() * 8 - 4;
        this.element.style.transform = `rotate(${rotation}deg)`;
        
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.opacity = '1';
    }

    move() {
        this.x += this.speed;
        this.verticalOffset += 0.1 * this.verticalDirection;
        
        if (Math.abs(this.verticalOffset) > 20) {
            this.verticalDirection *= -1;
        }
        
        if (this.x > window.innerWidth || this.x < -this.width) {
            this.reset();
        } else {
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y + this.verticalOffset}px`;
        }
    }
}

class Sky {
    constructor(numClouds, numWisps) {
        this.clouds = [];
        this.wisps = [];
        const sky = document.getElementById('sky');
        
        for (let i = 0; i < numClouds; i++) {
            const cloud = new CloudCluster();
            cloud.element.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
            this.clouds.push(cloud);
            sky.appendChild(cloud.element);
        }

        for (let i = 0; i < numWisps; i++) {
            const wisp = new CloudWisp();
            wisp.element.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
            this.wisps.push(wisp);
            sky.appendChild(wisp.element);
        }
        
        this.startAnimation();
    }

    startAnimation() {
        let frameCount = 0;

        const animate = () => {
            frameCount++;

            // Only update every 2 frames to reduce load
            if (frameCount % 2 === 0) {
                this.clouds.forEach(cloud => cloud.move());
                this.wisps.forEach(wisp => wisp.move());
            }
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }
}

// Initialize with fewer clouds and wisps
const skyEffect = new Sky(4, 6);  // Adjusted to further reduce memory load
