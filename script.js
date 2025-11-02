import { startTimer } from "./startTimer.js";
import { session, setSessionStatus } from "./state.js";

const startBtn = document.querySelector("#startBtn");
const pauseBtn = document.querySelector("#pauseBtn");
const resetBtn = document.querySelector("#resetBtn");
const workInput = document.querySelector("#workInput");
const remainingTime = document.querySelector("#timeRemaining");
const cyclesBeforeLong = document.querySelector("#cyclesBeforeLong");
const shortBreakInput = document.querySelector("#shortBreakInput");
let paused = true;
let timer = undefined;
let seconds = 0;

startBtn.addEventListener("click", () => {
    if (session.status === "inactive") {
        startCountDown();
        setSessionStatus("active");
    } else if (session.status === "short-break") {
        startCountDown();
    }
});

workInput.addEventListener("keydown", (e) => {
    let key = e.key;
    if (key === "Enter") {
        if (session.status === "inactive") {
            startCountDown();
            setSessionStatus("active");
        }
    }
})

pauseBtn.addEventListener("click", () => {

    if (paused) {
        let remainingTimeValue = remainingTime.textContent;
        const numbers = remainingTimeValue.split(":");
        numbers[0] = Number(numbers[0]);
        numbers[1] = Number(numbers[1]);
        const remainingSecs = (numbers[0] * 60) + numbers[1];
        timer = startTimer(timer, remainingSecs, session);
        pauseBtn.textContent = "Pause";
        setSessionStatus("active");
        paused = false;
    } else {
        clearInterval(timer);
        paused = true;
        setSessionStatus("inactive");
        pauseBtn.textContent = "Resume";
    }
});

resetBtn.addEventListener("click", () => {
    clearInterval(timer);
    remainingTime.textContent = "00:00";
    paused = true;
    cyclesBeforeLong.disabled = false;
    pauseBtn.textContent = "Pause";
    setSessionStatus("inactive");
});

function startCountDown() {
    if (session.status === "inactive") {
        clearInterval(timer);
        setSessionStatus("active");
        const workInputValue = Number(workInput.value);
        seconds = workInputValue * 60;
        timer = startTimer(timer, seconds, session).timer;
        paused = false;
        cyclesBeforeLong.disabled = true;
    } else if (session.status === "short-break") {
        clearInterval(timer);
        const breakInputValue = Number(shortBreakInput.value);
        seconds = breakInputValue * 60;
        timer = startTimer(timer, seconds, session).timer;
        paused = false;
        cyclesBeforeLong.disabled = true;
    }
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