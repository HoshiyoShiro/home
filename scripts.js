document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const datetime = document.getElementById('datetime');
    const downButton = document.getElementById('down-button');
    const modules = document.querySelectorAll('.module');
    const sidebar = document.getElementById('sidebar');
    const toggleSidebarButton = document.getElementById('toggle-sidebar');
    const themeToggle = document.getElementById('theme-toggle'); // Theme toggle button
    const audio = new Audio();
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');
    const playPauseButton = document.getElementById('play-pause');
    const stars = document.getElementById('stars');
    const sky = document.getElementById('sky'); // Reference to the sky for clouds
    let currentModuleIndex = 0;
    let isAnimating = false;
    let currentSongIndex = 0;
    let isLightMode = new Date().getHours() >= 6 && new Date().getHours() < 18;

    // Set initial mode based on time
    if (isLightMode) {
        setLightMode();
    } else {
        setDarkMode();
    }

    // Generate random stars
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDuration = `${Math.random() * 2 + 1}s`;
        stars.appendChild(star);
    }

    // Update the time and date
    function updateTime() {
        const now = new Date();
        const time = now.toLocaleTimeString();
        const date = now.toLocaleDateString();
        datetime.textContent = `${date} ${time}`;
    }

    setInterval(updateTime, 1000);
    updateTime();

    // Handle "v" button click to transition modules
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

    // Sidebar toggle functionality
    toggleSidebarButton.addEventListener('click', (event) => {
        event.stopPropagation();
        sidebar.classList.toggle('open');
        toggleSidebarButton.textContent = sidebar.classList.contains('open') ? '✖' : '☰';
    });

    // Audio Player functionality with links
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

    // Add controls for previous, play/pause, and next functionality
    document.getElementById('prev-track').addEventListener('click', () => {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
    });

    playPauseButton.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playPauseButton.innerHTML = '&#11200;'; // Pause icon
        } else {
            audio.pause();
            playPauseButton.innerHTML = '&#11208;'; // Play icon
        }
    });

    document.getElementById('next-track').addEventListener('click', () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
    });

    // Update progress bar and time display
    audio.addEventListener('timeupdate', () => {
        const progress = document.getElementById('progress');
        progress.value = (audio.currentTime / audio.duration) * 100;
        document.getElementById('current-time').textContent = formatTime(audio.currentTime);
        document.getElementById('duration').textContent = formatTime(audio.duration);
    });

    // Format time for display
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Load the first song on page load
    loadSong(currentSongIndex);

    // Set light mode
    function setLightMode() {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        stars.style.display = 'none';
        sky.style.display = 'block';
        initializeClouds();
    }

    // Set dark mode
    function setDarkMode() {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        stars.style.display = 'block';
        sky.style.display = 'none';
    }

    // Cloud animation for light mode
    function initializeClouds() {
        const skyEffect = new Sky(12, 18);
        requestAnimationFrame(() => animateClouds(skyEffect));
    }

    function animateClouds(skyEffect) {
        skyEffect.clouds.forEach(cloud => cloud.move());
        skyEffect.wisps.forEach(wisp => wisp.move());
        requestAnimationFrame(() => animateClouds(skyEffect));
    }

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            setDarkMode();
        } else {
            setLightMode();
        }
    });

    // Initialize the first module as visible
    modules[0].style.display = 'flex';
    modules[0].classList.add('active-module');
});

// Sky and Cloud classes
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
        
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        
        setTimeout(() => {
          this.element.style.opacity = '1';
        }, 100);
      }

      move() {
        this.x += this.speed;
        this.y += this.verticalSpeed;
        
        if (this.y > window.innerHeight || this.y < 0) {
          this.verticalSpeed = -this.verticalSpeed;
        }
        
        if (this.x > window.innerWidth || this.x < -this.width) {
          this.element.style.opacity = '0';
          setTimeout(() => {
            this.reset();
          }, 6000);
        }
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
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
        const numParts = Math.floor(this.width / 40); // Adjusted for more variable cloud parts
        
        for (let i = 0; i < numParts; i++) {
          const part = document.createElement('div');
          part.className = 'cloud-part';

          const size = Math.random() * (this.width * 0.6) + (this.width * 0.1);
          part.style.width = size + 'px';
          part.style.height = size + 'px';

          const xPos = (Math.random() * this.width) - (size / 2);
          const yPos = (Math.random() * this.height) - (size / 2);
          part.style.left = xPos + 'px';
          part.style.top = yPos + 'px';

          part.style.opacity = (Math.random() * 0.2 + 0.5).toString();
          const animDuration = Math.random() * 25 + 25; // Slower animation for natural feel
          part.style.animation = `shape-shift ${animDuration}s infinite ease-in-out`;

          this.element.appendChild(part);
        }
      }

      reset() {
        this.x = Math.random() * (window.innerWidth + this.width) - this.width;
        this.y = Math.random() * (window.innerHeight * 0.7);
        
        this.direction = Math.random() < 0.5 ? -1 : 1;
        this.speed = (Math.random() * 0.06 + 0.02) * this.direction; // Reduced max speed for smoothness
        
        const rotation = Math.random() * 8 - 4;
        this.element.style.transform = `rotate(${rotation}deg)`;
        
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        
        setTimeout(() => {
          this.element.style.opacity = '1';
        }, 100);
      }

      move() {
			this.x += this.speed;
			this.verticalOffset += 0.1 * this.verticalDirection;
			
			// Only render if cloud is in view, to reduce memory load
			if (this.x > window.innerWidth || this.x < -this.width) {
				this.element.style.visibility = 'hidden';
				setTimeout(() => this.reset(), 4000); // Reset with a delay to recycle element
			} else {
				this.element.style.visibility = 'visible';
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
			const animate = () => {
				this.clouds.forEach(cloud => cloud.move());
				this.wisps.forEach(wisp => wisp.move());
				requestAnimationFrame(animate);
			};
			requestAnimationFrame(animate);
		}
	}

    const skyEffect = new Sky(6, 10);  // Reduce to 6 cloud clusters and 10 wisps

