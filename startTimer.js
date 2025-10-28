const timeRemaining = document.querySelector("#timeRemaining");
const soundSelect = document.querySelector("#soundSelect");
let soundPath = undefined;
if (soundSelect.value === "default") {
    soundPath = document.querySelector("#audioDefault").querySelector("source").src;
}
const myAudio = new Audio(soundPath);

export function startTimer(timer, seconds) {
    timer = setInterval(() => {

        if (seconds <= 0) {
            clearInterval(timer);
            myAudio.play();
        }

        const min = String(Math.floor(seconds / 60));
        const sec = String(seconds % 60);

        timeRemaining.textContent = `${min.padStart(2, "0")}:${sec.padStart(2, "0")}`;
        seconds--;

    }, 1000);

    return timer;
}