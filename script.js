import { startTimer } from "./startTimer.js";

const startBtn = document.querySelector("#startBtn");
const pauseBtn = document.querySelector("#pauseBtn");
const resetBtn = document.querySelector("#resetBtn");
const workInput = document.querySelector("#workInput");
const remainingTime = document.querySelector("#timeRemaining");
const cyclesBeforeLong = document.querySelector("#cyclesBeforeLong");
let paused = true;

let timer = undefined;
let seconds = 0;

startBtn.addEventListener("click", () => {
    startCountDown();
});

workInput.addEventListener("keydown", (e) => {
    let key = e.key;
    if (key === "Enter") {
        startCountDown();
    }
})

pauseBtn.addEventListener("click", () => {

    if (paused) {
        let remainingTimeValue = remainingTime.textContent;
        const numbers = remainingTimeValue.split(":");
        numbers[0] = Number(numbers[0]);
        numbers[1] = Number(numbers[1]);
        const remainingSecs = (numbers[0] * 60) + numbers[1];
        timer = startTimer(timer, remainingSecs);
        pauseBtn.textContent = "Pause";
        paused = false;
    } else {
        clearInterval(timer);
        paused = true;
        pauseBtn.textContent = "Resume";
    }
});

resetBtn.addEventListener("click", () => {
    clearInterval(timer);
    remainingTime.textContent = "00:00";
    paused = true;
    cyclesBeforeLong.disabled = false;
    pauseBtn.textContent = "Pause";
});

function startCountDown() {
    clearInterval(timer);
    const workInputValue = Number(workInput.value);
    seconds = workInputValue * 60;
    timer = startTimer(timer, seconds);
    paused = false;
    cyclesBeforeLong.disabled = true;
}

const testSoundBtn = document.querySelector("#testSoundBtn");

testSoundBtn.addEventListener("click", () => {
    const soundSelect = document.querySelector("#soundSelect").value;
    let audioElement;

    if (soundSelect === "default") {
        audioElement = document.querySelector("#audioDefault");
    } else if (soundSelect === "beep") {
        audioElement = document.querySelector("#audioBeep");
    }

    if (audioElement) audioElement.play();
});