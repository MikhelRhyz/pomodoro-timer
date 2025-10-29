const timeRemaining = document.querySelector("#timeRemaining");
const cyclesBeforeLong = document.querySelector("#cyclesBeforeLong");
const progressBar = document.querySelector("#progressBar");
let round = 0;

export function startTimer(timer, seconds) {
    const soundSelect = document.querySelector("#soundSelect");
    let audioElement;
    let cycles = cyclesBeforeLong.value;
    let originalCycle = cycles;
    let sessionCount = document.querySelector("#sessionCount");
    sessionCount.textContent = `${round} / ${cycles} completed`;


    if (soundSelect.value === "default") {
        audioElement = document.querySelector("#audioDefault");
    } else if (soundSelect.value === "beep") {
        audioElement = document.querySelector("#audioBeep");
    }

    timer = setInterval(() => {
        if (seconds < 0) {
            clearInterval(timer);
            if (audioElement) audioElement.play();
            cycles--;
            cyclesBeforeLong.value = cycles;
            round++;
            progressBar.style.width = `${(round / originalCycle) * 100}%`;
            sessionCount.textContent = `${round} / ${cycles} completed`;
            return;
        }

        const min = String(Math.floor(seconds / 60));
        const sec = String(seconds % 60);
        seconds--;
        timeRemaining.textContent = `${min.padStart(2, "0")}:${sec.padStart(2, "0")}`;

    }, 1000);

    return timer;
}