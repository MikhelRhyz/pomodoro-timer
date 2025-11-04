import { startTimer, resetRounds } from "./startTimer.js";
import {
  session,
  setSessionStatus,
  setTimer,
  startCountDown,
  timer,
  paused,
  setPaused,
  clearTimer,
} from "./state.js";

const startBtn = document.querySelector("#startBtn");
const pauseBtn = document.querySelector("#pauseBtn");
const resetBtn = document.querySelector("#resetBtn");
const remainingTime = document.querySelector("#timeRemaining");
const cyclesBeforeLong = document.querySelector("#cyclesBeforeLong");
const notifyDesktop = document.querySelector("#notifyDesktop");

startBtn.addEventListener("click", () => {
  if (session.status === "inactive") {
    startCountDown();
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
  // If there's no running timer and we're currently "paused", do nothing.
  if (timer === undefined && paused.status) return;

  // If currently paused -> resume
  if (paused.status) {
    // compute remaining seconds from the visible display
    const remainingTimeValue = remainingTime.textContent;
    const numbers = remainingTimeValue.split(":").map((n) => Number(n));
    const remainingSecs = numbers[0] * 60 + numbers[1];

    // start/resume the timer and store reference in state
    const result = startTimer(timer, remainingSecs, session);
    setTimer(result.timer);

    setPaused(false);
    setSessionStatus("active");
    pauseBtn.textContent = "Pause";
    return;
  }

  // Otherwise (not paused) -> pause
  clearTimer(); // stops interval stored in state.timer
  setPaused(true);
  setSessionStatus("inactive");
  pauseBtn.textContent = "Resume";
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

notifyDesktop.addEventListener("change", async () => {
  if (notifyDesktop.checked) {
    const permission = await Notification.requestPermission();

    if (Notification.permission !== "granted") {
      notifyDesktop.checked = false;
      alert("Permission denied to show desktop notifications.");
    }
  }
});
