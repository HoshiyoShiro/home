document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const stars = document.getElementById('stars');
    const datetime = document.getElementById('datetime');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const modules = document.querySelectorAll('.module');
    let currentModuleIndex = 0;

    // Set initial mode based on time
    const now = new Date();
    const hours = now.getHours();
    if (hours >= 6 && hours < 18) {
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

    // Module switching logic
    function showModule(index, direction) {
        const currentModule = modules[currentModuleIndex];
        const nextModule = modules[index];

        currentModule.classList.remove('active-module', 'slide-in-right', 'slide-in-left', 'slide-out-right', 'slide-out-left');
        nextModule.classList.remove('active-module', 'slide-in-right', 'slide-in-left', 'slide-out-right', 'slide-out-left');

        if (direction === 'next') {
            currentModule.classList.add('slide-out-left');
            nextModule.classList.add('slide-in-right');
        } else {
            currentModule.classList.add('slide-out-right');
            nextModule.classList.add('slide-in-left');
        }

        setTimeout(() => {
            currentModule.classList.remove('active-module', 'slide-in-right', 'slide-in-left', 'slide-out-right', 'slide-out-left');
            nextModule.classList.add('active-module');
            currentModuleIndex = index;
        }, 500); // Match the duration of the CSS animation
    }

    prevButton.addEventListener('click', () => {
        console.log('Previous button clicked'); // Debugging log
        const nextModuleIndex = (currentModuleIndex - 1 + modules.length) % modules.length;
        showModule(nextModuleIndex, 'prev');
    });

    nextButton.addEventListener('click', () => {
        console.log('Next button clicked'); // Debugging log
        const nextModuleIndex = (currentModuleIndex + 1) % modules.length;
        showModule(nextModuleIndex, 'next');
    });

    // Show initial module
    showModule(currentModuleIndex, 'next');

    function setLightMode() {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
    }

    function setDarkMode() {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
    }
});
