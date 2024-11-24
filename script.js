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

    let isRepeating = false;

    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playPauseBtn.textContent = 'Pause';
        } else {
            audio.pause();
            playPauseBtn.textContent = 'Play';
        }
    });

    audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => {
        totalTimeDisplay.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('ended', () => {
        if (isRepeating) {
            audio.currentTime = 0;
            audio.play();
        } else {
            playPauseBtn.textContent = 'Play';
            if (index < playerArray.length - 1) {
                const nextPlayer = playerArray[index + 1];
                const nextAudio = nextPlayer.querySelector('.audio');
                const nextPlayPauseBtn = nextPlayer.querySelector('.playPauseBtn');
                nextAudio.play();
                nextPlayPauseBtn.textContent = 'Pause';
            }
        }
    });

    progressBar.addEventListener('input', () => {
        const time = (progressBar.value / 100) * audio.duration;
        audio.currentTime = time;
    });

    volumeControl.addEventListener('input', () => {
        audio.volume = volumeControl.value;
    });

    rewindBtn.addEventListener('click', () => {
        audio.currentTime -= 10;
    });

    forwardBtn.addEventListener('click', () => {
        audio.currentTime += 10;
    });

    repeatBtn.addEventListener('click', () => {
        isRepeating = !isRepeating;
        repeatBtn.textContent = isRepeating ? 'Repeat On' : 'Repeat';
    });

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
});
