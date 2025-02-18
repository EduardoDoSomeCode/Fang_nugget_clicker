const audio = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPause");
const trackSelector = document.getElementById("trackSelector");
const volumeControl = document.getElementById("volumeControl");


const draggable = document.getElementById("draggablePlayer");

let offsetX, offsetY, isDragging = false;

draggable.addEventListener("mousedown", (event) => {
    isDragging = true;
    offsetX = event.clientX - draggable.offsetLeft;
    offsetY = event.clientY - draggable.offsetTop;
    draggable.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (event) => {
    if (isDragging) {
        draggable.style.left = `${event.clientX - offsetX}px`;
        draggable.style.top = `${event.clientY - offsetY}px`;
    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    draggable.style.cursor = "grab";
});



playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.textContent = "Pause";
    } else {
        audio.pause();
        playPauseBtn.textContent = "Play";
    }
});

trackSelector.addEventListener("change", (event) => {
    audio.src = event.target.value;
    audio.play();
    playPauseBtn.textContent = "Pause";
});

volumeControl.addEventListener("input", (event) => {
    audio.volume = event.target.value;
});