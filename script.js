import { startTimer } from "./startTimer.js";
import {
  session,
  setSessionStatus,
  setTimer,
  startCountDown,
  timer,
  paused,
  setPaused,
} from "./state.js";

const startBtn = document.querySelector("#startBtn");
const pauseBtn = document.querySelector("#pauseBtn");
const resetBtn = document.querySelector("#resetBtn");
const remainingTime = document.querySelector("#timeRemaining");
const cyclesBeforeLong = document.querySelector("#cyclesBeforeLong");

startBtn.addEventListener("click", () => {
  if (session.status === "inactive") {
    startCountDown();
    setSessionStatus("active");
  } else if (session.status === "short-break") {
    startCountDown();
  } else if (session.status === "long-break") {
    startCountDown();
  }
});

document.addEventListener("keydown", (e) => {
  let key = e.key;
  if (key === "Enter") {
    if (session.status === "inactive") {
      startCountDown();
      setSessionStatus("active");
    } else if (session.status === "short-break") {
      startCountDown();
    } else if (session.status === "long-break") {
      startCountDown();
    }
  }
});

pauseBtn.addEventListener("click", () => {
  if (paused.status) {
    let remainingTimeValue = remainingTime.textContent;
    const numbers = remainingTimeValue.split(":");
    numbers[0] = Number(numbers[0]);
    numbers[1] = Number(numbers[1]);
    const remainingSecs = numbers[0] * 60 + numbers[1];
    setTimer(startTimer(timer.status, remainingSecs, session));
    // timer = startTimer(timer, remainingSecs, session);
    pauseBtn.textContent = "Pause";
    setSessionStatus("active");
    setPaused(false);
  } else {
    clearInterval(timer.status);
    setPaused(true);
    setSessionStatus("inactive");
    pauseBtn.textContent = "Resume";
  }
});

resetBtn.addEventListener("click", () => {
  clearInterval(timer.status);
  remainingTime.textContent = "00:00";
  setPaused(true);
  cyclesBeforeLong.disabled = false;
  pauseBtn.textContent = "Pause";
  setSessionStatus("inactive");
});

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
