document.addEventListener('DOMContentLoaded', function() {
    const globalPlayPauseBtn = document.getElementById('global-play-pause-btn');
    const globalVolumeControl = document.getElementById('global-volume-control');
    let currentAudio = null;

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
        const playingContainer = document.getElementById('current-playing-container');
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
                    audioPlayer.currentTime = 0;
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
                pauseAllAudio(audio);
                audio.play();
                isCurrentPlaying = true;
                playPauseBtn.textContent = 'Pause';
                globalPlayPauseBtn.textContent = 'Pause';
                currentPlayingContainer.textContent = `Now Playing: ${songTitle}`;
                playingContainer.classList.add('show');
                currentProgressBar.max = audio.duration;
                currentProgressBar.value = audio.currentTime;
                currentProgressTime.textContent = formatTime(audio.currentTime);
                totalProgressTime.textContent = formatTime(audio.duration);
                currentAudio = audio;
                globalVolumeControl.value = audio.volume; // Sync global volume control with audio volume
            } else {
                audio.pause();
                isCurrentPlaying = false;
                playPauseBtn.textContent = 'Play';
                globalPlayPauseBtn.textContent = 'Play';
                currentPlayingContainer.textContent = 'No song is playing right now.';
                playingContainer.classList.remove('show');
                currentAudio = null;
            }
        }

        function updateProgress() {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.value = progress;
            if (isCurrentPlaying) {
                currentProgressBar.value = audio.currentTime;
                currentProgressTime.textContent = formatTime(audio.currentTime);
            }
            currentTimeDisplay.textContent = formatTime(audio.currentTime);
        }

        function displayTotalTime() {
            totalTimeDisplay.textContent = formatTime(audio.duration);
            if (isCurrentPlaying) {
                currentProgressBar.max = audio.duration;
                totalProgressTime.textContent = formatTime(audio.duration);
            }
        }

        function handleAudioEnd() {
            playPauseBtn.textContent = 'Play';
            globalPlayPauseBtn.textContent = 'Play';
            currentPlayingContainer.textContent = 'No song is playing right now.';
            currentProgressBar.value = 0;
            if (isRepeating) {
                audio.currentTime = 0;
                audio.play();
                playPauseBtn.textContent = 'Pause';
                globalPlayPauseBtn.textContent = 'Pause';
                currentPlayingContainer.textContent = `Now Playing: ${songTitle}`;
            } else {
                if (index < playerArray.length - 1) {
                    const nextPlayer = playerArray[index + 1];
                    const nextAudio = nextPlayer.querySelector('.audio');
                    const nextPlayPauseBtn = nextPlayer.querySelector('.playPauseBtn');
                    const nextSongTitle = nextPlayer.dataset.title;
                    pauseAllAudio(nextAudio);
                    nextAudio.play();
                    nextPlayPauseBtn.textContent = 'Pause';
                    globalPlayPauseBtn.textContent = 'Pause';
                    currentPlayingContainer.textContent = `Now Playing: ${nextSongTitle}`;
                    isCurrentPlaying = true;
                    currentProgressBar.max = nextAudio.duration;
                    currentProgressBar.value = nextAudio.currentTime;
                    currentProgressTime.textContent = formatTime(nextAudio.currentTime);
                    totalProgressTime.textContent = formatTime(nextAudio.duration);

                    nextAudio.addEventListener('timeupdate', () => {
                        currentProgressBar.value = nextAudio.currentTime;
                        currentProgressTime.textContent = formatTime(nextAudio.currentTime);
                    });
                }
            }
        }

        function seekAudio(event) {
            if (isCurrentPlaying) {
                const time = event.target.value;
                audio.currentTime = time;
                progressBar.value = (audio.currentTime / audio.duration) * 100;
            }
        }

        function changeVolume() {
            audio.volume = volumeControl.value;
        }

        function changeGlobalVolume() {
            if (currentAudio) {
                currentAudio.volume = globalVolumeControl.value;
            }
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
        globalVolumeControl.addEventListener('input', changeGlobalVolume); // Add event listener for global volume control
        rewindBtn.addEventListener('click', rewindAudio);
        forwardBtn.addEventListener('click', forwardAudio);
        repeatBtn.addEventListener('click', toggleRepeat);
    });

    globalPlayPauseBtn.addEventListener('click', () => {
        if (currentAudio) {
            currentAudio.paused ? currentAudio.play() : currentAudio.pause();
            globalPlayPauseBtn.textContent = currentAudio.paused ? 'Play' : 'Pause';
        }
    });
});
