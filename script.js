document.querySelectorAll('.audio-player').forEach((player, index, playerArray) => {
    const audio = player.querySelector('.audio');
    const playPauseBtn = player.querySelector('.playPauseBtn');
    const progressBar = player.querySelector('.progressBar');
    const currentTimeDisplay = player.querySelector('.currentTime');
    const totalTimeDisplay = player.querySelector('.totalTime');
    const volumeControl = player.querySelector('.volumeControl');
    const rewindBtn = player.querySelector('.rewindBtn');
    const forwardBtn = player.querySelector('.forwardBtn');
    const repeatBtn = player.querySelector('.repeatBtn');
    const currentPlayingContainer = document.getElementById('current-playing');
    const currentProgressBar = document.getElementById('current-progress-bar');
    const currentProgressTime = document.getElementById('current-time');
    const totalProgressTime = document.getElementById('total-time');
    const songTitle = player.dataset.title;
    let isRepeating = false;
    let isCurrentPlaying = false;

    function pauseAllAudio(exceptAudio) {
        document.querySelectorAll('.audio').forEach(audioPlayer => {
            if (audioPlayer !== exceptAudio) {
                audioPlayer.pause();
                audioPlayer.currentTime = 0; // Optionally reset to the start
            }
        });
        document.querySelectorAll('.playPauseBtn').forEach(button => {
            if (button !== playPauseBtn) {
                button.textContent = 'Play';
            }
        });
    }

    function togglePlayPause() {
        if (audio.paused) {
            pauseAllAudio(audio); // Pause all other audio players and update their play buttons
            audio.play();
            isCurrentPlaying = true;
            playPauseBtn.textContent = 'Pause';
            currentPlayingContainer.textContent = `Now Playing: ${songTitle}`;
            currentProgressBar.max = audio.duration; // Set max value to audio duration in seconds
            currentProgressBar.value = audio.currentTime;
            currentProgressTime.textContent = formatTime(audio.currentTime);
            totalProgressTime.textContent = formatTime(audio.duration);
        } else {
            audio.pause();
            isCurrentPlaying = false;
            playPauseBtn.textContent = 'Play';
            currentPlayingContainer.textContent = 'No song is playing right now.';
        }
    }

    function updateProgress() {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
        if (isCurrentPlaying) {
            currentProgressBar.value = audio.currentTime; // Update value directly as current time
            currentProgressTime.textContent = formatTime(audio.currentTime);
        }
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
    }

    function displayTotalTime() {
        totalTimeDisplay.textContent = formatTime(audio.duration);
        if (isCurrentPlaying) {
            currentProgressBar.max = audio.duration; // Ensure max value is set correctly
            totalProgressTime.textContent = formatTime(audio.duration);
        }
    }

    function handleAudioEnd() {
        playPauseBtn.textContent = 'Play';
        currentPlayingContainer.textContent = 'No song is playing right now.';
        currentProgressBar.value = 0;
        if (isRepeating) {
            audio.currentTime = 0;
            audio.play();
            playPauseBtn.textContent = 'Pause';
            currentPlayingContainer.textContent = `Now Playing: ${songTitle}`;
        } else {
            if (index < playerArray.length - 1) {
                const nextPlayer = playerArray[index + 1];
                const nextAudio = nextPlayer.querySelector('.audio');
                const nextPlayPauseBtn = nextPlayer.querySelector('.playPauseBtn');
                const nextSongTitle = nextPlayer.dataset.title;
                pauseAllAudio(nextAudio); // Pause all other audio players
                nextAudio.play();
                nextPlayPauseBtn.textContent = 'Pause';
                currentPlayingContainer.textContent = `Now Playing: ${nextSongTitle}`;
                isCurrentPlaying = true;
                currentProgressBar.max = nextAudio.duration;
                currentProgressBar.value = nextAudio.currentTime;
                currentProgressTime.textContent = formatTime(nextAudio.currentTime);
                totalProgressTime.textContent = formatTime(nextAudio.duration);

                // Update progress bar and time display while playing
                nextAudio.addEventListener('timeupdate', () => {
                    currentProgressBar.value = nextAudio.currentTime;
                    currentProgressTime.textContent = formatTime(nextAudio.currentTime);
                });
            }
        }
    }

    function seekAudio(event) {
        if (isCurrentPlaying) {
            const time = event.target.value; // Directly use the value as time in seconds
            audio.currentTime = time;
            progressBar.value = (audio.currentTime / audio.duration) * 100; // Sync progress bar with duration
        }
    }

    function changeVolume() {
        audio.volume = volumeControl.value;
    }

    function rewindAudio() {
        audio.currentTime -= 10;
    }

    function forwardAudio() {
        audio.currentTime += 10;
    }

    function toggleRepeat() {
        isRepeating = !isRepeating;
        repeatBtn.textContent = isRepeating ? 'Repeat On' : 'Repeat';
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    playPauseBtn.addEventListener('click', togglePlayPause);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', displayTotalTime);
    audio.addEventListener('ended', handleAudioEnd);
    progressBar.addEventListener('input', seekAudio);
    currentProgressBar.addEventListener('input', event => {
        currentProgressBar.classList.add('dragging');
        seekAudio(event);
    });
    currentProgressBar.addEventListener('change', () => {
        currentProgressBar.classList.remove('dragging');
    });
    volumeControl.addEventListener('input', changeVolume);
    rewindBtn.addEventListener('click', rewindAudio);
    forwardBtn.addEventListener('click', forwardAudio);
    repeatBtn.addEventListener('click', toggleRepeat);
});
